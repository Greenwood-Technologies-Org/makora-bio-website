import React, { useState } from 'react';
import Coms from '@/components/demo/Coms.jsx';
import Docs from '@/components/demo/Docs.jsx';
import Analytics from '@/components/demo/Analytics.jsx';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('coms');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-primary-700">Communication Hub</h1>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('coms')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'coms'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Coms
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'docs'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Docs
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'coms' && <Coms />}
        {activeTab === 'docs' && <Docs />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
    </div>
  );
};

export default Demo;
