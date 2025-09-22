import React, { useState, useEffect } from "react";

function TaskForm({ projects, onSave, onCancel, editingTask }) {
  const [title, setTitle] = useState(editingTask ? editingTask.title : "");
  const [description, setDescription] = useState(editingTask ? editingTask.description : "");
  const [status, setStatus] = useState(editingTask ? editingTask.status : "a_faire");
  const [deadline, setDeadline] = useState(editingTask && editingTask.deadline ? editingTask.deadline.slice(0, 10) : "");
  const [projectId, setProjectId] = useState(editingTask ? editingTask.projectId : "");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setDeadline(editingTask.deadline ? editingTask.deadline.slice(0, 10) : "");
      setProjectId(editingTask.projectId || "");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      status,
      deadline,
      projectId,
    };
    if (editingTask && editingTask._id) {
      newTask._id = editingTask._id;
    }
    onSave(newTask, !!editingTask);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          placeholder="Titre de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="text-gray-700 mb-1">Description</label>
        <textarea
          placeholder="Description de la tâche"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="text-gray-700 mb-1">Statut</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="a_faire">À faire</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>
      </div>
      <div>
        <label className="text-gray-700 mb-1">Date limite</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="text-gray-700 mb-1">Projet</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Sélectionner un projet</option>
          {projects.map((p) => (
            <option key={p.id || p._id} value={p.id || p._id}>{p.title}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {editingTask ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;