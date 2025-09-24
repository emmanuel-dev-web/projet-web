import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaCheckCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Tasks() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Ajout du state projectId pour le formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("a_faire");
  const [deadline, setDeadline] = useState("");
  const [projectId, setProjectId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/tasks", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.resolve([])))
      .then((data) => (Array.isArray(data) ? setTasks(data) : setTasks([])))
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setTasks([]);
      });
  }, []);

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

  useEffect(() => {
    if (location.search.includes("new=1")) {
      setShowModal(true);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = { title, description, status, deadline, projectId };

    const url = editingId
      ? `http://localhost:3001/api/tasks/${editingId}`
      : "http://localhost:3001/api/tasks";
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (res.ok) {
          setNotification({
            show: true,
            type: "success",
            message: editingId
              ? "Tâche modifiée avec succès !"
              : "Tâche créée avec succès !",
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: editingId
              ? "Échec de la modification de la tâche."
              : "Échec de la création de la tâche.",
          });
        }
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        return res.json();
      })
      .then((savedTask) => {
        if (editingId) {
          setTasks(
            tasks.map((t) => (t._id === editingId ? { ...t, ...newTask } : t))
          );
          setEditingId(null);
        } else if (savedTask && savedTask._id) {
          setTasks([savedTask, ...tasks]);
        }
        setTitle("");
        setDescription("");
        setStatus("a_faire");
        setDeadline("");
        setProjectId("");
        setShowModal(false);
      })
      .catch((err) => {
        setNotification({
          show: true,
          type: "error",
          message: "Erreur lors de l'ajout.",
        });
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        console.error("Erreur lors de l'ajout :", err);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
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
            message: "Tâche supprimée avec succès !",
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Échec de la suppression de la tâche.",
          });
        }
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        return res.json();
      })
      .then(() => setTasks(tasks.filter((t) => t._id !== id)))
      .catch((err) => {
        setNotification({
          show: true,
          type: "error",
          message: "Erreur suppression.",
        });
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        console.error("Erreur suppression :", err);
      });
  };

  const handleMarkAsDone = (id) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "termine" }),
    })
      .then((res) => {
        if (res.ok) {
          setNotification({
            show: true,
            type: "success",
            message: "Tâche marquée comme terminée !",
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Échec lors du marquage terminé.",
          });
        }
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        return res.json();
      })
      .then(() =>
        setTasks(
          tasks.map((t) =>
            t._id === id ? { ...t, status: "termine" } : t
          )
        )
      )
      .catch((err) => {
        setNotification({
          show: true,
          type: "error",
          message: "Erreur terminer.",
        });
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        console.error("Erreur terminer :", err);
      });
  };

  const handleEdit = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      setShowModal(true);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDeadline(task.deadline ? task.deadline.slice(0, 10) : "");
      setProjectId(task.projectId || "");
      setEditingId(id);
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const filteredTasks = tasks.filter((task) => {
    const matchStatus = filterStatus ? task.status === filterStatus : true;
    const matchSearch =
      search.trim() === "" ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
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

      {/* Entête et barre de recherche */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Mes Tâches</h1>
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
          onClick={() => {
            setShowModal(true);
            setTitle("");
            setDescription("");
            setStatus("a_faire");
            setDeadline("");
            setProjectId("");
            setEditingId(null);
          }}
          style={{ transition: "transform 0.15s" }}
        >
          <FaPlus className="animate-bounce" />
           Nouvelle tâche
        </button>
      </div>

      {/* Liste des tâches */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <h3 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h3>
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
            <div className="mt-2 text-sm text-gray-500">
              Date limite :{" "}
              <span
                className={
                  new Date(task.deadline) < new Date() &&
                  task.status !== "termine"
                    ? "text-red-600 font-semibold"
                    : ""
                }
              >
                {formatDate(task.deadline)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Projet : {projects.find(p => p._id === task.projectId)?.title || "Aucun"}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {task.status !== "termine" && (
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg shadow hover:bg-green-200 transition-colors duration-150"
                  onClick={() => handleMarkAsDone(task._id)}
                  title="Marquer comme terminée"
                >
                  <FaCheckCircle />
                  Terminer
                </button>
              )}
              <button
                className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg shadow hover:bg-yellow-200 transition-colors duration-150"
                onClick={() => handleEdit(task._id)}
                title="Modifier"
              >
                <FaEdit />
                Modifier
              </button>
              <button
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg shadow hover:bg-red-200 transition-colors duration-150"
                onClick={() => handleDelete(task._id)}
                title="Supprimer"
              >
                <FaTrash />
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
              {editingId ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la tâche"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Description de la tâche"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Statut</label>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="a_faire">À faire</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Date limite</label>
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Projet associé</label>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un projet</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors duration-150"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150"
                >
                  {editingId ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
