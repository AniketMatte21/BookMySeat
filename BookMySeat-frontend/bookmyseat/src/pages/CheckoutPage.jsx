import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiClock,
  FiCalendar,
  FiMapPin,
  FiArrowLeft,
  FiShield,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";
import { MdEventSeat } from "react-icons/md";
import { BookingAPi } from "../api/Booking";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  

  const bookingState = location.state;
  const token = sessionStorage.getItem("booking_token");

  // Loading state for checkout redirection
  const [isProcessing, setIsProcessing] = useState(false);

  // 10-Minute Countdown Timer (600s)
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem("booking_start_time");
    if (!savedTime) return 600;
    const elapsed = Math.floor((Date.now() - parseInt(savedTime, 10)) / 1000);
    const remaining = 600 - elapsed;
    return remaining > 0 ? remaining : 0;
  });

  useEffect(() => {
    if (!authLoading && (!user || !token || !bookingState)) {
      navigate("/");
    }
  }, [user, authLoading, token, bookingState, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      sessionStorage.removeItem("booking_token");
      sessionStorage.removeItem("booking_start_time");
      alert("Seat holding session expired. Please reselect your seats.");
      navigate(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  };

  if (!bookingState) return null;

  const { title, venueLocation, city, showDate, showTime, selectedSeats = [] } = bookingState;

  const subtotal = selectedSeats.reduce((acc, seat) => acc + (seat.price || 200), 0);
  const convenienceFee = Math.round(subtotal * 0.12);
  const integratedGst = Math.round(convenienceFee * 0.18);
  const totalAmount = subtotal + convenienceFee + integratedGst;

  const handleMakePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const bookingDetails = {
        productName: "Seat Booking",
        Seats: selectedSeats.map((seat) => seat.seatId),
        amount: totalAmount,
        currency: "INR",
        quantity: selectedSeats.length,
        showId: bookingState.showId,
        token: token,
      };

      const res = await BookingAPi.handleCheckout(bookingDetails);
      // Save bookingId so TicketPage can fetch details on return
    const bookingId = res?.bookingId || res?.data?.bookingId;
    if (bookingId) {
      sessionStorage.setItem("last_booking_id", bookingId);
    }

      const targetUrl = res?.sessionUrl || res?.url || (typeof res === "string" ? res : null);
      if (targetUrl) {

        window.location.href = targetUrl;
      } else {
        throw new Error("No session URL received");
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert("Failed to connect to payment gateway. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 pb-24 font-sans select-none antialiased relative">
      {/* Optional Fullscreen Overlay on Redirect */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-300 tracking-wider">
            Redirecting to secure gateway...
          </p>
        </div>
      )}

      {/* Subtle Noise Texture & Radial Lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* 30% margin left & right on desktop */}
      <div className="relative w-full px-4 sm:px-8 lg:px-[30%] pt-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            disabled={isProcessing}
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Modify Selection</span>
          </button>

          {/* Session Timer Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 shadow-sm">
            <FiClock size={13} className="text-amber-400" />
            <span className="text-[11px] font-medium tracking-wide">
              Expires in <span className="font-mono font-bold">{formatTimer(timeLeft)}</span>
            </span>
          </div>
        </div>

        {/* Physical Boarding Ticket Container */}
        <div className="relative rounded-2xl bg-[#11131a] border border-[#212534] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Top Ticket Portion */}
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-1">
                  Confirmed Hold
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                  {title}
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-normal">
                  <FiMapPin size={13} className="text-slate-500 shrink-0" />
                  {venueLocation}, <span className="text-slate-300 font-medium">{city}</span>
                </p>
              </div>

              {/* Theater Stamp / Seat Count */}
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Tickets
                </span>
                <span className="text-2xl font-mono font-bold text-white leading-none">
                  {String(selectedSeats.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Flight/Cinema Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#1b1e2c]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Date
                </span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <FiCalendar size={12} className="text-slate-400" />
                  {showDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Showtime
                </span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <FiClock size={12} className="text-slate-400" />
                  {formatTime(showTime)}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Seats Assigned
                </span>
                <span className="text-xs font-bold text-indigo-400 mt-0.5 tracking-wider font-mono truncate block">
                  {selectedSeats.map((s) => s.seatLabel).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Notch Left & Right */}
          <div className="relative flex items-center justify-between w-full h-6 px-1">
            <div className="w-4 h-8 bg-[#090a0f] border-r border-[#212534] rounded-r-full -ml-3" />
            <div className="w-full border-b border-dashed border-[#252a3b] mx-2" />
            <div className="w-4 h-8 bg-[#090a0f] border-l border-[#212534] rounded-l-full -mr-3" />
          </div>

          {/* Lower Ticket Portion: Seat Inventory & Line Items */}
          <div className="p-6 sm:p-7 pt-4 bg-[#0d0f16]/60">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">
              Seat Allocation Breakdown
            </span>

            <div className="divide-y divide-[#1c202e] mb-6">
              {selectedSeats.map((seat) => (
                <div
                  key={seat.seatId}
                  className="flex items-center justify-between py-2.5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <MdEventSeat size={15} className="text-slate-500" />
                    <span className="font-mono font-bold text-slate-100">{seat.seatLabel}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181c28] text-slate-400 uppercase font-semibold">
                      {seat.tier}
                    </span>
                  </div>
                  <span className="font-mono text-slate-300 font-medium">₹{seat.price || 200}.00</span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="p-4 rounded-xl bg-[#090b10] border border-[#1d212f] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-slate-300">₹{subtotal}.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Charge</span>
                <span className="font-mono text-slate-300">₹{convenienceFee}.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Integrated GST (18%)</span>
                <span className="font-mono text-slate-300">₹{integratedGst}.00</span>
              </div>
              
              <div className="pt-2 mt-2 border-t border-[#1a1e2b] flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Amount Due
                </span>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-white">₹{totalAmount}</span>
                  <span className="text-[10px] text-slate-500 block">All taxes included</span>
                </div>
              </div>
            </div>

            {/* Simulated Barcode / Serial */}
            <div className="mt-6 pt-4 border-t border-[#1a1e2a] flex flex-col sm:flex-row items-center justify-between gap-3 opacity-60">
              <div className="flex gap-[3px] h-7 items-center">
                {[2, 4, 1, 3, 2, 5, 1, 2, 4, 2, 3, 1, 5, 2, 1, 3, 4, 2].map((w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-full bg-slate-400 inline-block"
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-slate-500 tracking-wider">
                AUTH: {token ? token.slice(0, 18) : "SESSION-LIVE"}...
              </span>
            </div>

            {/* Action Button with Inline Spinner */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleMakePayment}
              className={`mt-6 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-white hover:bg-slate-200 active:scale-[0.99] text-black shadow-[0_10px_25px_rgba(255,255,255,0.12)] transition-all flex items-center justify-center gap-2 ${
                isProcessing ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <FiLock size={14} className="text-black" />
                  <span>Pay ₹{totalAmount} & Confirm</span>
                </>
              )}
            </button>

            {/* Guarantee Badge */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <FiCheckCircle size={12} className="text-emerald-500" />
              <span>Instant electronic ticket dispatch via SMS & Email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}