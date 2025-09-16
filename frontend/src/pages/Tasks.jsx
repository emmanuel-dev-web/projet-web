import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TasksList from "../components/TasksLists";

function Tasks() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("a_faire");
  const [deadline, setDeadline] = useState("");

  // Ajoute editingId dans tes useState
  const [editingId, setEditingId] = useState(null);

  // Charger les tâches depuis le backend
  useEffect(() => {
    fetch("http://localhost:3001/api/tasks", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.resolve([]))
      .then((data) => Array.isArray(data) ? setTasks(data) : setTasks([]))
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setTasks([]);
      });
  }, []);

  useEffect(() => {
    if (location.search.includes("new=1")) {
      setShowModal(true);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = { title, description, status, deadline };

    // Modifie handleSubmit pour gérer l'édition si editingId existe
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
      .then((res) => res.json())
      .then((savedTask) => {
        if (editingId) {
          // Mise à jour de la tâche existante
          setTasks(
            tasks.map((t) => (t._id === editingId ? { ...t, ...newTask } : t))
          );
          setEditingId(null);
        } else {
          // Ajout d'une nouvelle tâche
          setTasks([savedTask, ...tasks]);
        }
        setTitle("");
        setDescription("");
        setStatus("a_faire");
        setDeadline("");
        setShowModal(false);
      })
      .catch((err) => console.error("Erreur lors de l'ajout :", err));
  };

  // Supprimer une tâche
  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => setTasks(tasks.filter((t) => t._id !== id)))
      .catch((err) => console.error("Erreur suppression :", err));
  };

  // Marquer comme terminé
  const handleMarkAsDone = (id) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
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
      )
      .catch((err) => console.error("Erreur terminer :", err));
  };

  // Modifier une tâche (ouvre le modal avec les infos)
  const handleEdit = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      setShowModal(true);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDeadline(task.deadline ? task.deadline.slice(0, 10) : "");
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
    <div className="p-6">
      {/* Entête et barre de recherche */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes Tâches</h1>

        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Nouvelle tâche
        </button>
      </div>

      {/* Affichage des tâches */}
      <TasksList
        tasks={filteredTasks}
        formatDate={formatDate}
        onComplete={handleMarkAsDone}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal création de tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Nouvelle tâche
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la tâche"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Description de la tâche"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Statut</label>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
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
