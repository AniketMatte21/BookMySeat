import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { EventApi } from "../api/Event";
import { useNavigate } from "react-router-dom";


export default function SearchComponent({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced API search call
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const response = await EventApi.getSearchEvent(query.trim());
        const data = Array.isArray(response) ? response : response?.data || [];
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Capture eventId on click
  const handleEventClick = (eventId) => {
    onClose();
    navigate(`/event/${eventId}`); // or navigate to seat selection/details
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-20 sm:pt-24 select-none">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full px-4 sm:px-8 lg:px-[25%] z-10 flex flex-col items-center max-h-[85vh]">
        {/* Search Input Box */}
        <div className="w-full rounded-2xl bg-[#0e0d14] border border-[#242132] shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col transition-all">
          <div className="flex items-center px-4 py-3.5 gap-3">
            <FiSearch className="text-slate-400 text-lg shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, categories, or keywords..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none caret-purple-500 font-normal"
            />
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-medium text-slate-400 bg-[#191624] border border-[#2d2840] rounded-md hover:text-white transition-colors"
            >
              esc
            </button>
          </div>

    
        </div>

        {/* Results with Title and Poster Only */}
        {(query.trim().length > 1 || results.length > 0) && (
          <div className="w-full mt-3 overflow-y-auto rounded-2xl bg-[#0e0d14]/90 backdrop-blur-md border border-[#242132] p-3 space-y-2 max-h-[50vh] shadow-xl">
            {isSearching ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                Searching events...
              </div>
            ) : results.length > 0 ? (
              results.map((event) => (
                <div
                  key={event.eventId}
                  onClick={() => handleEventClick(event.eventId)}
                  className="flex items-center gap-3.5 p-2 rounded-xl bg-[#14121d] border border-[#242033] hover:border-purple-500/50 hover:bg-[#1a1727] transition-all cursor-pointer group"
                >
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="w-17 h-25 object-cover rounded-lg bg-slate-900 shrink-0"
                  />
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 truncate transition-colors">
                    {event.title}
                  </h4>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No matching events found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}