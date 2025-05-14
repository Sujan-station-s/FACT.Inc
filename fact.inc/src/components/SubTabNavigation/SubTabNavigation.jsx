import React from 'react';
import '../../components/SubTabNavigation/SubTabNavigation.css'; // optional styling

export default function SubTabNavigation({ subTabs = [], activeSubTab, setActiveSubTab }) {
  if (!subTabs.length) return null; // Do not render if no sub-tabs provided

  return (
    <div className="sub-tabs d-flex flex-wrap justify-content-center gap-3 my-4">
      {subTabs.map(tab => (
        <div
          key={tab.id}
          className={`sub-tab ${activeSubTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveSubTab(tab.id)}
        >
          <div
            className="tab-icon"
            style={{ backgroundColor: tab.color, color: tab.iconColor }}
          >
            <i className={`bi ${tab.icon}`}></i>
          </div>
          <span>{tab.label}</span>
        </div>
      ))}
    </div>
  );
}
