import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Link sent! Please check your email.");
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network or server error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-green-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,215,0,0.1)_0%,_transparent_70%)] opacity-50"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[linear-gradient(45deg,transparent_50%,#4ade80_50%)] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-[linear-gradient(-45deg,transparent_50%,#22d3ee_50%)] opacity-15 animate-pulse-slow"></div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-300 to-teal-500 drop-shadow-lg animate-fadeIn">
          Alphaplan
        </h1>
      </header>

      {/* Subtitle */}
      <h2 className="text-3xl font-semibold text-white text-center mb-10 drop-shadow-xl animate-fadeIn-delay">
        Réinitialisez votre mot de passe
      </h2>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Envoyer le lien de réinitialisation
          </button>

          {(message || error) && (
            <div
              className={`text-sm text-center mt-4 ${
                message ? "text-green-600" : "text-red-500"
              } animate-fadeIn`}
            >
              {message || error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
