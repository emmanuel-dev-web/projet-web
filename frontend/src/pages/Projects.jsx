import React, { useState, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import ProjectLists from "../components/ProjectLists";
import ProjectForm from "../components/ProjectForm";

function Projects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    manager: "",
    status: "a_faire",
    deadline: "",
    progress: 0,
    tasks: 0,
  });

  // Charger les projets depuis le backend (filtrage utilisateur)
  useEffect(() => {
    fetch("http://localhost:3001/api/projects", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.resolve([])))
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => setProjects([]));
  }, []);

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
  const handleAddProject = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newProject),
    })
      .then((res) => {
        if (res.ok) {
          setNotification({
            show: true,
            type: "success",
            message: "Projet créé avec succès !",
          });
          return res.json();
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Échec de la création du projet.",
          });
        }
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
      })
      .then((savedProject) => {
        if (savedProject && savedProject._id) {
          setProjects([...projects, savedProject]);
          setNewProject({
            title: "",
            manager: "",
            status: "a_faire",
            deadline: "",
            progress: 0,
            tasks: 0,
          });
          setShowAddModal(false);
        }
      });
  };

  // Modification d'un projet
  const handleSave = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:3001/api/projects/${
        selectedProject._id || selectedProject.id
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(selectedProject),
      }
    )
      .then((res) => {
        if (res.ok) {
          setNotification({
            show: true,
            type: "success",
            message: "Projet modifié avec succès !",
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Échec de la modification du projet.",
          });
        }
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        return res.json();
      })
      .then((updatedProject) => {
        if (updatedProject && updatedProject._id) {
          setProjects(
            projects.map((p) =>
              (p._id || p.id) === (updatedProject._id || updatedProject.id)
                ? updatedProject
                : p
            )
          );
          setSelectedProject(null);
        }
      });
  };

  // Suppression d'un projet
  const handleDeleteProject = (id) => {
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setNotification({
            show: true,
            type: "success",
            message: "Projet supprimé avec succès !",
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Échec de la suppression du projet.",
          });
        }
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        return res.json();
      })
      .then(() => setProjects(projects.filter((p) => (p._id || p.id) !== id)));
  };

  // Filtrage
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

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-800">Projets</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Cliquez sur{" "}
            <span className="inline-flex items-center gap-1 font-semibold">
              Modifier
            </span>{" "}
            ou{" "}
            <span className="inline-flex items-center gap-1 font-semibold">
              Supprimer
            </span>{" "}
            sur une carte.
            <br />
            Utilisez{" "}
            <span className="inline-flex items-center gap-1 font-semibold">
              Ajouter un projet
            </span>{" "}
            pour créer un nouveau projet.
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
        onDelete={(p) => handleDeleteProject(p._id || p.id)}
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

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default Projects;
