import React from "react";
import { useState } from "react";

function TaskForm(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("a_faire");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour ajouter une nouvelle tâche
        const newTask ={
            title, description, status, deadline
        }
        console.log("Nouvelle tâche ajoutée:", newTask);
    };

    return(
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <input
                type="text"
                placeholder="Titre de la tâche"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />

            <textarea
                placeholder="Description de la tâche"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-4 w-full p-2 border border-gray-300 rounded-lg"
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-4 w-full p-2 border border-gray-300 rounded-lg"
            >
                <option value="a_faire">À faire</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
            </select>

            <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-4 w-full p-2 border border-gray-300 rounded-lg"
            />

            <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg">
                Ajouter la tâche
            </button>
        </form>
    );
};
export default TaskForm;