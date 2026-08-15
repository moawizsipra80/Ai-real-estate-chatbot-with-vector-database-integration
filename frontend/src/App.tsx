import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PropertyListingsPage } from './pages/PropertyListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AIChatPage } from './pages/AIChatPage';
import { AIHubPage } from './pages/AIHubPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<PropertyListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/ai-hub" element={<AIHubPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
