import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth } from "../../api/Auth";

export default function AuthCallback({ onLoginSuccess }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
 
        // Validate session via /api/auth/me
        const user = await Auth.getCurrentUser();

        console.log("Authenticated user:", user);

        // Inform parent or state manager of the authenticated user
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        // Redirect to home page
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Auth validation failed:", err);
        setError("Failed to verify login. Redirecting...");
        setTimeout(() => navigate("/", { replace: true }), 2500);
      }
    };

    handleAuth();
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      {error ? (
        <p className="text-red-400 text-lg">{error}</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300 font-medium">Verifying your account...</p>
        </div>
      )}
    </div>
  );
}