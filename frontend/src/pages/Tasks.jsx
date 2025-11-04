import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import TaskForm from "../components/TaskForm";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pour l'édition
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/tasks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.resolve([])))
      .then((data) => (Array.isArray(data) ? setTasks(data) : setTasks([])))
      .catch(() => setTasks([]));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.resolve([])))
      .then((data) => (Array.isArray(data) ? setProjects(data) : setProjects([])))
      .catch(() => setProjects([]));
  }, []);

  // Filtrage
  const filteredTasks = tasks.filter((task) => {
    const matchStatus = filterStatus ? task.status === filterStatus : true;
    const matchSearch =
      search.trim() === "" ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Ajout ou édition d'une tâche
  const handleSaveTask = (newTask, isEdit = false) => {
    if (isEdit && newTask._id) {
      // Edition
      fetch(`${API_URL}/api/tasks/${newTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((savedTask) => {
          setTasks(tasks.map((t) => (t._id === savedTask._id ? savedTask : t)));
          setShowModal(false);
          setEditingTask(null);
        });
    } else {
      // Ajout
      fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((savedTask) => {
          setTasks([savedTask, ...tasks]);
          setShowModal(false);
        });
    }
  };

  // Suppression
  const handleDelete = (id) => {
    fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => setTasks(tasks.filter((t) => t._id !== id)));
  };

  // Edition
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // Marquer comme terminé
  const handleMarkAsDone = (id) => {
    fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "termine" }),
    })
      .then((res) => res.json())
      .then(() =>
        setTasks(
          tasks.map((t) =>
            t._id === id ? { ...t, status: "termine" } : t
          )
        )
      );
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Entête et barre de recherche */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Mes Tâches</h1>
        <p>Gérer vos tâches, ajoutez, modifiez et supprimez des tâches facilement.</p>
        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-150"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-150"
          >
            <option value="">Tous</option>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow flex items-center gap-2 hover:bg-blue-700 transition-colors duration-150 active:scale-95"
          onClick={() => { setShowModal(true); setEditingTask(null); }}
        >
          <FaPlus className="animate-bounce" /> Nouvelle tâche
        </button>
      </div>

      {/* Liste des tâches */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length === 0 && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center">
            <p className="text-gray-500">Aucune tâche à afficher</p>
          </div>
        )}
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 relative border-l-4 ${
              task.status === "termine"
                ? "border-green-500"
                : task.status === "en_cours"
                ? "border-yellow-400"
                : "border-blue-500"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  task.status === "termine"
                    ? "bg-green-100 text-green-800"
                    : task.status === "en_cours"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{task.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Projet : {projects.find(p => (p.id || p._id) === task.projectId)?.title || "Non défini"}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Date limite :{" "}
              <span className={new Date(task.deadline) < new Date() && task.status !== "termine" ? "text-red-600 font-semibold" : ""}>
                {formatDate(task.deadline)}
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {task.status !== "termine" && (
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg shadow hover:bg-green-200 transition-colors duration-150"
                  onClick={() => handleMarkAsDone(task._id)}
                  title="Marquer comme terminée"
                >
                  Terminer
                </button>
              )}
              <button
                className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg shadow hover:bg-yellow-200 transition-colors duration-150"
                onClick={() => handleEdit(task)}
                title="Modifier"
              >
                Modifier
              </button>
              <button
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg shadow hover:bg-red-200 transition-colors duration-150"
                onClick={() => handleDelete(task._id)}
                title="Supprimer"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal création/modification de tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>
            <TaskForm
              projects={projects}
              onSave={handleSaveTask}
              onCancel={() => { setShowModal(false); setEditingTask(null); }}
              editingTask={editingTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;