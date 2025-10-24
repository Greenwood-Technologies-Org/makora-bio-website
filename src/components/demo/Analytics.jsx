import React from 'react';

function Analytics() {
  // Average Site Response Time Data (in hours)
  const siteResponseData = [
    { site: 'Site 102', avgHours: 4.2, trend: 'improving' },
    { site: 'Site 103', avgHours: 8.5, trend: 'stable' },
    { site: 'Site 104', avgHours: 18.3, trend: 'declining' },
    { site: 'Site 105', avgHours: 6.1, trend: 'improving' },
    { site: 'Site 106', avgHours: 2.8, trend: 'improving' },
    { site: 'Site 107', avgHours: 12.4, trend: 'stable' },
    { site: 'Site 108', avgHours: 15.7, trend: 'declining' },
    { site: 'Site 109', avgHours: 5.3, trend: 'stable' }
  ];

  // Site Question Types Data
  const questionTypesData = [
    { type: 'Protocol Clarification', count: 45, color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
    { type: 'Adverse Event Reporting', count: 38, color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
    { type: 'IP Management', count: 32, color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
    { type: 'Data Query Resolution', count: 28, color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
    { type: 'IRB/Regulatory', count: 24, color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    { type: 'Protocol Deviations', count: 19, color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
    { type: 'Consent Issues', count: 15, color: 'bg-pink-500', textColor: 'text-pink-700', bgLight: 'bg-pink-50' },
    { type: 'Eligibility Questions', count: 12, color: 'bg-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50' }
  ];

  // Repeat Question Data - Shows common issues that could inform protocol amendments
  const repeatQuestionsData = [
    { 
      question: 'Visit window clarification (±3 days interpretation)', 
      count: 23, 
      sites: 8,
      lastAsked: '2 days ago',
      impact: 'High',
      recommendation: 'Consider protocol amendment to clarify visit window definitions'
    },
    { 
      question: 'Concomitant medication reporting threshold', 
      count: 18, 
      sites: 6,
      lastAsked: '5 days ago',
      impact: 'High',
      recommendation: 'Add explicit examples to protocol Section 8.3'
    },
    { 
      question: 'Lab normal ranges for eligibility (ALT/AST)', 
      count: 15, 
      sites: 7,
      lastAsked: '1 day ago',
      impact: 'Medium',
      recommendation: 'Create site reference guide with clear lab value ranges'
    },
    { 
      question: 'AE vs. SAE classification for hospitalization', 
      count: 14, 
      sites: 5,
      lastAsked: '3 days ago',
      impact: 'High',
      recommendation: 'Conduct additional site training; update AE reporting guidelines'
    },
    { 
      question: 'Source documentation requirements for phone visits', 
      count: 12, 
      sites: 6,
      lastAsked: '1 week ago',
      impact: 'Medium',
      recommendation: 'Develop phone visit source documentation template'
    },
    { 
      question: 'Rescue medication dosing limits', 
      count: 11, 
      sites: 4,
      lastAsked: '4 days ago',
      impact: 'Medium',
      recommendation: 'Add rescue medication algorithm to protocol appendix'
    },
    { 
      question: 'Pregnancy test timing relative to IP dispensing', 
      count: 9, 
      sites: 5,
      lastAsked: '6 days ago',
      impact: 'Low',
      recommendation: 'Clarify timing in protocol Section 5.4'
    },
    { 
      question: 'Re-consent requirements for protocol amendments', 
      count: 8, 
      sites: 7,
      lastAsked: '1 week ago',
      impact: 'Medium',
      recommendation: 'Create decision tree for re-consent requirements'
    }
  ];

  const totalQuestions = questionTypesData.reduce((sum, item) => sum + item.count, 0);
  const maxResponseTime = Math.max(...siteResponseData.map(d => d.avgHours));
  const avgResponseTime = (siteResponseData.reduce((sum, d) => sum + d.avgHours, 0) / siteResponseData.length).toFixed(1);

  const getResponseTimeColor = (hours) => {
    if (hours <= 6) return 'from-green-500 to-green-600';
    if (hours <= 12) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    if (trend === 'declining') {
      return (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  const getImpactBadge = (impact) => {
    const colors = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-green-100 text-green-700'
    };
    return colors[impact] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CRA Analytics Dashboard</h2>
        <p className="text-gray-600">Insights to optimize site communication and protocol management</p>
      </div>

      {/* Chart 1: Average Site Response Time */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Average Site Response Time
          </h3>
          <p className="text-sm text-gray-600">Track how quickly each site responds to communications</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {siteResponseData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 min-w-[4rem]">{item.site}</span>
                  {getTrendIcon(item.trend)}
                </div>
                <span className={`font-bold ${
                  item.avgHours <= 6 ? 'text-green-600' :
                  item.avgHours <= 12 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {item.avgHours} hrs
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${getResponseTimeColor(item.avgHours)} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${(item.avgHours / maxResponseTime) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{avgResponseTime} hrs</div>
            <div className="text-xs text-gray-600 mt-1">Overall Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.min(...siteResponseData.map(d => d.avgHours))} hrs</div>
            <div className="text-xs text-gray-600 mt-1">Fastest Site</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{Math.max(...siteResponseData.map(d => d.avgHours))} hrs</div>
            <div className="text-xs text-gray-600 mt-1">Slowest Site</div>
          </div>
        </div>
      </div>

      {/* Chart 2: Site Question Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Site Question Types
          </h3>
          <p className="text-sm text-gray-600">Distribution of communication topics across all sites</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionTypesData.map((item, index) => {
            const percentage = ((item.count / totalQuestions) * 100).toFixed(1);
            return (
              <div key={index} className={`${item.bgLight} rounded-lg p-4 border-2 border-gray-200 hover:border-gray-300 transition-colors`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-semibold text-gray-900">{item.type}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.textColor} bg-white`}>
                    {percentage}%
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-600">questions</div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <div className="text-3xl font-bold text-gray-900">{totalQuestions}</div>
          <div className="text-sm text-gray-600 mt-1">Total Questions This Quarter</div>
        </div>
      </div>

      {/* Chart 3: Repeat Questions - Protocol Amendment Opportunities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Repeat Question Analysis
          </h3>
          <p className="text-sm text-gray-600">Frequently asked questions that may require protocol amendments or additional guidance</p>
        </div>

        <div className="space-y-3">
          {repeatQuestionsData.map((item, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{item.question}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getImpactBadge(item.impact)}`}>
                      {item.impact} Impact
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span className="font-semibold">{item.count} times</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{item.sites} sites</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Last asked {item.lastAsked}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-xs text-blue-900 font-medium">
                        <span className="font-bold">Recommendation:</span> {item.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-yellow-900 mb-1">Action Recommended</h4>
              <p className="text-xs text-yellow-800">
                {repeatQuestionsData.filter(q => q.impact === 'High').length} high-impact repeat questions identified. 
                Consider scheduling a protocol amendment planning meeting to address these common issues and improve site efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
