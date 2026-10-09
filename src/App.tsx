import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { ParentsAssociation } from './pages/ParentsAssociation';
import { Contact } from './pages/Contact';
import { Quote } from './pages/Quote';

// Admin imports
import { AdminLogin } from './pages/AdminLogin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

// Admin CMS pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHomepage } from './pages/admin/AdminHomepage';
import { AdminAbout } from './pages/admin/AdminAbout';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminParentsAssociation } from './pages/admin/AdminParentsAssociation';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminContact } from './pages/admin/AdminContact';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminSEO } from './pages/admin/AdminSEO';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Gallery />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="parents-association" element={<ParentsAssociation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="quote" element={<Quote />} />
        </Route>

        {/* Dedicated Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin CMS Panel */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="homepage" element={<AdminHomepage />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="profile" element={<AdminAbout />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="parents-association" element={<AdminParentsAssociation />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="whatsapp" element={<AdminContact />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="seo" element={<AdminSEO />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
