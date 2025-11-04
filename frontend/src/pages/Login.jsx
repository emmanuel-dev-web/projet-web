import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon, EyeIcon, EyeSlashIcon } from "../assets/icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Veuillez entrer un email valide");
      return;
    }
    if (!password.trim() || password.trim().length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("token", data.token || data.newToken); // Correction ici
        if (data.utilisateur && data.utilisateur.name) {
          localStorage.setItem("username", data.utilisateur.name); // Stocke aussi le nom pour affichage rapide
        }
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-green-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Décorations (lignes ondulées et particules) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,215,0,0.1)_0%,_transparent_70%)] opacity-50"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[linear-gradient(45deg,transparent_50%,#4ade80_50%)] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-[linear-gradient(-45deg,transparent_50%,#22d3ee_50%)] opacity-15 animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Nom de l'application */}
        <div className="flex items-center justify-center mb-10">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-300 to-teal-500 drop-shadow-lg animate-fadeIn">
            AlphaTasks
          </span>
        </div>

        {/* Message de bienvenue */}
        <h1 className="text-4xl font-semibold text-white text-center mb-10 drop-shadow-xl animate-fadeIn-delay">
          Bienvenue dans la productivité
        </h1>

        {/* Formulaire */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-white/95"
                placeholder="Entez votre adresse email"
              />
            </div>

            {/* Mot de passe avec icône légèrement descendue */}
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-white/95"
                placeholder="Entrez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[60%] -translate-y-1/2 flex items-center text-gray-500 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full p-2 transition-all duration-300 hover:bg-green-100/40"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Se connecter
            </button>

            {message && (
              <div className="text-red-500 text-sm text-center mt-4 animate-fadeIn">
                {message}
              </div>
            )}
          </form>

          <div className="text-sm text-gray-600 text-center mt-6 space-x-4">
            <Link to="/register" className="hover:underline text-teal-600 font-medium">
              Pas encore inscrit ?
            </Link>
            <Link to="/forgot-password" className="hover:underline text-teal-600 font-medium">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
