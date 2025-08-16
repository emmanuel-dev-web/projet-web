import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Mot de passe réinitialisé avec succès.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Erreur lors de la réinitialisation.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-green-800 px-6">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-300 to-teal-500 drop-shadow-lg mb-8">
        Alphaplan
      </h1>
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Réinitialisez votre mot de passe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 bg-white/95 transition-all duration-300 pr-12"
              placeholder="Entrez votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-9 text-gray-500 hover:text-green-600 transition"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                // Icône "œil barré" (masquer)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10a9.965 9.965 0 011.38-5.262M6.5 6.5l11 11m0-11l-11 11" />
                </svg>
              ) : (
                // Icône "œil" (afficher)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password field */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-400 bg-white/95 transition-all duration-300 pr-12"
              placeholder="Confirmez votre mot de passe"
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute right-3 top-9 text-gray-500 hover:text-green-600 transition"
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10a9.965 9.965 0 011.38-5.262M6.5 6.5l11 11m0-11l-11 11" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Réinitialiser le mot de passe
          </button>

          {message && (
            <p className="mt-4 text-green-600 font-semibold text-center">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
