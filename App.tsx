
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Markets } from './pages/Markets';
import { Charts } from './pages/Charts';
import { Screener } from './pages/Screener';
import { PaperTrading } from './pages/PaperTrading';
import { Profile } from './pages/Profile';
import { Docs } from './pages/Docs';
import { Journal } from './pages/Journal';
import { Analytics } from './pages/Analytics';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/paper-trading" element={<PaperTrading />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
