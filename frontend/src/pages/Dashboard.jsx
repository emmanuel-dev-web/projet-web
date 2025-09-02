import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProjectsIcon,
  TaskOnGoingIcon,
  TeamsIcon,
  TaskTerminatedIcon,
  LateTaskIcon,
  CalendarIcon,
  UsersOnLineIcon,
} from "../assets/icons";

function Dashboard() {
  const [today, setToday] = useState("");
  const [username, setUsername] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [showModal, setShowModal] = useState(false); // État pour modal
  const navigate = useNavigate();

  // Récupération des données du dashboard
  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération des données du dashboard :", err)
      );
  }, []);

  // Date du jour et nom utilisateur
  useEffect(() => {
    const date = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setToday(date.toLocaleDateString("fr-FR", options));

    fetch("http://localhost:3001/api/auth/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.utilisateur && data.utilisateur.name) setUsername(data.utilisateur.name);
      })
      .catch((err) => console.error("Erreur lors de la récupération du nom :", err));
  }, []);

  // Données des cartes
  const cardData = [
    { title: "Projets", value: dashboardData?.projets ?? "--", icon: <ProjectsIcon className="w-10 h-10 text-indigo-400 opacity-20" />, color: "bg-indigo-50" },
    { title: "Tâches en cours", value: dashboardData?.tâchesEnCours ?? "--", icon: <TaskOnGoingIcon className="w-10 h-10 text-purple-400 opacity-20" />, color: "bg-purple-50" },
    { title: "Équipes", value: dashboardData?.équipes ?? "--", icon: <TeamsIcon className="w-10 h-10 text-green-400 opacity-20" />, color: "bg-green-50" },
    { title: "Tâches terminées", value: dashboardData?.tâchesTerminées ?? "--", icon: <TaskTerminatedIcon className="w-10 h-10 text-indigo-400 opacity-20" />, color: "bg-indigo-50" },
    { title: "Tâches en retard", value: dashboardData?.tâchesEnRetard ?? "--", icon: <LateTaskIcon className="w-10 h-10 text-red-400 opacity-20" />, color: "bg-red-50" },
    { title: "Événements à venir", value: dashboardData?.événementsÀVenir ?? "--", icon: <CalendarIcon className="w-10 h-10 text-yellow-400 opacity-20" />, color: "bg-yellow-50" },
    { title: "Utilisateurs actifs", value: dashboardData?.utilisateursActifs ?? "--", icon: <UsersOnLineIcon className="w-10 h-10 text-pink-400 opacity-20" />, color: "bg-pink-50" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Entête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold">
          <p className="text-lg mt-1">{today}</p>
          Bienvenue{username ? `, ${username}` : ""} !
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          + Nouvelle tâche
        </button>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, idx) => (
          <div key={idx} className={`relative ${card.color} p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              {card.icon}
            </div>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Modal création tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Créer une nouvelle tâche</h2>
            <input
              type="text"
              placeholder="Titre de la tâche"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Ici tu peux appeler ton API pour créer la tâche
                   navigate("/tasks")
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
