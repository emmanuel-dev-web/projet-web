import React from "react";
import TaskList from "../components/TasksLists";

function Tasks() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-800">Mes Tâches</h1>

        {/* Zone recherche + filtres */}
        <div className="flex flex-1 items-center gap-3">
          {/* Recherche */}
          <input
            type="text"
            placeholder=" Rechercher une tâche..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filtre par statut */}
          <select className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        {/* Bouton ajouter */}
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          + Nouvelle tâche
        </button>
      </div>

       {/** appelle de <TaskList /> */}
      <TaskList />
    </div>
  );
}

export default Tasks;
