/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { LeadFormSection } from './components/LeadFormSection';
import { Navbar } from './components/Navbar';
import { PainPointsSection } from './components/PainPointsSection';
import { ProgramsSection } from './components/ProgramsSection';
import { SolutionSection } from './components/SolutionSection';
import { useLeadCRM } from './hooks/useLeadCRM';

export default function App() {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [isAdminView, setIsAdminView] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash === '#admin' : false
  );

  const { leads, addLead, updateLeadStatus, deleteLead, exportLeadsToCSV } =
    useLeadCRM();

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdmin = () => {
    setIsAdminView(true);
    window.history.replaceState(null, '', '#admin');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const exitAdmin = (scrollToForm = false) => {
    setIsAdminView(false);
    window.history.replaceState(null, '', scrollToForm ? '#daftar' : '#utama');
    if (scrollToForm) {
      requestAnimationFrame(() => {
        document.getElementById('daftar')?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  if (isAdminView) {
    return (
      <AdminDashboard
        leads={leads}
        onAddLead={addLead}
        onUpdateStatus={updateLeadStatus}
        onDeleteLead={deleteLead}
        onExportCSV={exportLeadsToCSV}
        onExitAdmin={exitAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <PainPointsSection />
        <SolutionSection />
        <ProgramsSection
          selectedProgram={selectedProgram}
          onSelectProgram={setSelectedProgram}
        />
        <FaqSection />
        <LeadFormSection
          selectedProgram={selectedProgram}
          onSelectProgram={setSelectedProgram}
          onAddLead={addLead}
        />
      </main>
      <Footer onOpenAdmin={openAdmin} leadCount={leads.length} />
    </div>
  );
}
