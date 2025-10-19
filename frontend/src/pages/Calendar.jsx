import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "task",
    description: ""
  });

  // Récupérer le token d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Couleurs selon le statut des tâches
  const getTaskColor = (status) => {
    switch (status) {
      case "a_faire": return "bg-blue-500";
      case "en_cours": return "bg-yellow-500";
      case "termine": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Couleurs selon le statut des projets
  const getProjectColor = (status) => {
    switch (status) {
      case "en_cours": return "bg-indigo-500";
      case "termine": return "bg-green-600";
      case "en_attente": return "bg-orange-500";
      default: return "bg-gray-600";
    }
  };

  // Charger toutes les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [tasksRes, projectsRes, teamsRes] = await Promise.all([
          fetch("http://localhost:3001/api/tasks", { headers: getAuthHeaders() }),
          fetch("http://localhost:3001/api/projects", { headers: getAuthHeaders() }),
          fetch("http://localhost:3001/api/teams", { headers: getAuthHeaders() })
        ]);

        const [tasksData, projectsData, teamsData] = await Promise.all([
          tasksRes.ok ? tasksRes.json() : [],
          projectsRes.ok ? projectsRes.json() : [],
          teamsRes.ok ? teamsRes.json() : []
        ]);
        
        // Combiner toutes les données en événements calendrier
        const calendarEvents = [];

        // Ajouter les tâches avec deadline
        if (Array.isArray(tasksData)) {
          tasksData.forEach(task => {
            if (task.deadline) {
              calendarEvents.push({
                id: `task-${task._id}`,
                title: task.title,
                date: task.deadline,
                type: "task",
                status: task.status,
                color: getTaskColor(task.status),
                data: task
              });
            }
          });
        }

        // Ajouter les projets avec deadline
        if (Array.isArray(projectsData)) {
          projectsData.forEach(project => {
            if (project.deadline) {
              calendarEvents.push({
                id: `project-${project._id}`,
                title: project.title,
                date: project.deadline,
                type: "project",
                status: project.status,
                color: getProjectColor(project.status),
                data: project
              });
            }
          });
        }

        // Ajouter les équipes (date de création)
        if (Array.isArray(teamsData)) {
          teamsData.forEach(team => {
            calendarEvents.push({
              id: `team-${team._id}`,
              title: `Équipe: ${team.name}`,
              date: team.createdAt,
              type: "team",
              color: "bg-purple-500",
              data: team
            });
          });
        }

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        deadline: newEvent.date || (selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
      };

      let apiUrl = "";
      if (newEvent.type === "task") {
        apiUrl = "http://localhost:3001/api/tasks";
        eventData.status = "a_faire";
      } else if (newEvent.type === "project") {
        apiUrl = "http://localhost:3001/api/projects";
        eventData.status = "en_cours";
        eventData.manager = "Utilisateur";
      }

      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(eventData),
        });

        if (response.ok) {
          // Recharger les données
          window.location.reload();
        }
      }
      
      setShowEventModal(false);
      setNewEvent({ title: "", date: "", type: "task", description: "" });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
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

  // Filtrer les événements par date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      const typeFilter = filters[event.type === "task" ? "tasks" : 
                                event.type === "project" ? "projects" : "teams"];
      return eventDate === dateStr && typeFilter;
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
                        className={`text-xs px-2 py-1 rounded text-white truncate ${event.color} cursor-pointer hover:opacity-80 transition-opacity`}
                        title={event.title}
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

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="task">Tâche</option>
                  <option value="project">Projet</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  rows="3"
                  placeholder="Description optionnelle..."
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setNewEvent({ title: "", date: "", type: "task", description: "" });
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
              {selectedEvent.type === "task" ? <FaTasks className="text-blue-600" /> : 
               selectedEvent.type === "project" ? <FaProjectDiagram className="text-indigo-600" /> : 
               <FaUsers className="text-purple-600" />}
              {selectedEvent.title}
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Type:</span>
                <span className="capitalize">{selectedEvent.type === "task" ? "Tâche" : selectedEvent.type === "project" ? "Projet" : "Équipe"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Date:</span>
                <span>{new Date(selectedEvent.date).toLocaleDateString("fr-FR")}</span>
              </div>

              {selectedEvent.status && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Statut:</span>
                  <span className={`px-2 py-1 rounded text-xs text-white ${selectedEvent.color}`}>
                    {selectedEvent.status}
                  </span>
                </div>
              )}

              {selectedEvent.data?.description && (
                <div>
                  <span className="font-medium text-gray-700 block mb-1">Description:</span>
                  <p className="text-gray-600 text-sm">{selectedEvent.data.description}</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;