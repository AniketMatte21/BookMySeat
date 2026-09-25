import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { EventApi } from "../api/Event";
import { useAuth } from "../context/AuthContext";
import { 
  FiClock, 
  FiGlobe, 
  FiMapPin, 
  FiCalendar, 
  FiAlertCircle, 
  FiArrowLeft,
  FiCompass,
  FiChevronRight
} from "react-icons/fi";
import LoginModal from "../component/auth/LoginModel";
import { Auth } from "../api/Auth";

export default function Shows() {
  const { showName } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // URL Query Params take priority over router state
  const eventId = searchParams.get("eventId") || location.state?.eventId || 1;
  const city = searchParams.get("city") || location.state?.city || "Chandrapur";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Date Logic (Today & Tomorrow)
  const todayObj = new Date();
  const tomorrowObj = new Date();
  tomorrowObj.setDate(todayObj.getDate() + 1);

  const formatDate = (d) => d.toISOString().split("T")[0];
  const todayStr = formatDate(todayObj);
  const tomorrowStr = formatDate(tomorrowObj);

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoginOpen(true);
    }
  }, [user, authLoading]);

  // Fetch Shows
  useEffect(() => {
    if (!user || !eventId) return;

    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await EventApi.getShows(eventId, city, selectedDate);
        const result = response?.data || response;
        setData(result);
      } catch (err) {
        console.error("Failed to load show timings:", err);
        setError("Unable to load shows for this location and date.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [eventId, city, selectedDate, user]);

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

const handleShowSelect = (screenId, showId, venueName, showTime, screenName) => {
  navigate(`/seat-layout?screenId=${screenId}&showId=${showId}`, {
    state: {
      screenId,
      showId,
      eventId,
      title: data?.title,
      venueName,
      showTime,
      screenName,
      date: selectedDate,
    },
  });
};

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 pb-28 select-none overflow-x-hidden font-sans">
      {/* Background Ambient Aura Glows */}
      <div className="fixed top-12 left-[20%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-10 right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseModal}
        onGoogleLogin={handleGoogleLogin}
      />

      {/* Main Container: 25% Margins on Desktop */}
      <div className="relative w-full px-4 sm:px-8 lg:px-[25%] pt-8">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all active:scale-95 shadow-sm"
          >
            <FiArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <FiMapPin size={12} className="text-indigo-400" />
            <span className="capitalize">{city}</span>
          </div>
        </div>

        {/* Hero Card Header */}
        <div className="relative p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl mb-8 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Theatrical Showtimes
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {data?.title || decodeURIComponent(showName || "")}
            </h1>

            {/* Event Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-1">
              {data?.language && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 font-medium">
                  <FiGlobe size={13} className="text-indigo-400" />
                  {data.language}
                </span>
              )}

              {data?.durationMin && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 font-medium">
                  <FiClock size={13} className="text-indigo-400" />
                  {data.durationMin} mins
                </span>
              )}

              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 font-medium">
                <FiCompass size={13} className="text-indigo-400" />
                2D / 3D Experience
              </span>
            </div>
          </div>

          {/* Minimalist Tabbed Date Toggle */}
          <div className="cursor-pointer flex items-center gap-3 mt-7 pt-6 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className={`cursor-pointer relative flex items-center gap-3 px-5 py-2.5 rounded-2xl border text-left transition-all duration-300 ${
                selectedDate === todayStr
                  ? "bg-indigo-600 border-indigo-400/80 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]"
                  : "bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Today
                </span>
                <span className="text-xs font-bold">
                  {todayObj.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDate(tomorrowStr)}
              className={`cursor-pointer relative flex items-center gap-3 px-5 py-2.5 rounded-2xl border text-left transition-all duration-300 ${
                selectedDate === tomorrowStr
                  ? "bg-indigo-600 border-indigo-400/80 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]"
                  : "bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Tomorrow
                </span>
                <span className="text-xs font-bold">
                  {tomorrowObj.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium tracking-wide">
              Locating live screens in {city}...
            </span>
          </div>
        )}

        {/* Error Notification */}
        {error && !loading && (
          <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Venues & Timings Group */}
        {!loading && !error && data?.filterVenueResponseDtoList?.length > 0 ? (
          <div className="space-y-4">
            {data.filterVenueResponseDtoList.map((venue) => (
              <div
                key={venue.venueId}
                className="group p-5 sm:p-6 rounded-2xl border border-slate-800/70 bg-slate-900/30 hover:border-slate-700/80 backdrop-blur-xl transition-all duration-300 shadow-lg"
              >
                {/* Venue Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/50 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      {venue.venueLocation}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <FiMapPin size={12} className="text-slate-500" />
                      {venue.cityAddress}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
                    Available Screens
                  </span>
                </div>

                {/* Showtimes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4">
                  {venue.filterShowResponseDto?.map((show) => {
                    const isImmersive = show.screenName?.toLowerCase().includes("ice") || 
                                        show.screenName?.toLowerCase().includes("director");
                    return (
                      <button
                      
                        key={show.showId}
                        type="button"
                       onClick={() => handleShowSelect(show.screenId, show.showId, venue.venueLocation, show.startTime, show.screenName)}
                        className="group/btn relative flex flex-col justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/60 hover:bg-indigo-600/10 active:scale-95 transition-all duration-200 text-left shadow-sm hover:shadow-indigo-500/10 cursor-pointer"
                      >
                        {console.log("show id:", show.showId, " "+ "screenId: "+ show.screenId) }
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover/btn:text-indigo-300 transition-colors">
                            {formatTime(show.startTime)}
                          </span>
                          <FiChevronRight size={12} className="text-slate-600 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-0.5 transition-all" />
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-1 w-full">
                          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                            {show.screenName}
                          </span>
                          {isImmersive && (
                            <span className="text-[9px] font-semibold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                              Dolby
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="py-20 flex flex-col items-center justify-center text-center rounded-3xl border border-slate-800/60 bg-slate-900/20 p-8">
              <FiCalendar size={32} className="text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No Showtimes Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No active shows match your selection in {city} for this date. Try toggling to tomorrow or selecting another location.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}