import React from "react";
import { CheckCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

function TasksList({ tasks, onComplete, onEdit, onDelete, formatDate }) {
  // Fonction pour afficher le badge selon le statut
  const getStatusBadge = (status) => {
    switch (status) {
      case "a_faire":
        return <span className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700">À faire</span>;
      case "en_cours":
        return <span className="px-3 py-1 text-sm rounded-full bg-yellow-200 text-yellow-700">En cours</span>;
      case "termine":
        return <span className="px-3 py-1 text-sm rounded-full bg-green-200 text-green-700">Terminé</span>;
      default:
        return null;
    }
  };

  // Sécurité : fallback si pas de fonction passée
  const handleComplete = (id) => onComplete && onComplete(id);
  const handleEdit = (id) => onEdit && onEdit(id);
  const handleDelete = (id) => onDelete && onDelete(id);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div key={task.id || task._id} className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
          <p className="text-gray-600 text-sm mt-2 break-words whitespace-pre-line">
            {task.description}
          </p>

          <div className="flex justify-between items-center mt-4">
            {getStatusBadge(task.status)}
            <span className="text-sm text-gray-500">
              {formatDate ? formatDate(task.deadline) : (task.deadline ? task.deadline.slice(0,10) : "")}
            </span>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="text-green-600 hover:text-green-800"
              title="Marquer comme terminé"
              onClick={() => handleComplete(task.id || task._id)}
              disabled={task.status === "termine"}
            >
              <CheckCircleIcon className="w-5 h-5" />
            </button>
            <button
              className="text-blue-600 hover:text-blue-800"
              title="Modifier la tâche"
              onClick={() => handleEdit(task.id || task._id)}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              title="Supprimer la tâche"
              onClick={() => handleDelete(task.id || task._id)}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TasksList;
