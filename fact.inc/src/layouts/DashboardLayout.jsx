import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

function DashboardLayout() {
  const location = useLocation();

  useEffect(() => {
    function normalizeZoom() {
      const zoom = window.devicePixelRatio;
      console.log("🔍 Current Zoom Level:", zoom); // 👈 Add this line

      const width = window.innerWidth;
      const height = window.innerHeight;

      const app = document.getElementById('app');
      const cardBodies = document.querySelectorAll('.page-card-body');
      const checklist = document.querySelector('.checklist-overlay');
      const loginContainer = document.querySelector('.login-container');

      if (!app) return;

      const isMobile = width <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

      // 🧹 Clear previous zoom classes
      cardBodies.forEach(body => body.classList.remove('zoom-125', 'zoom-150'));
      if (checklist) checklist.classList.remove('zoom-150');
      if (loginContainer) loginContainer.classList.remove('zoom-150');

      // 📱 Mobile – skip zoom scaling
      if (isMobile) {
        app.style.transform = 'none';
        app.style.width = '100vw';
        app.style.height = '100vh';
        return;
      }

      // 💻 Desktop zoom logic
      if (zoom > 1) {
        const scale = 1 / zoom;
        app.style.transform = `scale(${scale})`;
        app.style.transformOrigin = 'top left';
        app.style.width = `${zoom * 100}vw`;
        app.style.height = `${zoom * 100}vh`;

        if (zoom >= 1.25 && zoom < 1.5) {
          cardBodies.forEach(body => body.classList.add('zoom-125'));
        } else if (zoom >= 1.5) {
          cardBodies.forEach(body => body.classList.add('zoom-150'));
          if (checklist) checklist.classList.add('zoom-150');
          if (loginContainer) loginContainer.classList.add('zoom-150');
        }
      }

      // 🖥 Small screen fallback
      else if (width <= 1366 && height <= 768) {
        const scale = 0.8;
        app.style.transform = `scale(${scale})`;
        app.style.transformOrigin = 'top left';
        app.style.width = `${100 / scale}vw`;
        app.style.height = `${100 / scale}vh`;
      }

      // 🧩 Default view
      else {
        app.style.transform = 'none';
        app.style.width = '100vw';
        app.style.height = '100vh';
      }
    }

    // 🕐 Delay execution to allow child components to mount
    const timeout = setTimeout(() => normalizeZoom(), 100);

    // 👁 Observe changes in app for dynamic content
    const observer = new MutationObserver(() => {
      normalizeZoom();
    });

    observer.observe(document.getElementById('app'), {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', normalizeZoom);
    window.addEventListener('orientationchange', normalizeZoom);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener('resize', normalizeZoom);
      window.removeEventListener('orientationchange', normalizeZoom);
    };
  }, [location.pathname]);

  // 🧭 Step indicator logic
  let currentStep = 1;
  if (location.pathname.includes('directors')) currentStep = 2;
  else if (location.pathname.includes('spice-partb')) currentStep = 3;
  else if (location.pathname.includes('e-MoA_e-AoA')) currentStep = 4;
  else if (location.pathname.includes('inc-9')) currentStep = 5;
  else if (location.pathname.includes('Agile_pro')) currentStep = 6;
  else if (location.pathname.includes('coi')) currentStep = 7;
  else if (location.pathname.includes('digital-creds')) currentStep = 8;

  return (
    <div id="app" className="dashboard-layout d-flex">
      <Sidebar />
      <div className="right-side flex-grow-1 d-flex flex-column">
        <div className="progress-wrapper">
          <ProgressBar currentStep={currentStep} />
        </div>
        <div className="page-content-area flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
