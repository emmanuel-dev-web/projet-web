import React from "react";

function ProjectForm({
  onSubmit,
  onCancel,
  project,
  setProject,
  isEdit = false,
}) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <label className="text-gray-700 text-sm font-semibold">Titre du projet</label>
      <input
        type="text"
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
        className="border px-3 py-2 rounded"
        required
      />
      <label className="text-gray-700 text-sm font-semibold">Chef de projet</label>
      <input
        type="text"
        value={project.manager}
        onChange={(e) => setProject({ ...project, manager: e.target.value })}
        className="border px-3 py-2 rounded"
        required
      />
      <label className="text-gray-700 text-sm font-semibold">Statut</label>
      <select
        value={project.status}
        onChange={(e) => setProject({ ...project, status: e.target.value })}
        className="border px-3 py-2 rounded"
      >
        <option value="a_faire">À faire</option>
        <option value="en_cours">En cours</option>
        <option value="termine">Terminé</option>
      </select>
      <label className="text-gray-700 text-sm font-semibold">Date limite</label>
      <input
        type="date"
        value={project.deadline}
        onChange={(e) => setProject({ ...project, deadline: e.target.value })}
        className="border px-3 py-2 rounded"
        required
      />
      <label className="text-gray-700 text-sm font-semibold">Progression (%)</label>
      <input
        type="number"
        value={project.progress}
        onChange={(e) =>
          setProject({ ...project, progress: Number(e.target.value) })
        }
        className="border px-3 py-2 rounded"
        min="0"
        max="100"
        required
      />
      <label className="text-gray-700 text-sm font-semibold">Nombre de tâches</label>
      <input
        type="number"
        value={project.tasks}
        onChange={(e) =>
          setProject({ ...project, tasks: Number(e.target.value) })
        }
        className="border px-3 py-2 rounded"
        min="0"
        required
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {isEdit ? "Sauvegarder" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;