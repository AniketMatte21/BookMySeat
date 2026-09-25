import React, { useEffect, useState } from "react";



export default function LoginModal({ isOpen, onClose, onGoogleLogin }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle smooth entrance/exit transitions
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small timeout lets browser paint before transitioning opacity
      const timer = setTimeout(() => setIsAnimating(true), 20);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

 

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isAnimating
          ? "bg-black/70 backdrop-blur-md opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-8 text-white shadow-2xl transition-all duration-300 ease-out ${
          isAnimating
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Welcome to BookMySeat
          </h3>
          <p className="mt-1.5 text-sm text-slate-400">
            Sign in to reserve and manage your seats
          </p>
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200 font-medium text-sm transition-all duration-200 shadow-sm active:scale-[0.99]"
        >
          {/* Official Google Vector Logo */}
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27a7.202 7.202 0 0 1 0-4.54V6.58H1.26a11.967 11.967 0 0 0 0 10.84l4.02-3.15Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
     

        {/* Email & Password Form */}
      
      </div>
    </div>
  );
}