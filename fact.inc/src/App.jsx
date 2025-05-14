import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import Product from './pages/Products/product';
import CompanyType from './pages/LandingPage/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';

import NameReservation from './pages/NameReservation/NameReservation';
import Directors from './pages/director/directors';
import Inc9 from './pages/INC-9/inc-9';
import AgilePro from './pages/AGILE PRO-S/Agile_pro';
import SpicePartB from './pages/spice_partb/Spice_partb';
import MoA_AoA from './pages/e-MoA_e-AoA/e-MoA_e-AoA';
import Coi from './pages/COI/coi';
import DigitalCredentials from './pages/DigitalCredentials/Digital_Creds';

import ProtectedRoute from './routes/ProtectedRoute';

import './styles/variables.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>

      {/* ✅ Root redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ✅ Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/fact.inc/CompanyType" element={<CompanyType />} />

      {/* ✅ Protected route: Product */}
      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />

      {/* ✅ Protected layout for internal flow */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/fact.inc/NameReservation" element={<NameReservation />} />
        <Route path="/fact.inc/directors" element={<Directors />} />
        <Route path="/fact.inc/inc-9" element={<Inc9 />} />
        <Route path="/fact.inc/Agile_pro" element={<AgilePro />} />
        <Route path="/fact.inc/spice-partb" element={<SpicePartB />} />
        <Route path="/fact.inc/e-MoA_e-AoA" element={<MoA_AoA />} />
        <Route path="/fact.inc/digital-creds" element={<DigitalCredentials />} />
        <Route path="/fact.inc/coi" element={<Coi />} />
      </Route>

    </Routes>
  );
}

export default App;
