/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FrameworkSettingsPanel from "../components/FrameworkSettingsPanel";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("framework");

  const tabs = [
    { id: "framework", label: "Framework", icon: "⚙️" },
    { id: "account", label: "Account", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" }
  ];

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Settings</h1>
      
      <div style={{ 
        display: "flex", 
        borderBottom: "2px solid #e2e8f0", 
        marginBottom: 24 
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 24px",
              border: "none",
              background: activeTab === tab.id ? "#3b82f6" : "transparent",
              color: activeTab === tab.id ? "white" : "#64748b",
              cursor: "pointer",
              borderRadius: "8px 8px 0 0",
              marginRight: 8
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "framework" && (
        <FrameworkSettingsPanel />
      )}

      {activeTab === "account" && (
        <div>
          <h2>Account Settings</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link 
              to="/settings/profile" 
              style={{ 
                padding: 16, 
                border: "1px solid #e2e8f0", 
                borderRadius: 8, 
                textDecoration: "none", 
                color: "#1e293b" 
              }}
            >
              👤 Profile Management
            </Link>
            <Link 
              to="/settings/branding" 
              style={{ 
                padding: 16, 
                border: "1px solid #e2e8f0", 
                borderRadius: 8, 
                textDecoration: "none", 
                color: "#1e293b" 
              }}
            >
              🎨 Branding
            </Link>
            <Link 
              to="/settings/integrations" 
              style={{ 
                padding: 16, 
                border: "1px solid #e2e8f0", 
                borderRadius: 8, 
                textDecoration: "none", 
                color: "#1e293b" 
              }}
            >
              🔗 Integrations
            </Link>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div>
          <h2>Security Settings</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ padding: 12, border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 8 }}>
              🔑 Change password
            </li>
            <li style={{ padding: 12, border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 8 }}>
              🛡️ Two-factor authentication
            </li>
            <li style={{ padding: 12, border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 8 }}>
              📱 Mobile app access
            </li>
          </ul>
        </div>
      )}

      {activeTab === "notifications" && (
        <div>
          <h2>Notification Preferences</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" defaultChecked />
              📧 Email notifications
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" defaultChecked />
              📱 Push notifications
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" />
              📄 Weekly reports
            </label>
          </div>
        </div>
      )}
    </main>
  );
}