import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import ProjectLists from "../components/ProjectLists";
import ProjectForm from "../components/ProjectForm";

function Projects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [projects, setProjects] = useState([
    { id: 1, title: "Refonte site web", manager: "Alice", status: "en_cours", deadline: "2025-09-20", progress: 65, tasks: 12 },
    { id: 2, title: "Campagne marketing Q4", manager: "Bob", status: "a_faire", deadline: "2025-09-28", progress: 0, tasks: 8 },
    { id: 3, title: "Migration base de données", manager: "Chloé", status: "termine", deadline: "2025-08-10", progress: 100, tasks: 20 },
  ]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isLate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isWithinDays = (dateStr, days) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + days);
    return d >= today && d <= end;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = search.trim().toLowerCase();
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (deadlineFilter === "late" && !isLate(p.deadline)) return false;
      if (deadlineFilter === "week" && !isWithinDays(p.deadline, 7)) return false;
      if (deadlineFilter === "month" && !isWithinDays(p.deadline, 30)) return false;
      return true;
    });
  }, [projects, search, statusFilter, deadlineFilter, today]);

  // Format date utilitaire
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Ajout d'un projet
  const [newProject, setNewProject] = useState({
    title: "",
    manager: "",
    status: "a_faire",
    deadline: "",
    progress: 0,
    tasks: 0,
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    const nextId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setProjects([
      ...projects,
      { ...newProject, id: nextId }
    ]);
    setNewProject({
      title: "",
      manager: "",
      status: "a_faire",
      deadline: "",
      progress: 0,
      tasks: 0,
    });
    setShowAddModal(false);
  };

  // Modification d'un projet
  const handleSave = (e) => {
    e.preventDefault();
    setProjects(projects.map((p) => (p.id === selectedProject.id ? selectedProject : p)));
    setSelectedProject(null);
  };

  // Suppression d'un projet
  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-800">Projets</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Cliquez sur <span className="inline-flex items-center gap-1 font-semibold">Modifier</span> ou <span className="inline-flex items-center gap-1 font-semibold">Supprimer</span> sur une carte.<br />
            Utilisez <span className="inline-flex items-center gap-1 font-semibold">Ajouter un projet</span> pour créer un nouveau projet.
          </p>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="">Tous</option>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="">Échéances</option>
            <option value="late">En retard</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois-ci</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 shadow hover:bg-blue-700 transition-colors duration-150 active:scale-95"
            onClick={() => setShowAddModal(true)}
            style={{ transition: "transform 0.15s" }}
          >
            <FaPlus className="animate-bounce" /> Ajouter un projet
          </button>
        </div>
      </div>

      {/* Liste des projets */}
      <ProjectLists
        projects={filteredProjects}
        onEdit={(p) => setSelectedProject({ ...p })}
        onDelete={handleDeleteProject}
        formatDate={formatDate}
      />

      {/* Modal modification */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Modifier le projet</h2>
            <ProjectForm
              onSubmit={handleSave}
              onCancel={() => setSelectedProject(null)}
              project={selectedProject}
              setProject={setSelectedProject}
              isEdit={true}
            />
          </div>
        </div>
      )}

      {/* Modal ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau projet</h2>
            <ProjectForm
              onSubmit={handleAddProject}
              onCancel={() => setShowAddModal(false)}
              project={newProject}
              setProject={setNewProject}
              isEdit={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
