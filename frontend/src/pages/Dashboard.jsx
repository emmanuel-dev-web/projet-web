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
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

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

  // Récupération des tâches
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

  // Récupération des données du dashboard (projets, équipes, etc.)
  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération des données du dashboard :", err)
      );
  }, []);

  // Compteurs de tâches
  const nbAFaire = tasks.filter((t) => t.status === "a_faire").length;
  const nbEnCours = tasks.filter((t) => t.status === "en_cours").length;
  const nbTermine = tasks.filter((t) => t.status === "termine").length;
  const todayDate = new Date();
  const tasksEnRetard = tasks.filter(
    (t) =>
      t.status !== "termine" &&
      t.deadline &&
      new Date(t.deadline) < todayDate
  );
  const nbEnRetard = tasksEnRetard.length;

  // Cards data
  const cardData = [
    {
      title: "Tâches à faire",
      value: nbAFaire,
      icon: <TaskOnGoingIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-blue-100/80 to-blue-50/60",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      border: "border-blue-200",
    },
    {
      title: "Tâches en cours",
      value: nbEnCours,
      icon: <TaskOnGoingIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-purple-100/80 to-purple-50/60",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      border: "border-purple-200",
    },
    {
      title: "Tâches terminées",
      value: nbTermine,
      icon: <TaskTerminatedIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-green-100/80 to-green-50/60",
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      border: "border-green-200",
    },
    {
      title: "Projets",
      value: dashboardData?.projets ?? "--",
      icon: <ProjectsIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-indigo-100/80 to-indigo-50/60",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
      border: "border-indigo-200",
    },
    {
      title: "Équipes",
      value: dashboardData?.équipes ?? "--",
      icon: <TeamsIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-teal-100/80 to-teal-50/60",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-500",
      border: "border-teal-200",
    },
    {
      title: "Tâches en retard",
      value: nbEnRetard,
      icon: <LateTaskIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-red-100/80 to-red-50/60",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      border: "border-red-200",
    },
    {
      title: "Événements à venir",
      value: dashboardData?.événementsÀVenir ?? "--",
      icon: <CalendarIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-yellow-100/80 to-yellow-50/60",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
      border: "border-yellow-200",
    },
    {
      title: "Utilisateurs actifs",
      value: dashboardData?.utilisateursActifs ?? "--",
      icon: <UsersOnLineIcon className="w-8 h-8" />,
      color: "bg-gradient-to-br from-pink-100/80 to-pink-50/60",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
      border: "border-pink-200",
    },
  ];

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Status badge
  function statusBadge(status) {
    if (status === "a_faire")
      return <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">À faire</span>;
    if (status === "en_cours")
      return <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-semibold">En cours</span>;
    if (status === "termine")
      return <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold">Terminé</span>;
    return null;
  }

  return (
    <div className="space-y-10 p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl p-8 mb-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-white">
            {username ? username[0].toUpperCase() : "?"}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-500">{today}</div>
            <div className="text-3xl font-bold text-gray-800">
              Bienvenue{username ? `, ${username}` : ""} !
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/tasks?new=1")}
          className="mt-6 md:mt-0 px-7 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow hover:from-indigo-600 hover:to-purple-700 transition text-lg"
        >
          + Nouvelle tâche
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl shadow-xl ${card.color} group transition-transform duration-300 ${card.border} border hover:scale-105 hover:shadow-2xl overflow-hidden`}
            style={{ minHeight: 170, backdropFilter: "blur(6px)" }}
          >
            {/* Icône en fond */}
            <div className={`absolute right-4 top-4 opacity-10 text-8xl pointer-events-none select-none group-hover:opacity-20 transition ${card.iconColor}`}>
              {card.icon}
            </div>
            {/* Contenu principal */}
            <div className="relative z-10 p-6 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">{card.title}</span>
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full shadow-inner ${card.iconBg}`}>
                  {React.cloneElement(card.icon, { className: `w-8 h-8 ${card.iconColor}` })}
                </span>
              </div>
              <div className="flex-1 flex items-end">
                <h2 className="text-4xl font-extrabold mt-6 text-gray-800 group-hover:text-indigo-600 transition">
                  {card.value}
                </h2>
              </div>
            </div>
            {/* Badge animé */}
            <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Dernières tâches */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mes 5 dernières tâches</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">Aucune tâche pour le moment.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.slice(0, 5).map((task) => (
              <li key={task._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-semibold text-lg">{task.title}</span>
                  <span className="ml-3">{statusBadge(task.status)}</span>
                  <div className="text-gray-500 text-sm mt-1">{task.description}</div>
                </div>
                <div className="text-gray-400 text-sm mt-2 md:mt-0">
                  {formatDate(task.deadline)}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-6">
          <button
            className="text-indigo-600 hover:underline font-medium"
            onClick={() => navigate("/tasks")}
          >
            Voir toutes les tâches
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
