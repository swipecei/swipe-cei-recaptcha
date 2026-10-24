import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Gallery from './pages/Gallery';
import Timeline from './pages/Timeline';
import Memorial from './pages/Memorial';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ProgramDetail from './pages/ProgramDetail';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import SetNewPassword from './pages/SetNewPassword';
import UserDashboard from './pages/UserDashboard';
import ProfileSetup from './pages/ProfileSetup';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:programId" element={<ProgramDetail />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/new-password" element={<SetNewPassword />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/memorial" element={<Memorial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;