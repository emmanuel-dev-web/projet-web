import React from "react";
import { CheckCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

function TasksList() {
  // Données factices pour l'instant
  const tasks = [
    { id: 1, title: "Préparer la présentation", description: "Support réunion lundi", status: "en_cours", deadline: "2025-09-10" },
    { id: 2, title: "Corriger les bugs", description: "Tickets urgents à traiter", status: "a_faire", deadline: "2025-09-05" },
    { id: 3, title: "Déployer la v2.1", description: "Mise en production", status: "termine", deadline: "2025-08-30" },
  ];

  // Fonction pour afficher le badge selon le statut
  const getStatusBadge = (status) => {
    switch (status) {
      case "a_faire":
        return <span className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 ">À faire</span>;
      case "en_cours":
        return <span className="px-3 py-1 text-sm rounded-full bg-yellow-200 text-yellow-700">En cours</span>;
      case "termine":
        return <span className="px-3 py-1 text-sm rounded-full bg-green-200 text-green-700">Terminé</span>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
          <p className="text-gray-600 text-sm mt-2">{task.description}</p>

          <div className="flex justify-between items-center mt-4">
            {getStatusBadge(task.status)}
            <span className="text-sm text-gray-500">{task.deadline}</span>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button className="text-green-600 hover:text-green-800" title="Marquer comme terminé">
              <CheckCircleIcon className="w-5 h-5" />
            </button>
            <button className="text-blue-600 hover:text-blue-800" title="Modifier la tâche">
              <PencilIcon className="w-5 h-5" />
            </button>
            <button className="text-red-600 hover:text-red-800" title="Supprimer la tâche">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TasksList;
