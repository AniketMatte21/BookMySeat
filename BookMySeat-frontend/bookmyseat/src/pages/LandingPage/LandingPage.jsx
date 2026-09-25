import BookMySeatIntro from "./BootMySeatIntro";
import { useState, useEffect } from "react";
import SpecularButton from "../../component/Button/SpecularButton";
import NavBar from "../../layout/NavBar";
import LoginModal from "../../component/auth/LoginModel";
import { Auth } from "../../api/Auth";
import Dock from "../../component/Dock";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import ProfileSection from "../ProfieSection";
import MyTickets from "../../component/MyTickets";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { UserApi } from "../../api/UserApi";
import ShowEventsPage from "../ShowEventsPage";
import SearchComponent from "../../component/SearchComponent";

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Route flags based purely on current URL path
  const isProfileRoute = location.pathname === "/profile";
  const isTicketsRoute = location.pathname === "/my-tickets";

  const [userProfile, setUserProfile] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    contactNumber: user?.contactNumber || null,
  });

  // Keep profile form synced with logged-in user
  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        email: user.email || "",
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        contactNumber: user.contactNumber || prev.contactNumber,
      }));
    }
  }, [user]);

  // Auth Guard helper
  const requireAuth = (actionCallback) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    actionCallback();
  };

  // Handle /profile route
  useEffect(() => {
    if (isProfileRoute) {
      if (!user) {
        navigate("/", { replace: true });
        setIsLoginOpen(true);
        return;
      }

      const fetchProfile = async () => {
        setIsProfileLoading(true);
        setProfileError(null);
        try {
          if (typeof UserApi !== "undefined" && UserApi.getProfile) {
            const data = await UserApi.getProfile();
            setUserProfile(data);
          }
        } catch (err) {
          console.error("Error loading profile:", err);
          setProfileError("Could not load your profile details. Please try again.");
        } finally {
          setIsProfileLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isProfileRoute, user, navigate]);

  // Handle /my-tickets route guard
  useEffect(() => {
    if (isTicketsRoute && !user) {
      navigate("/", { replace: true });
      setIsLoginOpen(true);
    }
  }, [isTicketsRoute, user, navigate]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      console.log("Saving updated profile to backend:", updatedData);
      setUserProfile(updatedData);
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  const handleOpenProfile = () => {
    requireAuth(() => navigate("/profile"));
  };

  const handleOpenTickets = () => {
    requireAuth(() => navigate("/my-tickets"));
  };

  const handleCloseSubviews = () => {
    navigate("/");
  };

 const handleLogout=async ()=>{
   const res=await Auth.logout();
    console.log("Logout response:", res);
   if(res.success){
    window.location.reload();
   }
  }

  const items = [
    { 
      icon: <VscHome size={18} />, 
      label: "Home", 
      onClick: () => navigate("/") 
    },
    { 
      icon: <VscArchive size={18} />, 
      label: "My Tickets", 
      onClick: handleOpenTickets 
    },
    { 
      icon: <VscAccount size={18} />, 
      label: "Profile", 
      onClick: handleOpenProfile 
    },
    { 
      icon: <VscSettingsGear size={18} />, 
      label: "Settings", 
      onClick: handleLogout
    },
  ];

  const handleGoogleLogin = async () => {
    try {
      const response = await Auth.getLoginUrl();
      const redirectUrl = response.url || response;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Failed to fetch login URL:", error);
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-slate-950 text-white pb-28">
        {/* Animated Splash / Intro */}
        {showIntro && (
          <BookMySeatIntro
            duration={1500}
            onComplete={() => setShowIntro(false)}
          />
        )}

        {/* Navigation Bar */}
        <NavBar 
          onOpenLogin={() => setIsLoginOpen(true)} 
          onOpenProfile={handleOpenProfile}
          user={user} 
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <SearchComponent 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onGoogleLogin={handleGoogleLogin}
        />

        {/* Dynamic Route View Switching inside LandingPage */}
        {isProfileRoute && user ? (
          <ProfileSection
            userProfile={userProfile}
            isLoading={isProfileLoading}
            error={profileError}
            onUpdateProfile={handleUpdateProfile}
            onClose={handleCloseSubviews}
          />
        ) : isTicketsRoute && user ? (
          <MyTickets onClose={handleCloseSubviews} />
        ) : (
          <ShowEventsPage />
        )}

        {/* Sticky Floating Dock at Bottom */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <Dock
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </>
  );
}