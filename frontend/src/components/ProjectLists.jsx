import React from "react";
import { FaUserTie, FaTasks, FaClock, FaEdit, FaTrash } from "react-icons/fa";

function ProjectLists({ projects, onEdit, onDelete, formatDate }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "a_faire":
        return "bg-gray-200 text-gray-700";
      case "en_cours":
        return "bg-yellow-200 text-yellow-800";
      case "termine":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const isLate = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer relative"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">{p.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(p.status)}`}>
              <span>
                {(p.status ? p.status.replace("_", " ") : "Statut inconnu")}
              </span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <FaUserTie className="text-blue-600" /> <span>Chef: {p.manager}</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
            <FaTasks className="text-green-600" /> <span>{p.tasks} tâches</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
            <FaClock className="text-red-600" />{" "}
            {isLate(p.deadline) ? (
              <span className="text-red-600 font-semibold">En retard</span>
            ) : (
              `Deadline: ${formatDate ? formatDate(p.deadline) : p.deadline}`
            )}
          </div>
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${p.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{p.progress}% complété</p>
          </div>
          {/* Boutons Modifier et Supprimer */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg shadow hover:bg-yellow-500 transition-colors duration-150"
              onClick={() => onEdit(p)}
              title="Modifier ce projet"
            >
              <FaEdit />
              Modifier
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-400 text-red-900 font-semibold rounded-lg shadow hover:bg-red-500 transition-colors duration-150"
              onClick={() => onDelete(p.id)}
              title="Supprimer ce projet"
            >
              <FaTrash />
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectLists;