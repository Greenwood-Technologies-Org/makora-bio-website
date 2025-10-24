import React, { useState } from 'react';

function ComDetailPanel({ com, onBack }) {
  const [expandedThread, setExpandedThread] = useState(null);
  const [threads, setThreads] = useState(com.threads);
  const [draftMessages, setDraftMessages] = useState({});

  const toggleThread = (threadId) => {
    setExpandedThread(expandedThread === threadId ? null : threadId);
  };

  const handleAIDraft = (todoId) => {
    // Find the todo with the AI draft
    const todo = com.todos.find(t => t.id === todoId);
    if (!todo || !todo.aiDraft) return;

    const { threadId, message } = todo.aiDraft;

    // Check if the thread exists, if not create it (for new threads)
    const existingThread = threads.find(t => t.id === threadId);
    if (!existingThread) {
      // Create a new thread based on the todo tag
      const newThread = {
        id: threadId,
        name: `Thread ${threadId}: ${todo.tag}`,
        description: `Thread for: ${todo.description}`,
        participants: ['CRA', 'Site CRC'], // Default participants for new threads
        messages: []
      };
      setThreads(prev => [...prev, newThread]);
    }

    // Set the draft message for the thread
    setDraftMessages(prev => ({
      ...prev,
      [threadId]: message
    }));

    // Expand the thread to show the draft
    setExpandedThread(threadId);
  };

  const handleDraftChange = (threadId, value) => {
    setDraftMessages(prev => ({
      ...prev,
      [threadId]: value
    }));
  };

  const handleSendDraft = (threadId) => {
    const message = draftMessages[threadId];
    if (!message || !message.trim()) return;

    const newMessage = {
      from: 'CRA',
      to: threadId === 1 ? 'Data Management' : 'Site CRC',
      content: message,
      timestamp: 'Just now'
    };

    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage]
        };
      }
      return thread;
    }));

    // Clear the draft
    setDraftMessages(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[threadId];
      return newDrafts;
    });
  };

  const handleCancelDraft = (threadId) => {
    setDraftMessages(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[threadId];
      return newDrafts;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Back Button */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Coms</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">{com.subject}</h1>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                com.urgency === 'High' ? 'bg-red-100 text-red-700' :
                com.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {com.urgency}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                com.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                com.status === 'Pending Response' ? 'bg-yellow-100 text-yellow-700' :
                com.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {com.status}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{com.summary}</p>
          </div>
          <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">{com.timestamp}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Threads - Left/Main Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Email Threads</h2>
          
          {threads.map((thread, index) => (
            <div
              key={thread.id}
              className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
            >
              {/* Thread Header */}
              <div
                onClick={() => toggleThread(thread.id)}
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{thread.name}</h3>
                    <p className="text-sm text-gray-600">{thread.description}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedThread === thread.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Participants Flow Diagram */}
                <div className="flex items-center gap-2 mt-3">
                  {thread.participants.map((participant, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                        {participant}
                      </div>
                      {idx < thread.participants.length - 1 && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Thread Messages - Expandable */}
              {expandedThread === thread.id && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Messages</h4>
                  <div className="space-y-3">
                    {thread.messages.map((message, msgIdx) => (
                      <div key={msgIdx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{message.from}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600">{message.to}</span>
                          </div>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ))}
                    
                    {/* AI Draft Message Box */}
                    {draftMessages[thread.id] && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-sm font-semibold text-purple-700">AI Generated Draft</span>
                        </div>
                        <textarea
                          value={draftMessages[thread.id]}
                          onChange={(e) => handleDraftChange(thread.id, e.target.value)}
                          className="w-full h-96 p-3 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y mb-3"
                          placeholder="Edit your message..."
                        />
                        
                        {/* AI References */}
                        {(() => {
                          const todo = com.todos.find(t => t.aiDraft && t.aiDraft.threadId === thread.id);
                          return todo && todo.aiDraft && todo.aiDraft.references && todo.aiDraft.references.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-xs font-semibold text-purple-700 mb-2">AI References Used:</h5>
                              <div className="space-y-1">
                                {todo.aiDraft.references.map((ref, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs bg-white bg-opacity-50 rounded p-2">
                                    <svg className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div className="flex-1">
                                      <span className="font-medium text-purple-900">{ref.type}:</span>
                                      <span className="text-gray-700 ml-1">{ref.title}</span>
                                      <span className="text-gray-500 ml-1">({ref.date})</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleCancelDraft(thread.id)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendDraft(thread.id)}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current TODOs - Right Panel */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current TODOs</h2>
          <div className="space-y-3">
            {com.todos.map((todo) => {
              const isEDC = todo.tag === 'EDC';
              return (
                <div
                  key={todo.id}
                  className={`p-4 rounded-lg border-2 ${
                    todo.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {todo.status === 'completed' ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className={`text-sm mb-2 ${
                            todo.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-900'
                          }`}>
                            {todo.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full font-medium ${
                              isEDC ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {todo.tag}
                            </span>
                          </div>
                        </div>
                        {todo.hasAIDraft && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAIDraft(todo.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-xs font-medium shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI Draft
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {com.todos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No TODOs</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            <button className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add TODO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComDetailPanel;
