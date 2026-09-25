import React, { useState, useEffect } from "react";
import { EventApi } from "../api/Event";
import {
  FiCalendar,
  FiAlertCircle,
  FiArrowUpRight,
  FiClock,
  FiFilm,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ShowEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleCardClick = (targetEventId) => {
    navigate(`/event/${targetEventId}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await EventApi.getAllEvents();
        const eventsData = Array.isArray(response) ? response : response?.data || [];
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Unable to load events at this moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const total = events.length;
  // Step by 1 card, allowing users to browse through up to the last visible trio
  const maxIndex = Math.max(0, total - 3);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="w-full my-6 sm:my-8 px-4 sm:px-8 lg:px-[15%] select-none">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 text-left border-b border-slate-800/80 pb-5">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
            Live Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mt-1">
            Upcoming Events
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse concerts, movies, and live arena performances.
          </p>
        </div>

        {/* Carousel Arrow Controls (Visible on Tablet/Desktop) */}
        {total > 3 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="cursor-pointer p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-indigo-500/50 active:scale-95 transition-all shadow-md"
              aria-label="Previous events"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="cursor-pointerp-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-indigo-500/50 active:scale-95 transition-all shadow-md"
              aria-label="Next events"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] md:aspect-[16/9] rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse flex flex-col justify-end p-4"
            >
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2.5">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="py-24 text-center rounded-3xl border border-slate-800/60 bg-slate-900/20 p-8">
          <FiFilm size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Events Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No events are scheduled right now. Check back soon!
          </p>
        </div>
      )}

      {/* Responsive Display: Vertical list on Mobile, Horizontal 3-Card Carousel on Tablet/Desktop */}
      {!loading && !error && events.length > 0 && (
        <div className="relative w-full">
          {/* DESKTOP / TABLET: 3 Cards per view Carousel */}
          <div className="hidden md:block overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out gap-5"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3 + 1.66)}%)`,
              }}
            >
              {events.map((event) => (
                <div
                  key={event.eventId || event.id}
                  onClick={() => handleCardClick(event.eventId || event.id)}
                  className="w-[calc((100%-2.5rem)/3)] shrink-0 group relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer border border-slate-800/80 bg-slate-900 hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-end"
                >
                  <img
                    src={event.bannerUrl || event.posterUrl}
                    alt={event.title || "Event Image"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {event.category && (
                    <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-950/75 border border-slate-700/60 text-slate-300 backdrop-blur-md">
                      {event.category}
                    </span>
                  )}

                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 border border-slate-700/60 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                    <FiArrowUpRight size={14} />
                  </div>

                  <div className="relative p-3.5 z-10 flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 truncate transition-colors drop-shadow-md">
                      {event.title}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                      {event.releaseDate || event.date ? (
                        <span className="flex items-center gap-1 truncate">
                          <FiCalendar size={11} className="text-indigo-400 shrink-0" />
                          <span className="truncate">{event.releaseDate || event.date}</span>
                        </span>
                      ) : null}

                      {event.durationMins && (
                        <span className="flex items-center gap-1 text-slate-400 shrink-0">
                          <FiClock size={10} className="text-slate-500" />
                          {event.durationMins}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE: Vertical Stack */}
          <div className="flex flex-col gap-4 md:hidden">
            {events.map((event) => (
              <div
                key={event.eventId || event.id}
                onClick={() => handleCardClick(event.eventId || event.id)}
                className="group relative aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden cursor-pointer border border-slate-800/80 bg-slate-900 active:scale-[0.98] transition-all duration-200 flex flex-col justify-end"
              >
                <img
                  src={event.bannerUrl || event.posterUrl}
                  alt={event.title || "Event Image"}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85" />

                {event.category && (
                  <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-950/75 border border-slate-700/60 text-slate-300 backdrop-blur-md">
                    {event.category}
                  </span>
                )}

                <div className="relative p-3.5 z-10 flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-white truncate">
                    {event.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                    {event.releaseDate || event.date ? (
                      <span className="flex items-center gap-1 truncate">
                        <FiCalendar size={11} className="text-indigo-400 shrink-0" />
                        <span className="truncate">{event.releaseDate || event.date}</span>
                      </span>
                    ) : null}

                    {event.durationMins && (
                      <span className="flex items-center gap-1 text-slate-400 shrink-0">
                        <FiClock size={10} className="text-slate-500" />
                        {event.durationMins}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}