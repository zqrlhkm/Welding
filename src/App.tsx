/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { LeadFormSection } from './components/LeadFormSection';
import { Navbar } from './components/Navbar';
import { PainPointsSection } from './components/PainPointsSection';
import { ProgramsSection } from './components/ProgramsSection';
import { SolutionSection } from './components/SolutionSection';

export default function App() {
  const [selectedProgram, setSelectedProgram] = useState('');

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
        />
      </main>
      <Footer />
    </div>
  );
}
