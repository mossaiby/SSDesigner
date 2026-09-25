import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SoftwareSection } from './components/SoftwareSection';
import { ProjectsSection } from './components/ProjectsSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SoftwareDetailPage } from './components/SoftwareDetailPage';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { AdminPortal } from './components/AdminPortal';
import { MediaGalleryModal } from './components/MediaGalleryModal';
import { MediaLightboxViewer } from './components/MediaLightboxViewer';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { SeoAuditDrawer } from './components/SeoAuditDrawer';
import { EngineeringCalculatorDrawer } from './components/EngineeringCalculatorDrawer';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { currentNav } = useData();

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Dynamic Route View Switching */}
        {currentNav.view === 'home' && (
          <>
            <Hero />
            <SoftwareSection />
            <ProjectsSection />
            <BlogSection />
            <ContactSection />
          </>
        )}

        {currentNav.view === 'software' && (
          <SoftwareDetailPage softwareId={currentNav.id} />
        )}

        {currentNav.view === 'project' && (
          <ProjectDetailPage projectId={currentNav.id} />
        )}

        {currentNav.view === 'blog' && (
          <BlogDetailPage postId={currentNav.id} />
        )}

        {currentNav.view === 'all_software' && (
          <SoftwareSection isStandalonePage />
        )}

        {currentNav.view === 'all_projects' && (
          <ProjectsSection isStandalonePage />
        )}

        {currentNav.view === 'all_blog' && (
          <BlogSection isStandalonePage />
        )}

        {currentNav.view === 'admin' && (
          <AdminPortal />
        )}

        {currentNav.view === 'contact' && (
          <ContactSection isStandalonePage />
        )}
      </main>

      <Footer />

      {/* Global Modals & Utilities */}
      <MediaGalleryModal />
      <MediaLightboxViewer />
      <LeadCaptureModal />
      <SeoAuditDrawer />
      <EngineeringCalculatorDrawer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ErrorBoundary>
  );
}
