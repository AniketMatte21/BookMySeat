import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookingAPi } from "../api/Booking";
import {
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiHome,
  FiDownload,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";
import { MdEventSeat } from "react-icons/md";

export default function TicketPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [ticketData, setTicketData] = useState(location.state?.ticket || null);
  const [loading, setLoading] = useState(!location.state?.ticket);
  const [error, setError] = useState(null);

  // 1. Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // 2. Clear Seat-Hold Tokens
  useEffect(() => {
    sessionStorage.removeItem("booking_token");
    sessionStorage.removeItem("booking_start_time");
  }, []);

  // 3. Fetch Ticket Details dynamically via BookingAPi
  useEffect(() => {
    if (authLoading || !user || ticketData) return;

    const bookingId =
      searchParams.get("bookingId") ||
      sessionStorage.getItem("last_booking_id");

    if (!bookingId) {
      setError("No booking reference found. Please verify your order in your profile.");
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await BookingAPi.getBookedTickets(bookingId);
        const data = res?.data || res;
        setTicketData(data);
      } catch (err) {
        console.error("Failed to load booked ticket:", err);
        setError("Unable to retrieve ticket details. Please refresh or check your email.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [authLoading, user, searchParams, ticketData]);

  // Format 24-hr time string ("20:45:00" -> "8:45 PM")
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // API Ticket Fetch Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-200 flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium tracking-wide">
          Verifying and generating your ticket pass...
        </span>
      </div>
    );
  }

  // Error State Screen
  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-200 flex flex-col items-center justify-center px-4">
        <div className="p-6 rounded-2xl bg-[#11131a] border border-red-500/20 text-center max-w-sm">
          <FiAlertCircle size={36} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white mb-1">Ticket Retrieval Failed</h2>
          <p className="text-xs text-slate-400 mb-5">{error || "Ticket not found."}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const {
    bookingId,
    owner,
    eventName,
    showDate,
    showTime,
    venueAddress,
    venueCity,
    venue,
    seats = [],
  } = ticketData;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 pb-20 font-sans select-none antialiased">
      {/* Background radial glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative w-full px-4 sm:px-8 lg:px-[30%] pt-10">
        {/* Success Header Status */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <FiCheckCircle size={28} />
          </div>
          <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-emerald-400">
            Booking Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            You're All Set!
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Confirmation details have been emailed to{" "}
            <span className="text-slate-200 font-medium">{owner}</span>.
          </p>
        </div>

        {/* Digital Boarding Pass Ticket */}
        <div className="relative rounded-3xl bg-[#11131a] border border-[#212534] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Top Stub */}
          <div className="p-6 sm:p-7">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                  Official Admission Ticket
                </span>
                <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                  {eventName}
                </h2>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  {venue}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-normal">
                  <FiMapPin size={12} className="text-slate-500 shrink-0" />
                  {venueAddress}, {venueCity}
                </p>
              </div>

              {/* Admission Counter */}
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Total Seats
                </span>
                <span className="text-2xl font-mono font-bold text-white leading-none">
                  {String(seats.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Timings & Owner Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#1c202e] text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Date
                </span>
                <span className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
                  <FiCalendar size={12} className="text-slate-400" />
                  {showDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Showtime
                </span>
                <span className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
                  <FiClock size={12} className="text-slate-400" />
                  {formatTime(showTime)}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Ticket Holder
                </span>
                <span className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                  <FiUser size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{owner}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Notches */}
          <div className="relative flex items-center justify-between w-full h-6 px-1">
            <div className="w-4 h-8 bg-[#090a0f] border-r border-[#212534] rounded-r-full -ml-3" />
            <div className="w-full border-b border-dashed border-[#252a3b] mx-2" />
            <div className="w-4 h-8 bg-[#090a0f] border-l border-[#212534] rounded-l-full -mr-3" />
          </div>

          {/* Bottom Stub: Dynamic Seats & Booking Verification */}
          <div className="p-6 sm:p-7 pt-4 bg-[#0d0f16]/70">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">
              Assigned Seat Details
            </span>

            {/* Dynamic Seats Allocation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {seats.map((seat) => (
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
                        Seat ID: {seat.seatId}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1f2e] text-indigo-300 font-semibold uppercase tracking-wider">
                    {seat.tier}
                  </span>
                </div>
              ))}
            </div>

            {/* Booking Reference Box */}
            <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1b1f2d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Booking Reference
                </span>
                <span className="font-mono text-slate-300 font-semibold break-all text-[11px]">
                  {bookingId}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
                PAID & VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#11131a] hover:bg-[#181b25] border border-[#212534] text-slate-300 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <FiDownload size={14} />
            Print Pass
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white hover:bg-slate-200 text-black transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <FiHome size={14} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}