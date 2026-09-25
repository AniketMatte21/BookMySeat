import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { EventApi } from "../api/Event";
import { useAuth } from "../context/AuthContext";
import { MdEventSeat } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";
import { 
  FiClock, 
  FiCalendar, 
  FiMapPin, 
  FiArrowLeft, 
  FiAlertCircle, 
  FiCheck,
  FiShoppingBag
} from "react-icons/fi";
import LoginModal from "../component/auth/LoginModel";
import { Auth } from "../api/Auth";
import { BookingAPi } from "../api/Booking";

export default function ShowSeatsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isBooking, setIsBooking] = useState(false);

  // Read params from query params or route state fallback
  const screenId = searchParams.get("screenId") || location.state?.screenId;
  const showId = searchParams.get("showId") || location.state?.showId;

  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Time formatter (e.g., "17:00:00" -> "5:00 PM")
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
      setIsLoginOpen(true);
    }
  }, [user, authLoading]);

  //proceed to checkout
  const handleProceedToCheckout = async () => {
  if (selectedSeats.length === 0) return;

  setIsBooking(true);
  try {
    // Array of numeric seat IDs for the backend
    const seatIds = selectedSeats.map((s) => s.seatId);
    console.log(seatIds);
    console.log(showId)

    const response = await BookingAPi.bookTicket(showId, seatIds);
    console.log(response);
    // Accommodate token returned as string, object, or response.data
    const token = response?.token || (typeof response === "string" ? response : response?.data?.token);
   
if (!token) {
        // In case the backend returns 200 with lockedSeatId array
        const lockedIds = response?.lockedSeatId || response?.data?.lockedSeatId || [];
        if (lockedIds.length > 0) {
          showLockedSeatsToast(lockedIds);
          refreshSeatLayout();
          return;
        }

        toast.error("Failed to hold seats. Please try again.");
        return;
      }

    // Store reservation token with 10-min timestamp in sessionStorage
    sessionStorage.setItem("booking_token", token);
    sessionStorage.setItem("booking_start_time", Date.now().toString());

    // Navigate to checkout with show details and seat list
    navigate("/checkout", {
      state: {
        showId,
        eventId: seatData?.eventId,
        title: seatData?.title,
        venueLocation: seatData?.venueLocation,
        city: seatData?.city,
        showDate: seatData?.showDate,
        showTime: seatData?.showTime,
        selectedSeats: selectedSeats.map((s) => ({
          seatId: s.seatId,
          seatLabel: `${s.rowIdentifier}${s.seatNumber}`,
          tier: s.tier,
          price: s.tier === "RECLINER" ? 350 : s.tier === "PLATINUM" ? 250 : 180,
        })),
      },
    });
  } catch (err) {
    console.error("Booking error:", err);
  } finally {
    setIsBooking(false);
  }
};

