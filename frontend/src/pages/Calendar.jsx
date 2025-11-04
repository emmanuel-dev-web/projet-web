import React, { useState, useEffect, useCallback } from "react";
import {API_URL} from "../config.js";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlus, 
  FaFilter,
  FaCalendarAlt,
  FaTasks,
  FaProjectDiagram,
  FaUsers,
  FaClipboardList,
  FaFolderOpen,
  FaUserFriends
} from "react-icons/fa";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, day
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    tasks: true,
    projects: true,
    teams: true,
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    status: "planifie",
    projectId: ""
  });

  // Récupérer le token d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fonction pour charger les données du calendrier
  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Utiliser la nouvelle API Calendar qui agrège tout
      const response = await fetch("http://localhost:3001/api/calendar/events", { 
        headers: getAuthHeaders() 
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger les projets disponibles
  const loadAvailableProjects = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/api/calendar/projects", {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.projects)) {
          setAvailableProjects(data.projects);
        } else {
          setAvailableProjects([]);
        }
      } else {
        setAvailableProjects([]);
      }
    } catch {
      setAvailableProjects([]);
    }
  }, []);

  // Charger toutes les données au démarrage
  useEffect(() => {
    loadCalendarData();
    loadAvailableProjects();
  }, [loadCalendarData, loadAvailableProjects]);

  // Navigation du calendrier
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (view === "day") {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Gestionnaire de création d'événement
  const handleCreateEvent = async () => {

    if (!newEvent.title.trim()) return;
    
    // Vérifier qu'un projet est sélectionné
    if (!newEvent.projectId) {
      alert("Veuillez sélectionner un projet pour cet événement");
      return;
    }
    
    try {
      // Détermine la date de l'événement
      let eventDate = newEvent.date;
      if (!eventDate && selectedDate) {
        // Utiliser la date sélectionnée dans le calendrier - format YYYY-MM-DD local
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        eventDate = `${year}-${month}-${day}`;
      } else if (!eventDate) {
        // Utiliser la date actuelle par défaut - format YYYY-MM-DD local
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        eventDate = `${year}-${month}-${day}`;
      }
      


      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: eventDate,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        status: newEvent.status,
        projectId: newEvent.projectId
      };
      


      const response = await fetch("http://localhost:3001/api/calendar/events", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        // Message de succès en vert
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#10B981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:500';
        successDiv.textContent = ' Événement créé avec succès !';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 3000);
        
        // Recharger les données du calendrier
        await loadCalendarData();

        // Fermer la modal et réinitialiser le formulaire
        setShowEventModal(false);
        setNewEvent({ 
          title: "", 
          description: "",
          date: "", 
          startTime: "09:00", 
          endTime: "10:00", 
          status: "planifie",
          projectId: ""
        });
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la création de l'événement: ${errorData.message}`);
      }
    } catch {
      alert("Erreur lors de la création de l'événement");
    }
  };

  // Gestionnaire d'édition d'événement
  const handleEditEvent = async () => {
    if (!editingEvent || !editingEvent.title.trim()) return;
    
    try {
      const eventData = {
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        status: editingEvent.status,
        projectId: editingEvent.projectId
      };

      const response = await fetch(`http://localhost:3001/api/calendar/events/${editingEvent._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        // Message de succès en vert
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#10B981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:500';
        successDiv.textContent = ' Événement modifié avec succès !';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 3000);
        
        await loadCalendarData();
        setShowEditModal(false);
        setEditingEvent(null);
        setShowEventDetails(false);
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la modification de l'événement: ${errorData.message}`);
      }
    } catch {
      alert("Erreur lors de la modification de l'événement");
    }
  };

  // Gestionnaire de suppression d'événement
  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/calendar/events/${eventId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        // Message de succès en vert
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#10B981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:500';
        successDiv.textContent = '✅ Événement supprimé avec succès !';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 3000);
        
        await loadCalendarData();
        setShowEventDetails(false);
        setSelectedEvent(null);
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la suppression de l'événement: ${errorData.message}`);
      }
    } catch {
      alert("Erreur lors de la suppression de l'événement");
    }
  };

  // Gestionnaire pour ouvrir l'édition
  const openEditModal = (event) => {
    setEditingEvent({
      _id: event.data._id,
      title: event.data.title,
      description: event.data.description || "",
      date: event.date.split('T')[0], // Format YYYY-MM-DD
      startTime: event.data.startTime,
      endTime: event.data.endTime,
      status: event.data.status,
      projectId: event.data.projectId
    });
    setShowEditModal(true);
  };

  // Gestionnaire de clic sur événement
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Gestionnaire de clic sur date
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({
      ...newEvent,
      date: date.toISOString().split('T')[0]
    });
    setShowEventModal(true);
  };

  // Générer la grille du calendrier mensuel
  const generateMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startCalendar = new Date(firstDay);
    startCalendar.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startCalendar);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Obtenir la couleur d'un événement selon son statut
  const getEventColor = (event) => {
    if (event.color) return event.color; // Si la couleur est déjà définie
    
    if (event.type === "event" && event.status) {
      // Couleurs selon le statut pour les événements personnalisés
      switch (event.status) {
        case "planifie":
          return "bg-blue-500"; // Bleu pour planifié
        case "en_cours":
          return "bg-orange-500"; // Orange pour en cours
        case "termine":
          return "bg-green-500"; // Vert pour terminé
        case "annule":
          return "bg-red-500"; // Rouge pour annulé
        default:
          return "bg-gray-500"; // Gris par défaut
      }
    }
    
    // Couleurs par défaut selon le type
    switch (event.type) {
      case "task":
        return "bg-blue-500";
      case "project":
        return "bg-indigo-500";
      case "team":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Filtrer les événements par date
  const getEventsForDate = (date) => {
    // Format de la date recherchée (local)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return events.filter(event => {
      // Extraire la date de l'événement (format YYYY-MM-DD)
      const eventDate = event.date.split('T')[0];
      
      // Gérer tous les types d'événements
      let typeFilter;
      if (event.type === "task") {
        typeFilter = filters.tasks;
      } else if (event.type === "project") {
        typeFilter = filters.projects;
      } else if (event.type === "team") {
        typeFilter = filters.teams;
      } else if (event.type === "event") {
        // Les événements personnalisés sont toujours affichés
        typeFilter = true;
      } else {
        typeFilter = true; // Afficher par défaut les types inconnus
      }
      
      const matchesDate = eventDate === dateStr;
      return matchesDate && typeFilter;
    });
  };

  // Formater la date pour l'affichage
  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", { 
      weekday: "long", 
      year: "numeric", 
      month: "long"
    });
  };

  const monthGrid = generateMonthGrid();
  const today = new Date();

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Calendrier
          </h1>
          <p className="text-gray-500 mt-1">
            {formatDate(currentDate)}
          </p>
        </div>

        {/* Contrôles de navigation */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sélecteur de vue */}
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border">
            {["month", "week", "day"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                  view === viewType
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {viewType === "month" ? "Mois" : viewType === "week" ? "Semaine" : "Jour"}
              </button>
            ))}
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
            <FaFilter className="text-gray-500" />
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tasks}
                onChange={(e) => setFilters({...filters, tasks: e.target.checked})}
                className="text-blue-600"
              />
              <FaTasks className="text-blue-500 text-sm" />
              <span className="text-sm">Tâches</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.projects}
                onChange={(e) => setFilters({...filters, projects: e.target.checked})}
                className="text-indigo-600"
              />
              <FaProjectDiagram className="text-indigo-500 text-sm" />
              <span className="text-sm">Projets</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.teams}
                onChange={(e) => setFilters({...filters, teams: e.target.checked})}
                className="text-purple-600"
              />
              <FaUsers className="text-purple-500 text-sm" />
              <span className="text-sm">Équipes</span>
            </label>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
              title={`${view === "month" ? "Mois" : view === "week" ? "Semaine" : "Jour"} précédent`}
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
              title={`${view === "month" ? "Mois" : view === "week" ? "Semaine" : "Jour"} suivant`}
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Bouton Créer */}
          <button
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Nouvel événement
          </button>
        </div>
      </div>

      {/* Panneau de filtres et statistiques */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Filtres par type */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Afficher:</span>
            {[
              { key: 'tasks', label: 'Tâches', icon: FaClipboardList, color: 'bg-blue-100 text-blue-700', activeColor: 'bg-blue-500 text-white' },
              { key: 'projects', label: 'Projets', icon: FaFolderOpen, color: 'bg-indigo-100 text-indigo-700', activeColor: 'bg-indigo-500 text-white' },
              { key: 'teams', label: 'Équipes', icon: FaUserFriends, color: 'bg-purple-100 text-purple-700', activeColor: 'bg-purple-500 text-white' }
            // eslint-disable-next-line no-unused-vars
            ].map(({ key, label, icon: IconComponent, color, activeColor }) => (
              <button
                key={key}
                onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`px-3 py-1.5 rounded-full text-sm transition-all font-medium flex items-center gap-2 ${
                  filters[key] ? activeColor : color + ' hover:opacity-75'
                }`}
              >
                <IconComponent className="text-xs" />
                {label}
              </button>
            ))}
          </div>

          {/* Statistiques */}
          <div className="flex gap-4 text-sm text-gray-600 ml-auto">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {events.filter(e => e.type === 'task' && filters.tasks).length} tâches
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              {events.filter(e => e.type === 'project' && filters.projects).length} projets  
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              {events.filter(e => e.type === 'team' && filters.teams).length} équipes
            </span>
            {loading && (
              <span className="text-blue-600 flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Mise à jour...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Calendrier */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Chargement du calendrier...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7">
            {monthGrid.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = 
                date.toDateString() === today.toDateString();
              const dayEvents = getEventsForDate(date);

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                    !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                  } ${isToday ? "bg-blue-100" : ""}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : ""}`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Événements du jour */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-2 py-1 rounded text-white truncate ${getEventColor(event)} cursor-pointer hover:opacity-80 transition-opacity`}
                        title={`${event.title} (${event.status || event.type})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {event.type === 'task' && <FaTasks className="text-xs" />}
                          {event.type === 'project' && <FaProjectDiagram className="text-xs" />}
                          {event.type === 'team' && <FaUsers className="text-xs" />}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal pour créer un événement */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-600" />
              Nouvel événement
            </h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }} className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Réunion équipe"
                  required
                />
              </div>

              {/* Projet associé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projet associé *
                </label>
                <select
                  value={newEvent.projectId}
                  onChange={(e) => setNewEvent({...newEvent, projectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un projet</option>
                  {availableProjects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                {availableProjects.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Aucun projet disponible. Créez d'abord un projet.
                  </p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planifie">Planifié</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de l'événement..."
                  rows={3}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de l'événement
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure début
                  </label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>



              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setNewEvent({ 
                      title: "", 
                      description: "",
                      date: "", 
                      startTime: "09:00", 
                      endTime: "10:00", 
                      status: "planifie",
                      projectId: ""
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour voir les détails d'un événement */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {selectedEvent.type === "event" ? <FaCalendarAlt className="text-blue-600" /> :
               selectedEvent.type === "task" ? <FaTasks className="text-blue-600" /> : 
               selectedEvent.type === "project" ? <FaProjectDiagram className="text-indigo-600" /> : 
               <FaUsers className="text-purple-600" />}
              {selectedEvent.title}
            </h2>
            
            <div className="space-y-3">
              {selectedEvent.type === "event" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Projet:</span>
                    <span>{selectedEvent.projectTitle}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Statut:</span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getEventColor(selectedEvent)}`}>
                      {selectedEvent.status === "planifie" ? "Planifié" :
                       selectedEvent.status === "en_cours" ? "En cours" :
                       selectedEvent.status === "termine" ? "Terminé" :
                       selectedEvent.status === "annule" ? "Annulé" : selectedEvent.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Horaires:</span>
                    <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                  </div>
                </>
              )}
              
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Date:</span>
                <span>{new Date(selectedEvent.date).toLocaleDateString("fr-FR")}</span>
              </div>

              {selectedEvent.type !== "event" && selectedEvent.status && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Statut:</span>
                  <span className={`px-2 py-1 rounded text-xs text-white ${getEventColor(selectedEvent)}`}>
                    {selectedEvent.status}
                  </span>
                </div>
              )}

              {selectedEvent.description && (
                <div>
                  <span className="font-medium text-gray-700 block mb-1">Description:</span>
                  <p className="text-gray-600 text-sm">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <button
                onClick={() => setShowEventDetails(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Fermer
              </button>
              
              {selectedEvent.type === "event" && (
                <>
                  <button
                    onClick={() => openEditModal(selectedEvent)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.data._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal pour éditer un événement */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Modifier l'événement</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleEditEvent(); }} className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Réunion équipe"
                  required
                />
              </div>

              {/* Projet associé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projet associé *
                </label>
                <select
                  value={editingEvent.projectId}
                  onChange={(e) => setEditingEvent({...editingEvent, projectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un projet</option>
                  {availableProjects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={editingEvent.status}
                  onChange={(e) => setEditingEvent({...editingEvent, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planifie">Planifié</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de l'événement..."
                  rows={3}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de l'événement
                </label>
                <input
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure début
                  </label>
                  <input
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent({...editingEvent, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    value={editingEvent.endTime}
                    onChange={(e) => setEditingEvent({...editingEvent, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;