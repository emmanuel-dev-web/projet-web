import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  DashboardIcon, 
  TasksIcon, 
  TeamsIcon, 
  ProjectsIcon, 
  CalendarIcon, 
  LogoutIcon,
  UserIcon
} from "../assets/icons";

function Sidebar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Récupérer les informations utilisateur au chargement
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Confirmer la déconnexion
  const confirmLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");
    
    // Supprimer toutes les données utilisateur stockées
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    
    // Rediriger vers la page de login
    navigate("/login");
  };
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md p-6 flex flex-col h-full">
      <h2 className="text-3xl text-blue-700 mb-10 font-extrabold tracking-tight">
        AlphaTasks
      </h2>

      <nav className="flex flex-col space-y-6 text-base flex-grow">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <DashboardIcon />
          <span>Tableau de bord</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <TasksIcon />
          <span>Mes Tâches</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <ProjectsIcon />
          <span>Projets</span>
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <TeamsIcon />
          <span>Équipes</span>
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <CalendarIcon />
          <span>Calendrier</span>
        </NavLink>

      </nav>

      {/* Section utilisateur */}
      <div className="mt-auto pt-4">
        {userEmail && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <UserIcon className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userEmail}
              </p>
              <p className="text-xs text-gray-500">
                Utilisateur connecté
              </p>
            </div>
          </div>
        )}

        {/* Bouton de déconnexion */}
        <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left p-3 rounded-lg group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-100 transition-colors duration-200">
            <LogoutIcon className="text-sm group-hover:text-red-600" />
          </div>
          <span className="group-hover:translate-x-1 transition-transform duration-200">Se déconnecter</span>
        </button>
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 mx-4 shadow-2xl transform transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <LogoutIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmer la déconnexion
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
