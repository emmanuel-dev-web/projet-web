import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "../assets/icons";
import API_URL from "../config.js";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (!password.trim() || password.trim().length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration", error);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-green-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,215,0,0.1)_0%,_transparent_70%)] opacity-50"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[linear-gradient(45deg,transparent_50%,#4ade80_50%)] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-[linear-gradient(-45deg,transparent_50%,#22d3ee_50%)] opacity-15 animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* App name */}
        <div className="flex items-center justify-center mb-10">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-300 to-teal-500 drop-shadow-lg animate-fadeIn">
            AlphaTasks
          </span>
        </div>

        {/* Welcome message */}
        <h1 className="text-4xl font-semibold text-white text-center mb-10 drop-shadow-xl animate-fadeIn-delay">
          Créez votre compte et commencez
        </h1>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Entrez votre nom"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-white/95"
              />
            </div>

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
                placeholder="Entrez votre adresse email"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-white/95"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                required
                placeholder="Entrez votre mot de passe"
                className="w-full mt-2 px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-white/95"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[60%] -translate-y-1/2 flex items-center text-gray-500 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full p-2 transition-all duration-300 hover:bg-green-100/40"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              S’inscrire
            </button>

            {message && (
              <div className={`text-sm text-center mt-4 ${message.includes("successful") ? "text-green-600" : "text-red-500"} animate-fadeIn`}>
                {message}
              </div>
            )}
          </form>

          <div className="text-sm text-gray-600 text-center mt-6 space-x-4">
            <Link to="/login" className="hover:underline text-teal-600 font-medium">
              Vous avez déjà un compte 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
