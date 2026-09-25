import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventApi } from "../api/Event";
import { useAuth } from "../context/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiFilm,
  FiGlobe,
  FiShield,
  FiArrowLeft,
  FiPlay,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import LoginModal from "../component/auth/LoginModel";
import { Auth } from "../api/Auth";
import InputToast from "../component/InputToast";

export default function ProcessEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoginOpen(true);
    }
  }, [user, authLoading]);

  // Fetch Event Metadata
  useEffect(() => {
    if (!user || !eventId) return;

    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await EventApi.getEventById(eventId);
        const data = response?.data || response;
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event details:", err);
        setError("Could not load event information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, user]);

  // Toast submit handler that routes to Shows.jsx
  const handleLocationSubmit = (enteredCity) => {
    if (!event) return;

    const formattedTitle = encodeURIComponent(
      event.title.toLowerCase().replace(/\s+/g, "-")
    );

    // Pass eventId in the query parameter and city
    navigate(`/show/${formattedTitle}?eventId=${event.eventId || eventId}&city=${encodeURIComponent(enteredCity)}`, {
      state: {
        eventId: event.eventId || eventId,
        city: enteredCity,
      },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await Auth.getLoginUrl();
      const redirectUrl = response.url || response;
      if (redirectUrl) window.location.href = redirectUrl;
    } catch (err) {
      console.error("Login redirect failed:", err);
    }
  };

  const handleCloseModal = () => {
    setIsLoginOpen(false);
    if (!user) navigate("/");
  };

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 select-none">
      {/* Login Modal for unauthenticated visitors */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseModal}
        onGoogleLogin={handleGoogleLogin}
      />

      {/* Outer Layout: 15% margin on left and right on larger displays */}
      <div className="w-full px-4 sm:px-8 lg:px-[15%] pt-6">
        {/* Top Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all mb-6"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-32 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading event details...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Event Content View */}
        {!loading && !error && event && (
          <div className="space-y-8">
            {/* Banner Section with Poster Overlay */}
            <div className="relative w-full h-[220px] sm:h-[340px] md:h-[400px] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900">
              <img
                src={event.bannerUrl || event.posterUrl}
                alt={event.title}
                className="w-full h-full object-cover brightness-[0.45]"
              />

              {/* Ambient Glow / Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Banner Text Header */}
              <div className="absolute bottom-6 left-6 sm:left-10 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {event.category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {event.category}
                      </span>
                    )}
                    {event.genre && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
                        {event.genre}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                    {event.title}
                  </h1>
                </div>

                {event.trailerUrl && (
                  <a
                    href={event.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold backdrop-blur-md transition-all self-start sm:self-auto shadow-lg"
                  >
                    <FiPlay size={14} className="text-indigo-400" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>

            {/* Main Details Grid: Left Poster Card & Right Metadata Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Poster Image */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-indigo-500/20 bg-slate-900">
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                    type="button"
                  onClick={() => {
                    setShowToast(true)
                  }}
                  className="w-full max-w-[280px] mt-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r  to-purple-600 hover:opacity-90 active:scale-95 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  Book Tickets
                </button>
              </div>

              <InputToast
                isOpen={showToast}
                onClose={() => setShowToast(false)}
                onSubmit={handleLocationSubmit}
                placeholder="Enter your location..."
            />

              {/* Right Column: Key Details & Overview */}
              <div className="md:col-span-8 flex flex-col gap-6">
                {/* Highlights Badge Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {event.durationMins && (
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center gap-3">
                      <FiClock className="text-indigo-400 shrink-0" size={18} />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium block">Duration</span>
                        <span className="text-xs font-semibold text-slate-200">{event.durationMins} mins</span>
                      </div>
                    </div>
                  )}

                  {event.releaseDate && (
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center gap-3">
                      <FiCalendar className="text-indigo-400 shrink-0" size={18} />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium block">Release Date</span>
                        <span className="text-xs font-semibold text-slate-200">{event.releaseDate}</span>
                      </div>
                    </div>
                  )}

                  {event.language && (
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center gap-3">
                      <FiGlobe className="text-indigo-400 shrink-0" size={18} />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium block">Language</span>
                        <span className="text-xs font-semibold text-slate-200">{event.language}</span>
                      </div>
                    </div>
                  )}

                  {event.censorRating && (
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center gap-3">
                      <FiShield className="text-indigo-400 shrink-0" size={18} />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium block">Censor Rating</span>
                        <span className="text-xs font-semibold text-slate-200">{event.censorRating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* About & Description Panel */}
                <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md space-y-3">
                  <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                    <FiFilm className="text-indigo-400" size={16} />
                    About The Event
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {event.description || "No description provided for this event."}
                  </p>
                </div>

                {/* Metadata Breakdown */}
                <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md space-y-3">
                  <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Event Status</span>
                      <span className="text-slate-200 flex items-center gap-1">
                        <FiCheckCircle className="text-emerald-400" size={13} />
                        {event.isActive ? "Live / Booking Open" : "Closed"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Event ID</span>
                      <span className="text-slate-300 font-mono">#{event.eventId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}