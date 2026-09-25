import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookingAPi } from "../api/Booking";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiArrowLeft,
  FiChevronRight,
  FiDownload,
  FiX,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";
import { MdEventSeat } from "react-icons/md";

export default function MyTickets({ onClose }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Time formatter
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  };

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Fetch Tickets
  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        // const targetUserId = user.userId || user.id || user._id;
        const res = await BookingAPi.getAllTicketsByUserId();
        const ticketList = Array.isArray(res) ? res : res?.data || [];
        setTickets(ticketList);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Unable to load your tickets right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (authLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 sm:px-8 lg:px-[35%] pt-4 pb-20 select-none">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
            Booking History
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
            My Tickets
          </h1>
        </div>
        <button
          type="button"
          onClick={onClose || (() => navigate("/"))}
          className="cursor-pointer p-2 rounded-xl bg-[#11131a] border border-[#212534] text-slate-400 hover:text-white transition-all active:scale-95"
          title="Back to shows"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Fetching your tickets...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2.5">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tickets.length === 0 && (
        <div className="py-20 text-center rounded-3xl border border-[#212534] bg-[#11131a]/60 p-8">
          <FiInbox size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Tickets Booked Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When you purchase show tickets, they'll show up right here.
          </p>
        </div>
      )}

      {/* LIST VIEW: Compact Dynamic Ticket Cards */}
      {!loading && !error && tickets.length > 0 && !selectedTicket && (
        <div className="flex flex-col gap-3.5">
          {tickets.map((t) => (
            <div
              key={t.bookingId}
              onClick={() => setSelectedTicket(t)}
              className="cursor-pointer group relative rounded-2xl bg-[#11131a] border border-[#212534] hover:border-indigo-500/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                      Confirmed
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate">
                      ID: {t.bookingId.slice(0, 16)}...
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {t.eventName}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} className="text-slate-500" />
                      {t.showDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={12} className="text-slate-500" />
                      {formatTime(t.showTime)}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-400 font-mono">
                      {t.seats?.length || 0} Seat{t.seats?.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#181b26] border border-[#262b3d] text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                  <FiChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL VIEW: Full Boarding Pass Ticket */}
      {selectedTicket && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => setSelectedTicket(null)}
            className="cursor-pointer mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Back to all tickets</span>
          </button>

          <div className="relative rounded-3xl bg-[#11131a] border border-[#212534] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Top Stub */}
            <div className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                    Official Admission Pass
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                    {selectedTicket.eventName}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    {selectedTicket.venue}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-normal">
                    <FiMapPin size={12} className="text-slate-500 shrink-0" />
                    {selectedTicket.venueAddress}, {selectedTicket.venueCity}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Total Seats
                  </span>
                  <span className="text-2xl font-mono font-bold text-white leading-none">
                    {String(selectedTicket.seats?.length || 0).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#1c202e] text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Date
                  </span>
                  <span className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
                    <FiCalendar size={12} className="text-slate-400" />
                    {selectedTicket.showDate}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Showtime
                  </span>
                  <span className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
                    <FiClock size={12} className="text-slate-400" />
                    {formatTime(selectedTicket.showTime)}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Ticket Holder
                  </span>
                  <span className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                    <FiUser size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{selectedTicket.owner}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Notch */}
            <div className="relative flex items-center justify-between w-full h-6 px-1">
              <div className="w-4 h-8 bg-slate-950 border-r border-[#212534] rounded-r-full -ml-3" />
              <div className="w-full border-b border-dashed border-[#252a3b] mx-2" />
              <div className="w-4 h-8 bg-slate-950 border-l border-[#212534] rounded-l-full -mr-3" />
            </div>

            {/* Bottom Stub */}
            <div className="p-6 pt-4 bg-[#0d0f16]/70">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">
                Assigned Seats
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {selectedTicket.seats?.map((seat) => (
                  <div
                    key={seat.seatId}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#11131a] border border-[#1e2333] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <MdEventSeat size={16} className="text-indigo-400" />
                      <div>
                        <span className="font-mono font-bold text-slate-100">
                          Row {seat.rowIdentifier}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          ID: {seat.seatId}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1f2e] text-indigo-300 font-semibold uppercase tracking-wider">
                      {seat.tier}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reference */}
              <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1b1f2d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Booking Reference
                  </span>
                  <span className="font-mono text-slate-300 font-semibold break-all text-[11px]">
                    {selectedTicket.bookingId}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
                  PAID & VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="cursor-pointer flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#11131a] hover:bg-[#181b25] border border-[#212534] text-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <FiDownload size={14} />
              Print Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}