const showLockedSeatsToast = (lockedIds) => {
    const allSeats = seatData?.seatResponseDtoList || [];

    const lockedLabels = lockedIds
      .map((id) => {
        const found = allSeats.find((s) => Number(s.seatId) === Number(id)) ||
                      selectedSeats.find((s) => Number(s.seatId) === Number(id));
        return found ? `${found.rowIdentifier}${found.seatNumber}` : null;
      })
      .filter(Boolean);

    const labelText = lockedLabels.length > 0 ? lockedLabels.join(", ") : "Selected";
    toast.error(`Seat(s) ${labelText} are locked or taken. Please select different seats.`, {
      duration: 5000,
    });

    // Remove the locked seats from current user selection
    setSelectedSeats((prev) => prev.filter((s) => !lockedIds.includes(s.seatId)));
  };
  // Fetch Seat Layout
  useEffect(() => {
    if (!user || !screenId || !showId) return;

    const fetchSeats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await EventApi.getSeatLayout(screenId, showId);
        const data = res?.data || res;
        setSeatData(data);
      } catch (err) {
        console.error("Failed to load seat layout:", err);
        setError("Unable to load theater seats for this show.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [screenId, showId, user]);

  // Group seats by Tier and then by Row Identifier
  const tieredRows = useMemo(() => {
    if (!seatData?.seatResponseDtoList) return [];

    const tiers = {};
    seatData.seatResponseDtoList.forEach((seat) => {
      const tierName = seat.tier || "STANDARD";
      if (!tiers[tierName]) tiers[tierName] = {};

      const row = seat.rowIdentifier || "A";
      if (!tiers[tierName][row]) tiers[tierName][row] = [];
      tiers[tierName][row].push(seat);
    });

    // Sort seats by gridColumn within each row
    Object.keys(tiers).forEach((t) => {
      Object.keys(tiers[t]).forEach((r) => {
        tiers[t][r].sort((a, b) => a.gridColumn - b.gridColumn);
      });
    });

    return tiers;
  }, [seatData]);

  // Toggle seat selection
  const handleToggleSeat = (seat) => {
    if (seat.seatStatus !== "AVAILABLE") return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seatId === seat.seatId);
      if (exists) {
        return prev.filter((s) => s.seatId !== seat.seatId);
      } else {
        return [...prev, seat];
      }
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

  if (authLoading) {
    return (
      
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    
    <div className="relative min-h-screen bg-[#030712] text-slate-100 pb-32 select-none overflow-x-hidden">
      {/* Background Glows */}
      <div><Toaster/></div>
      <div className="fixed top-10 left-[20%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-10 right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseModal}
        onGoogleLogin={handleGoogleLogin}
      />

      {/* Main Container: 25% Margins left and right on desktop */}
      <div className="relative w-full px-4 sm:px-8 lg:px-[25%] pt-8">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md transition-all active:scale-95"
          >
            <FiArrowLeft size={14} />
            <span>Back to Shows</span>
          </button>

          <span className="text-xs text-indigo-400 font-mono tracking-wider">
            SHOW #{showId}
          </span>
        </div>

        {/* Header Metadata Card */}
        <div className="relative p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {seatData?.title || "Select Your Seats"}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
            {seatData?.venueLocation && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <FiMapPin size={12} className="text-indigo-400" />
                {seatData.venueLocation}, {seatData.city}
              </span>
            )}

            {seatData?.showDate && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <FiCalendar size={12} className="text-indigo-400" />
                {seatData.showDate}
              </span>
            )}

            {seatData?.showTime && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 font-medium">
                <FiClock size={12} className="text-indigo-400" />
                {formatTime(seatData.showTime)}
              </span>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Rendering screen layout...</span>
          </div>
        )}

        {/* Error Notification */}
        {error && !loading && (
          <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Interactive Theater Layout */}
        {!loading && !error && seatData && (
          <div className="flex flex-col items-center">
            
            {/* Cinema Screen (Curved Visual) */}
            <div className="w-full max-w-xl mx-auto mb-10 flex flex-col items-center">
              <div className="w-full h-2.5 rounded-[100%] bg-gradient-to-r from-indigo-500/10 via-indigo-500 to-indigo-500/10 shadow-[0_0_24px_rgba(99,102,241,0.6)]" />
              <div className="w-[88%] h-8 bg-gradient-to-b from-indigo-500/10 to-transparent blur-sm rounded-t-full pointer-events-none" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-slate-500 font-bold -mt-2">
                All Eyes This Way (Screen)
              </span>
            </div>

            {/* Seat Map Matrix */}
            <div className="w-full flex flex-col items-center gap-8 overflow-x-auto pb-4">
              {Object.entries(tieredRows).map(([tierName, rows]) => (
                <div key={tierName} className="w-full flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                    {tierName}
                  </span>

                  <div className="flex flex-col gap-2.5 items-center">
                    {Object.entries(rows).map(([rowId, seats]) => (
                      <div key={rowId} className="flex items-center gap-3">
                        {/* Row Identifier */}
                        <span className="w-5 text-center text-xs font-bold text-slate-500">
                          {rowId}
                        </span>

                        {/* Seats in Row */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {seats.map((seat) => {
                            const isAvailable = seat.seatStatus === "AVAILABLE";
                            const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);

                            return (
                              <button

                                key={seat.seatId}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => handleToggleSeat(seat)}
                                title={`Row ${seat.rowIdentifier} - Seat ${seat.seatNumber} (${seat.tier})`}
                                className={`cursor-pointer relative group p-1 sm:p-1.5 rounded-lg transition-all duration-200 active:scale-90 ${
                                  !isAvailable
                                    ? "text-black cursor-not-allowed opacity-70"
                                    : isSelected
                                    ? "text-indigo-400 scale-110 drop-shadow-[0_0_8px_rgba(129,140,248,0.7)]"
                                    : "text-emerald-500 hover:text-emerald-400 hover:scale-105"
                                }`}
                              >
                                <MdEventSeat className="text-xl sm:text-2xl" />
                                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-slate-200">
                                  {seat.seatNumber}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <span className="w-5 text-center text-xs font-bold text-slate-500">
                          {rowId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend Guide */}
            <div className="flex items-center justify-center gap-6 mt-8 py-3 px-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <MdEventSeat className="text-emerald-500 text-lg" />
                <span className="text-slate-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEventSeat className="text-indigo-400 text-lg" />
                <span className="text-slate-400">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEventSeat className="text-black text-lg" />
                <span className="text-slate-400">Booked / Blocked</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Booking Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[50%] z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl border border-indigo-500/40 bg-slate-950/90 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Selected Seats ({selectedSeats.length})
              </span>
              <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
                <span className="text-xs font-bold text-indigo-300">
                  {selectedSeats.map((s) => `${s.rowIdentifier}${s.seatNumber}`).join(", ")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="cursor-pointer px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r  to-purple-600 hover:opacity-90 active:scale-95 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
            >
              <FiShoppingBag size={14} />
              Continue to Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}