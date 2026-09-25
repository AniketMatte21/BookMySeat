import { useState,useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from './api/Auth'
import AuthCallback from './component/auth/AuthCallback'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import ProfileSection from './pages/ProfieSection'
import ProcessEventPage from './pages/ProcessEventPage'
import Shows from './pages/Shows'
import ShowSeatsPage from './pages/ShowSeatsPage'
import CheckoutPage from './pages/CheckoutPage'
import TicketPage from './pages/TicketPage'



function App() {
 const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on page refresh/initial load
  useEffect(() => {
    Auth.getCurrentUser()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  return (
  <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/event/:eventId" element={<ProcessEventPage />} />
          <Route path="/show/:showName" element={<Shows />} />
          <Route path="/seat-layout" element={<ShowSeatsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<TicketPage />} />
          <Route path="/my-tickets" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
