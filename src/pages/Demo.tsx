import React, { useState } from "react";
import Coms from "@/components/demo/Coms.jsx";
import Docs from "@/components/demo/Docs.jsx";
import Analytics from "@/components/demo/Analytics.jsx";
import logoImage from "@/assets/logo/clinbox_square_logo.png";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("coms");

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setActiveTab("coms")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoImage} 
                alt="Clinbox Logo" 
                className="h-8 w-8"
              />
              <h1 className="text-4xl font-semibold" style={{ color: '#2292F1' }}>
                Clinbox
              </h1>
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("docs")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "docs"
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                style={activeTab === "docs" ? { backgroundColor: '#2292F1' } : {}}
              >
                Docs
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "analytics"
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                style={activeTab === "analytics" ? { backgroundColor: '#2292F1' } : {}}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full height, no margins */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "coms" && <Coms />}
        {activeTab === "docs" && <Docs />}
        {activeTab === "analytics" && (
          <div className="h-full overflow-y-auto p-6">
            <Analytics />
          </div>
        )}
      </main>
    </div>
  );
};

export default Demo;
