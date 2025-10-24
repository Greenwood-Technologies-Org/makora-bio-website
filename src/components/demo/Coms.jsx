import React, { useState, useMemo } from "react";
import ComDetailPanel from "./ComDetailPanel.jsx";
import comsData from "@/data/coms.json";

function Coms() {
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedThreadKey, setSelectedThreadKey] = useState(null);
  const [detailViewProblem, setDetailViewProblem] = useState(null);
  const [threadSearchTerm, setThreadSearchTerm] = useState("");
  const [problemSearchTerm, setProblemSearchTerm] = useState("");
  const [draftMessage, setDraftMessage] = useState(null); // { threadKey, message, references, todoId }
  const [problemsData, setProblemsData] = useState(comsData); // Local state for problems
  const [activeFilters, setActiveFilters] = useState({
    urgency: "All",
    status: "All",
  });

  const filterOptions = {
    urgency: ["All", "High", "Medium", "Low"],
    status: ["All", "In Progress", "Pending Response", "Resolved", "Blocked"],
  };

  const filteredComs = problemsData.filter((com) => {
    return (
      (activeFilters.urgency === "All" ||
        com.urgency === activeFilters.urgency) &&
      (activeFilters.status === "All" || com.status === activeFilters.status)
    );
  });

  // Flatten all email threads with their problem associations
  const allThreads = useMemo(() => {
    const threads = [];
    filteredComs.forEach((com) => {
      com.threads.forEach((thread) => {
        threads.push({
          ...thread,
          problemId: com.id,
          problemSubject: com.subject,
          problemUrgency: com.urgency,
          problemStatus: com.status,
          threadKey: `${com.id}-${thread.id}`,
        });
      });
    });
    return threads;
  }, [filteredComs]);

  // Filter threads by search term
  const filteredThreads = useMemo(() => {
    let threads = allThreads;

    // Filter by selected problem if any
    if (selectedProblemId) {
      threads = threads.filter((t) => t.problemId === selectedProblemId);
    }

    // Filter by search term
    if (threadSearchTerm.trim()) {
      const searchLower = threadSearchTerm.toLowerCase();
      threads = threads.filter((thread) => {
        return (
          thread.name.toLowerCase().includes(searchLower) ||
          thread.description.toLowerCase().includes(searchLower) ||
          thread.participants.some((p) =>
            p.toLowerCase().includes(searchLower)
          ) ||
          thread.problemSubject.toLowerCase().includes(searchLower)
        );
      });
    }

    return threads;
  }, [allThreads, selectedProblemId, threadSearchTerm]);

  // Filter problems by search term
  const filteredProblems = useMemo(() => {
    if (!problemSearchTerm.trim()) {
      return filteredComs;
    }

    const searchLower = problemSearchTerm.toLowerCase();
    return filteredComs.filter((problem) => {
      return (
        problem.subject.toLowerCase().includes(searchLower) ||
        problem.summary.toLowerCase().includes(searchLower) ||
        problem.urgency.toLowerCase().includes(searchLower) ||
        problem.status.toLowerCase().includes(searchLower)
      );
    });
  }, [filteredComs, problemSearchTerm]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleProblemClick = (problemId) => {
    setSelectedProblemId(selectedProblemId === problemId ? null : problemId);
    setSelectedThreadKey(null); // Clear thread selection when problem is clicked
  };

  const handleThreadClick = (threadKey) => {
    setSelectedThreadKey(selectedThreadKey === threadKey ? null : threadKey);
    setDraftMessage(null); // Clear any draft when switching threads
  };

  const handleMoreInfoClick = (problem) => {
    setDetailViewProblem(problem);
  };

  const handleAIDraft = (todo, threadKey) => {
    if (!todo.aiDraft) return;

    setDraftMessage({
      threadKey,
      message: todo.aiDraft.message,
      references: todo.aiDraft.references || [],
      todoId: todo.id,
    });
  };

  const handleCancelDraft = () => {
    setDraftMessage(null);
  };

  const handleSendDraft = () => {
    // In a real app, this would send the email
    console.log("Sending draft:", draftMessage);
    alert("Email sent! (This is a demo)");
    setDraftMessage(null);
  };

  const handleToggleTodo = (todoId) => {
    if (!selectedThreadProblem) return;

    // Update the todo in problemsData by updating the specific problem's todos
    setProblemsData((prevProblems) =>
      prevProblems.map((com) => {
        if (com.id === selectedThreadProblem.id) {
          return {
            ...com,
            todos: com.todos.map((todo) =>
              todo.id === todoId
                ? {
                    ...todo,
                    status:
                      todo.status === "completed" ? "pending" : "completed",
                  }
                : todo
            ),
          };
        }
        return com;
      })
    );
  };

  const selectedThread = selectedThreadKey
    ? allThreads.find((t) => t.threadKey === selectedThreadKey)
    : null;

  // Get the problem associated with the selected thread
  const selectedThreadProblem = selectedThread
    ? problemsData.find((com) => com.id === selectedThread.problemId)
    : null;

  // Get TODOs related to the selected thread
  const threadTodos = useMemo(() => {
    if (!selectedThread || !selectedThreadProblem) return [];

    // Find the thread's position in the problem's threads array
    const threadIndex = selectedThreadProblem.threads.findIndex(
      (t) => t.id === selectedThread.id
    );

    // Filter TODOs that are tagged with this thread
    return selectedThreadProblem.todos.filter((todo) => {
      // Match TODOs with tags like "Thread 1", "Thread 2", etc.
      const threadTag = `Thread ${threadIndex + 1}`;
      return todo.tag === threadTag;
    });
  }, [selectedThread, selectedThreadProblem, problemsData]);

  // If detail view is open, show that instead
  if (detailViewProblem) {
    return (
      <ComDetailPanel
        com={detailViewProblem}
        onBack={() => setDetailViewProblem(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4">
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {filterType}:
              </label>
              <select
                value={activeFilters[filterType]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Inbox Layout: Email Threads (Left) + Problems (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* Email Threads - Left Panel */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">Email Threads</h2>
              <p className="text-xs text-gray-500">
                {filteredThreads.length} thread
                {filteredThreads.length !== 1 ? "s" : ""}
                {selectedProblemId && " for selected problem"}
              </p>
            </div>
            {/* Thread Search Bar */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search threads..."
                value={threadSearchTerm}
                onChange={(e) => setThreadSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {threadSearchTerm && (
                <button
                  onClick={() => setThreadSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredThreads.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">
                    {threadSearchTerm
                      ? "No threads match your search"
                      : "No email threads found"}
                  </p>
                </div>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isHighlighted = selectedProblemId === thread.problemId;
                const isSelected = selectedThreadKey === thread.threadKey;
                return (
                  <div
                    key={thread.threadKey}
                    onClick={() => handleThreadClick(thread.threadKey)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary-50 border-l-4 border-primary-500"
                        : isHighlighted
                        ? "bg-blue-50 border-l-4 border-blue-400"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {thread.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {thread.description}
                      </p>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      {thread.participants.map((participant, idx) => (
                        <React.Fragment key={idx}>
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                            {participant}
                          </span>
                          {idx < thread.participants.length - 1 && (
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Associated Problem */}
                    <div className="text-xs text-gray-500">
                      Related to:{" "}
                      <span className="font-medium text-gray-700">
                        {thread.problemSubject}
                      </span>
                    </div>

                    {/* Message count */}
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <span>
                        {thread.messages.length} message
                        {thread.messages.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Problems - Right Panel */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">Problems</h2>
              <p className="text-xs text-gray-500">
                {filteredProblems.length} problem
                {filteredProblems.length !== 1 ? "s" : ""}
              </p>
            </div>
            {/* Problem Search Bar */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search problems..."
                value={problemSearchTerm}
                onChange={(e) => setProblemSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {problemSearchTerm && (
                <button
                  onClick={() => setProblemSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProblems.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <p className="text-sm">
                    {problemSearchTerm
                      ? "No problems match your search"
                      : "No problems match the selected filters"}
                  </p>
                </div>
              </div>
            ) : (
              filteredProblems.map((com) => {
                const isSelected = selectedProblemId === com.id;
                return (
                  <div
                    key={com.id}
                    className={`p-4 transition-all ${
                      isSelected
                        ? "bg-primary-50 border-l-4 border-primary-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleProblemClick(com.id)}
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {com.subject}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              com.urgency === "High"
                                ? "bg-red-100 text-red-700"
                                : com.urgency === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {com.urgency}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              com.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : com.status === "Pending Response"
                                ? "bg-yellow-100 text-yellow-700"
                                : com.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {com.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {com.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {com.threads.length} thread
                              {com.threads.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                            <span>
                              {
                                com.todos.filter((t) => t.status === "pending")
                                  .length
                              }{" "}
                              TODO
                              {com.todos.filter((t) => t.status === "pending")
                                .length !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                          <span className="ml-auto">{com.timestamp}</span>
                        </div>
                      </div>

                      {/* More Info Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfoClick(com);
                        }}
                        className="flex-shrink-0 p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                        title="More info"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Email Thread Detail Modal - Shows messages when thread is selected */}
      {selectedThread && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedThread.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedThread.description}
                  </p>

                  {/* Participants Flow */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedThread.participants.map((participant, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                          {participant}
                        </span>
                        {idx < selectedThread.participants.length - 1 && (
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Related Problem Badge */}
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Related to: {selectedThread.problemSubject}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedThreadKey(null)}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Messages and TODOs */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 h-full">
                {/* Messages - Left/Main Section */}
                <div className="lg:col-span-2 p-6 overflow-y-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Messages
                  </h3>
                  {selectedThread.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-3 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <p className="text-base font-medium">
                          No messages in this thread yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          This thread has been created but no messages have been
                          exchanged
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedThread.messages.map((message, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-5 border-l-4 border-primary-500 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              {/* From → To */}
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-base font-semibold text-gray-900">
                                  {message.from}
                                </span>
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                                <span className="text-base font-medium text-gray-600">
                                  {message.to}
                                </span>
                              </div>

                              {/* CC */}
                              {message.cc && message.cc.length > 0 && (
                                <div className="flex items-start gap-2 mb-1">
                                  <span className="text-sm font-medium text-gray-500">
                                    CC:
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {message.cc.join(", ")}
                                  </span>
                                </div>
                              )}

                              {/* BCC */}
                              {message.bcc && message.bcc.length > 0 && (
                                <div className="flex items-start gap-2 mb-1">
                                  <span className="text-sm font-medium text-gray-500">
                                    BCC:
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {message.bcc.join(", ")}
                                  </span>
                                </div>
                              )}

                              {/* Reply To */}
                              {message.replyTo && (
                                <div className="flex items-center gap-2 mb-1">
                                  <svg
                                    className="w-4 h-4 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                    />
                                  </svg>
                                  <span className="text-sm text-blue-600">
                                    Reply to: {message.replyTo}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Draft Section */}
                  {draftMessage &&
                    draftMessage.threadKey === selectedThreadKey && (
                      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          <span className="text-base font-semibold text-purple-700">
                            AI Draft
                          </span>
                        </div>
                        <textarea
                          value={draftMessage.message}
                          onChange={(e) =>
                            setDraftMessage({
                              ...draftMessage,
                              message: e.target.value,
                            })
                          }
                          className="w-full h-64 p-3 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y mb-3 bg-white"
                          placeholder="Edit your message..."
                        />

                        {/* AI References */}
                        {draftMessage.references &&
                          draftMessage.references.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-xs font-semibold text-purple-700 mb-2">
                                AI References Used:
                              </h5>
                              <div className="space-y-1">
                                {draftMessage.references.map((ref, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-xs bg-white bg-opacity-50 rounded p-2"
                                  >
                                    <svg
                                      className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    <div className="flex-1">
                                      <span className="font-medium text-purple-900">
                                        {ref.type}:
                                      </span>
                                      <span className="text-gray-700 ml-1">
                                        {ref.title}
                                      </span>
                                      <span className="text-gray-500 ml-1">
                                        ({ref.date})
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelDraft}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSendDraft}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                </div>

                {/* TODOs - Right Section */}
                <div className="lg:col-span-1 p-6 bg-gray-50 overflow-y-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Related TODOs
                  </h3>
                  {threadTodos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-sm">No TODOs for this thread</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {threadTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className={`p-4 rounded-lg border-2 ${
                            todo.status === "completed"
                              ? "bg-green-50 border-green-200"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="flex-shrink-0 mt-0.5 cursor-pointer"
                              onClick={() => handleToggleTodo(todo.id)}
                            >
                              {todo.status === "completed" ? (
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white hover:border-primary-500 hover:bg-primary-50 transition-colors"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm mb-2 ${
                                  todo.status === "completed"
                                    ? "text-gray-600 line-through"
                                    : "text-gray-900"
                                }`}
                              >
                                {todo.description}
                              </p>
                              {todo.hasAIDraft &&
                                todo.status !== "completed" && (
                                  <button
                                    onClick={() =>
                                      handleAIDraft(todo, selectedThreadKey)
                                    }
                                    className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-xs font-medium shadow-sm hover:shadow-md"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                      />
                                    </svg>
                                    AI Draft
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-2xl">
              <button
                onClick={() => setSelectedThreadKey(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coms;
