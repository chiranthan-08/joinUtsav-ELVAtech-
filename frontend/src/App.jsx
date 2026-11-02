import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RoleSwitcherBanner } from './components/RoleSwitcherBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/user/Home';
import { ExploreEvents } from './pages/user/ExploreEvents';
import { EventDetails } from './pages/user/EventDetails';
import { DigitalPassView } from './pages/user/DigitalPassView';
import { AIPlanner } from './pages/user/AIPlanner';
import { DigitalInvitations } from './pages/user/DigitalInvitations';
import { PublicInvitationView } from './pages/user/PublicInvitationView';
import { VenueDiscovery } from './pages/user/VenueDiscovery';
import { UserDashboard } from './pages/user/UserDashboard';

// Organizer Pages
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { CreateEditEvent } from './pages/organizer/CreateEditEvent';
import { ManageAttendees } from './pages/organizer/ManageAttendees';
import { QRScannerPage } from './pages/organizer/QRScannerPage';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Super Admin Page
import { SuperAdminDashboard } from './pages/superAdmin/SuperAdminDashboard';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-saffron-500 selection:text-white">
            {/* Top Interactive Role Switcher Banner */}
            <RoleSwitcherBanner />

            {/* Main Navbar */}
            <Navbar />

            {/* App Body Content */}
            <main className="flex-1">
              <Routes>
                {/* Public & User Discovery Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<ExploreEvents />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/venues" element={<VenueDiscovery />} />
                <Route path="/ai-planner" element={<AIPlanner />} />
                <Route path="/invitations" element={<DigitalInvitations />} />
                <Route path="/invite/:slug" element={<PublicInvitationView />} />
                <Route path="/pass/:passId" element={<DigitalPassView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 1. User Interface */}
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['user', 'organizer', 'admin', 'super_admin']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 2. Event Organizer Interface */}
                <Route
                  path="/organizer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin', 'super_admin']}>
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/new"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin', 'super_admin']}>
                      <CreateEditEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:id/attendees"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin', 'super_admin']}>
                      <ManageAttendees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/scanner"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin', 'super_admin']}>
                      <QRScannerPage />
                    </ProtectedRoute>
                  }
                />

                {/* 3. Admin Interface */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 4. Super Admin Interface */}
                <Route
                  path="/super-admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* Festive Footer */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
