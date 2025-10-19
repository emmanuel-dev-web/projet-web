import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaUsers, FaUserCircle } from "react-icons/fa";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: "",
  });
  const [notification, setNotification] = useState(null);

  // Récupérer le token depuis localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("Token récupéré:", token ? "Token présent" : "Token manquant");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Afficher notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Charger les équipes au démarrage
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/teams", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          showNotification("Erreur lors du chargement des équipes", "error");
        }
      } catch (error) {
        console.error("Erreur:", error);
        showNotification("Erreur de connexion au serveur", "error");
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);



  // Filtrage par recherche
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.members.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  // Ajout d'une équipe
  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      const response = await fetch("http://localhost:3001/api/teams", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          members: form.members,
        }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams([...teams, newTeam]);
        setForm({ name: "", description: "", members: "" });
        setShowModal(false);
        showNotification("Équipe créée avec succès !");
      } else {
        const error = await response.json();
        showNotification(error.message || "Erreur lors de la création", "error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur de connexion", "error");
    }
  };

  // Suppression d'une équipe
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/teams/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setTeams(teams.filter((team) => team._id !== id));
        showNotification("Équipe supprimée avec succès !");
      } else {
        const error = await response.json();
        showNotification(error.message || "Erreur lors de la suppression", "error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur de connexion", "error");
    }
  };

  // Edition d'une équipe
  const handleEdit = (team) => {
    setSelectedTeam(team);
    setForm({
      name: team.name,
      description: team.description,
      members: team.members.join(", "),
    });
    setShowModal(true);
  };

  // Sauvegarde édition
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/teams/${selectedTeam._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          members: form.members,
        }),
      });

      if (response.ok) {
        const updatedTeam = await response.json();
        setTeams(
          teams.map((team) =>
            team._id === selectedTeam._id ? updatedTeam : team
          )
        );
        setSelectedTeam(null);
        setForm({ name: "", description: "", members: "" });
        setShowModal(false);
        showNotification("Équipe modifiée avec succès !");
      } else {
        const error = await response.json();
        showNotification(error.message || "Erreur lors de la modification", "error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur de connexion", "error");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
            <FaUsers className="text-blue-600" /> Mes équipes
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gérez vos équipes, ajoutez des membres, modifiez ou supprimez une équipe.
          </p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher une équipe ou un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-150 w-full md:w-64"
          />
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow flex items-center gap-2 hover:bg-blue-700 transition-colors duration-150 active:scale-95"
            onClick={() => {
              setShowModal(true);
              setSelectedTeam(null);
              setForm({ name: "", description: "", members: "" });
            }}
          >
            <FaPlus className="animate-bounce" />
             Nouvelle équipe
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Chargement des équipes...</p>
        </div>
      ) : (
        <>
          {/* Liste des équipes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-12">
                {teams.length === 0 ? "Aucune équipe créée pour le moment." : "Aucune équipe trouvée."}
              </div>
            ) : (
          filteredTeams.map((team) => (
            <div
              key={team._id}
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border-l-4 border-blue-500`}
              style={{ minHeight: "220px" }}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaUsers className="text-blue-400" /> {team.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    Créée le {team.createdAt}
                  </span>
                </div>
                <p className="mt-2 text-gray-700 italic">{team.description}</p>
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Membres :</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {team.members.length > 0 ? (
                      team.members.map((member, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                        >
                          <FaUserCircle className="text-blue-300" /> {member}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Aucun</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Boutons en bas, couleurs cohérentes */}
              <div className="flex gap-2 mt-6 justify-end">
                <button
                  className="p-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  title="Modifier"
                  onClick={() => handleEdit(team)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                  title="Supprimer"
                  onClick={() => handleDelete(team._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
          </div>
        </>
      )}

      {/* Modal création/édition équipe */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {selectedTeam ? "Modifier l'équipe" : "Nouvelle équipe"}
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={selectedTeam ? handleSaveEdit : handleAddTeam}
            >
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Nom de l'équipe</label>
                <input
                  type="text"
                  placeholder="Nom"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Description de l'équipe"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1">
                  Membres (séparés par des virgules)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Alice, Bob, Charlie"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  value={form.members}
                  onChange={(e) => setForm({ ...form, members: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTeam(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {selectedTeam ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;