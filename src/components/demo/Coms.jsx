import React, { useState, useMemo } from "react";
import ComDetailPanel from "./ComDetailPanel.jsx";
import comsData from "@/data/coms.json";
import {
  Star,
  FileEdit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Link2,
  X,
  Check,
  Mail,
  CheckSquare,
  Info,
  Send,
  Reply,
  Forward,
  Lightbulb,
  MessageSquare,
  Loader2,
  Sparkles,
  Plus,
  ListTodo,
  SquareArrowOutUpRight,
} from "lucide-react";

function Coms() {
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedThreadKey, setSelectedThreadKey] = useState(null);
  const [filteredThreadKey, setFilteredThreadKey] = useState(null); // For filtering by specific email
  const [detailViewProblem, setDetailViewProblem] = useState(null);
  const [threadSearchTerm, setThreadSearchTerm] = useState("");
  const [problemSearchTerm, setProblemSearchTerm] = useState("");
  const [draftMessage, setDraftMessage] = useState(null); // { threadKey, message, references, todoId }
  const [problemsData, setProblemsData] = useState(comsData.problems); // Local state for problems
  const [threadsData, setThreadsData] = useState(comsData.threads); // Local state for threads
  const [expandedMessages, setExpandedMessages] = useState(new Set()); // Track which messages are expanded
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false); // Track if assignment dropdown is open in thread detail
  const [activeThreadDropdown, setActiveThreadDropdown] = useState(null); // Track which thread's dropdown is open in inbox
  const [activeFilters, setActiveFilters] = useState({
    urgency: "All",
    status: "All",
  });

  // Infinite scroll state
  const [threadsPage, setThreadsPage] = useState(1);
  const [problemsPage, setProblemsPage] = useState(1);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // AI assist state
  const [aiAssistLoading, setAiAssistLoading] = useState(null); // threadId that's being processed
  const [aiRecommendation, setAiRecommendation] = useState(null); // { threadId, recommendedProblem, confidence }
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  const filterOptions = {
    urgency: ["All", "High", "Medium", "Low"],
    status: ["All", "In Progress", "Pending Response", "Resolved", "Blocked"],
  };

  // Helper functions to get colors for urgency and status
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-white text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Pending Response":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-300";
      case "Blocked":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-white text-gray-700 border-gray-300";
    }
  };

  const filteredComs = problemsData.filter((com) => {
    return (
      (activeFilters.urgency === "All" ||
        com.urgency === activeFilters.urgency) &&
      (activeFilters.status === "All" || com.status === activeFilters.status)
    );
  });

  // Get all threads with their problem associations
  const allThreads = useMemo(() => {
    return threadsData.map((thread) => {
      const problem = problemsData.find((p) => p.id === thread.problemId);
      return {
        ...thread,
        problemSubject: problem ? problem.subject : "Unassigned",
        problemUrgency: problem ? problem.urgency : null,
        problemStatus: problem ? problem.status : null,
        threadKey: thread.id.toString(),
      };
    });
  }, [threadsData, problemsData]);

  // Filter threads by search term
  const filteredThreads = useMemo(() => {
    let threads = allThreads;

    // Filter by specific thread if any
    if (filteredThreadKey) {
      threads = threads.filter((t) => t.threadKey === filteredThreadKey);
    }
    // Otherwise filter by selected problem if any
    else if (selectedProblemId) {
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
  }, [allThreads, selectedProblemId, filteredThreadKey, threadSearchTerm]);

  // Paginated threads for infinite scroll
  const paginatedThreads = useMemo(() => {
    return filteredThreads.slice(0, threadsPage * ITEMS_PER_PAGE);
  }, [filteredThreads, threadsPage, ITEMS_PER_PAGE]);

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

  // Paginated problems for infinite scroll
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(0, problemsPage * ITEMS_PER_PAGE);
  }, [filteredProblems, problemsPage, ITEMS_PER_PAGE]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleProblemClick = (problemId) => {
    // If clicking the same problem, turn off filtering to show everything
    if (selectedProblemId === problemId) {
      setSelectedProblemId(null);
    } else {
      setSelectedProblemId(problemId);
    }
    setFilteredThreadKey(null); // Clear thread-specific filter when problem is clicked
    setSelectedThreadKey(null); // Clear thread selection when problem is clicked
  };

  const handleThreadClick = (threadKey) => {
    // Find the thread and its associated problem
    const thread = allThreads.find((t) => t.threadKey === threadKey);
    
    if (thread && thread.problemId) {
      // Thread has a task assigned - filter by that task
      // If already filtered on this task, turn off filtering to show everything
      if (selectedProblemId === thread.problemId) {
        setSelectedProblemId(null);
      } else {
        // Filter to show only this task/problem
        setSelectedProblemId(thread.problemId);
      }
      setFilteredThreadKey(null); // Clear thread-specific filter
      setSelectedThreadKey(null); // Clear thread selection
    } else if (thread) {
      // Thread has no task assigned - filter by just this email
      // If already filtered on this email, turn off filtering
      if (filteredThreadKey === threadKey) {
        setFilteredThreadKey(null);
      } else {
        setFilteredThreadKey(threadKey);
      }
      setSelectedProblemId(null); // Clear problem filter
      setSelectedThreadKey(null); // Clear thread selection
    }
    
    // Mark thread as read when clicked
    markThreadAsRead(parseInt(threadKey));
  };

  const handleThreadOpenEmail = (e, threadKey) => {
    e.stopPropagation();
    setSelectedThreadKey(selectedThreadKey === threadKey ? null : threadKey);
    setDraftMessage(null); // Clear any draft when switching threads

    // Mark thread as read when opened
    markThreadAsRead(parseInt(threadKey));

    // Initialize expanded messages: expand only the last message by default (Gmail-like)
    const thread = allThreads.find((t) => t.threadKey === threadKey);
    if (thread && thread.messages.length > 0) {
      const lastMessageIndex = thread.messages.length - 1;
      setExpandedMessages(new Set([lastMessageIndex]));
    }
  };

  const markThreadAsRead = (threadId) => {
    setThreadsData((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId ? { ...thread, isRead: true } : thread
      )
    );
  };

  // Infinite scroll handlers
  const handleThreadsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 100 && // 100px threshold
      !isLoadingThreads &&
      paginatedThreads.length < filteredThreads.length
    ) {
      setIsLoadingThreads(true);
      // Simulate loading delay
      setTimeout(() => {
        setThreadsPage((prev) => prev + 1);
        setIsLoadingThreads(false);
      }, 500);
    }
  };

  const handleProblemsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 100 && // 100px threshold
      !isLoadingProblems &&
      paginatedProblems.length < filteredProblems.length
    ) {
      setIsLoadingProblems(true);
      // Simulate loading delay
      setTimeout(() => {
        setProblemsPage((prev) => prev + 1);
        setIsLoadingProblems(false);
      }, 500);
    }
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setThreadsPage(1);
    setProblemsPage(1);
  }, [threadSearchTerm, problemSearchTerm, selectedProblemId, filteredThreadKey, activeFilters]);

  // AI Assignment Algorithm (extensible for LLM integration)
  const assignmentEngine = {
    // Basic algorithm - can be replaced with LLM API call
    async analyzeThread(thread, availableProblems) {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const threadText = `${thread.name} ${thread.description} ${
        thread.messages?.map((m) => m.content).join(" ") || ""
      }`.toLowerCase();

      let bestMatch = null;
      let highestScore = 0;
      const MINIMUM_MATCH_THRESHOLD = 0.2; // Minimum score to consider a match

      for (const problem of availableProblems) {
        const problemText =
          `${problem.subject} ${problem.summary}`.toLowerCase();

        // Simple keyword matching algorithm
        const score = this.calculateSimilarityScore(threadText, problemText);

        if (score > highestScore) {
          highestScore = score;
          bestMatch = problem;
        }
      }

      // If no good match found, suggest creating a new task
      if (highestScore < MINIMUM_MATCH_THRESHOLD) {
        const newTask = this.generateNewTask(thread);
        return {
          recommendedProblem: null,
          newTask: newTask,
          confidence: Math.min(highestScore * 100, 95),
          reasoning:
            "No suitable existing task found. Recommending creation of new task.",
        };
      }

      return {
        recommendedProblem: bestMatch,
        newTask: null,
        confidence: Math.min(highestScore * 100, 95), // Cap at 95% for basic algorithm
        reasoning: this.generateReasoning(thread, bestMatch, highestScore),
      };
    },

    generateNewTask(thread) {
      // Extract key information from thread to create a new task
      const threadText = `${thread.name} ${thread.description} ${
        thread.messages?.map((m) => m.content).join(" ") || ""
      }`.toLowerCase();

      // Determine priority based on keywords
      let priority = "Medium"; // default
      if (
        threadText.includes("urgent") ||
        threadText.includes("emergency") ||
        threadText.includes("critical") ||
        threadText.includes("asap") ||
        threadText.includes("immediate")
      ) {
        priority = "High";
      } else if (
        threadText.includes("low priority") ||
        threadText.includes("when possible") ||
        threadText.includes("non-urgent")
      ) {
        priority = "Low";
      }

      // Generate a subject based on thread content
      let subject = thread.name;

      // Try to make it more descriptive
      if (thread.messages && thread.messages.length > 0) {
        const firstMessage = thread.messages[0].content;
        // Extract first sentence or key phrase
        const sentences = firstMessage.split(/[.!?]/);
        if (sentences.length > 0 && sentences[0].trim().length > 10) {
          subject =
            sentences[0].trim().substring(0, 80) +
            (sentences[0].length > 80 ? "..." : "");
        }
      }

      // Generate summary from thread content
      let summary = thread.description;
      if (thread.messages && thread.messages.length > 0) {
        const allContent = thread.messages.map((m) => m.content).join(" ");
        summary =
          allContent.substring(0, 200) + (allContent.length > 200 ? "..." : "");
      }

      return {
        subject: subject,
        summary: summary,
        urgency: priority,
        status: "In Progress",
        timestamp: "Just now",
        todos: [], // Start with empty todos
      };
    },

    calculateSimilarityScore(text1, text2) {
      // Basic keyword overlap scoring
      const words1 = text1.split(/\s+/).filter((word) => word.length > 3);
      const words2 = text2.split(/\s+/).filter((word) => word.length > 3);

      let matches = 0;
      for (const word1 of words1) {
        for (const word2 of words2) {
          if (word1.includes(word2) || word2.includes(word1)) {
            matches++;
            break;
          }
        }
      }

      return matches / Math.max(words1.length, words2.length);
    },

    generateReasoning(thread, problem, score) {
      if (!problem) return "No suitable match found based on content analysis.";

      const reasons = [];
      if (score > 0.3) reasons.push("Strong keyword overlap detected");
      if (thread.participants?.some((p) => p.includes("Medical")))
        reasons.push("Medical participant involvement");
      if (thread.participants?.some((p) => p.includes("Site")))
        reasons.push("Site communication pattern");

      return reasons.length > 0
        ? `Recommended based on: ${reasons.join(", ")}`
        : "Recommended based on content similarity analysis";
    },
  };

  const toggleMessageExpansion = (messageIndex) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageIndex)) {
        newSet.delete(messageIndex);
      } else {
        newSet.add(messageIndex);
      }
      return newSet;
    });
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

  const handleReassignThread = (newProblemId, threadKey = null) => {
    // Use provided threadKey or fall back to selectedThread
    const threadToReassign = threadKey
      ? allThreads.find((t) => t.threadKey === threadKey)
      : selectedThread;

    if (!threadToReassign) return;

    // Update the thread's problemId
    setThreadsData((prevThreads) => {
      return prevThreads.map((thread) => {
        if (thread.id.toString() === threadToReassign.threadKey) {
          return {
            ...thread,
            problemId: newProblemId, // null for unassigned, or the new problem ID
          };
        }
        return thread;
      });
    });

    // Close the appropriate dropdown
    setShowAssignmentDropdown(false);
    setActiveThreadDropdown(null);

    // If unassigning and currently viewing this thread, go back to inbox
    if (!newProblemId && selectedThreadKey === threadToReassign.threadKey) {
      setSelectedThreadKey(null);
    }
  };

  // AI Assist handlers
  const handleAiAssist = async (thread) => {
    if (thread.problemId) {
      // Thread is already assigned
      return;
    }

    setAiAssistLoading(thread.id);

    try {
      // Get unassigned problems (or all problems for better matching)
      const availableProblems = problemsData.filter(
        (p) => p.status !== "Resolved" // Don't assign to resolved problems
      );

      const result = await assignmentEngine.analyzeThread(
        thread,
        availableProblems
      );

      if (result.recommendedProblem) {
        setAiRecommendation({
          threadId: thread.id,
          thread: thread,
          recommendedProblem: result.recommendedProblem,
          newTask: null,
          confidence: result.confidence,
          reasoning: result.reasoning,
        });
        setShowRecommendationModal(true);
      } else if (result.newTask) {
        setAiRecommendation({
          threadId: thread.id,
          thread: thread,
          recommendedProblem: null,
          newTask: result.newTask,
          confidence: result.confidence,
          reasoning: result.reasoning,
        });
        setShowRecommendationModal(true);
      } else {
        // No recommendation found
        alert("Unable to analyze thread. Please try again.");
      }
    } catch (error) {
      console.error("AI assist error:", error);
      alert("Failed to analyze thread. Please try again.");
    } finally {
      setAiAssistLoading(null);
    }
  };

  const handleAcceptRecommendation = () => {
    if (aiRecommendation) {
      if (aiRecommendation.recommendedProblem) {
        // Assign to existing problem
        handleReassignThread(
          aiRecommendation.recommendedProblem.id,
          aiRecommendation.threadId.toString()
        );
      } else if (aiRecommendation.newTask) {
        // Create new task and assign thread to it
        const newTaskId = Math.max(...problemsData.map((p) => p.id)) + 1;
        const newTask = {
          ...aiRecommendation.newTask,
          id: newTaskId,
        };

        // Add the new task to problems data
        setProblemsData((prevProblems) => [...prevProblems, newTask]);

        // Assign the thread to the new task
        handleReassignThread(newTaskId, aiRecommendation.threadId.toString());
      }

      setShowRecommendationModal(false);
      setAiRecommendation(null);
    }
  };

  const handleRejectRecommendation = () => {
    setShowRecommendationModal(false);
    setAiRecommendation(null);
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

    // Get all threads assigned to this problem (in order by ID)
    const problemThreads = threadsData
      .filter((t) => t.problemId === selectedThreadProblem.id)
      .sort((a, b) => a.id - b.id);

    // Find the thread's position in the sorted problem threads
    const threadIndex = problemThreads.findIndex(
      (t) => t.id === selectedThread.id
    );

    // Filter TODOs that are tagged with this thread
    return selectedThreadProblem.todos.filter((todo) => {
      // Match TODOs with tags like "Thread 1", "Thread 2", etc.
      const threadTag = `Thread ${threadIndex + 1}`;
      return todo.tag === threadTag;
    });
  }, [selectedThread, selectedThreadProblem, problemsData, threadsData]);

  // If detail view is open, show that instead
  if (detailViewProblem) {
    // Reconstruct the problem with its threads
    const problemWithThreads = {
      ...detailViewProblem,
      threads: threadsData.filter((t) => t.problemId === detailViewProblem.id),
    };

    return (
      <ComDetailPanel
        com={problemWithThreads}
        onBack={() => setDetailViewProblem(null)}
      />
    );
  }

  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* Show Thread View or Inbox View */}
      {selectedThread ? (
        // Gmail-like Thread View
        <div className="flex flex-col h-full">
          {/* Compact Thread Header with Back Button and Title Only */}
          <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <button
                onClick={() => setSelectedThreadKey(null)}
                className="flex-shrink-0 p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                title="Back to inbox"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-900">
                {selectedThread.name}
              </h2>
            </div>
          </div>

          {/* Thread Body - Messages and TODOs (with description at top) */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 h-full">
              {/* Messages - Left/Main Section */}
              <div className="lg:col-span-2 overflow-y-auto">
                {/* Thread Description/Info Section - At top of messages column */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedThread.description}
                  </p>

                  {/* Participants */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {selectedThread.participants.map((participant, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                          {participant}
                        </span>
                        {idx < selectedThread.participants.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Assignment Badge */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowAssignmentDropdown(!showAssignmentDropdown)
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Assigned to: {selectedThread.problemSubject}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${
                          showAssignmentDropdown ? "rotate-180" : ""
                        }`} />
                    </button>

                    {/* Assignment Dropdown */}
                    {showAssignmentDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowAssignmentDropdown(false)}
                        />

                        <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
                          <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                              Reassign Thread To:
                            </div>

                            <button
                              onClick={() => handleReassignThread(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium">
                                Unassign from Task
                              </span>
                            </button>

                            <div className="border-t border-gray-100 my-2" />

                            {filteredComs.map((problem) => {
                              const isCurrent =
                                problem.id === selectedThread.problemId;
                              return (
                                <button
                                  key={problem.id}
                                  onClick={() =>
                                    handleReassignThread(problem.id)
                                  }
                                  disabled={isCurrent}
                                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                    isCurrent
                                      ? "bg-primary-50 text-primary-700 cursor-default"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium truncate">
                                          {problem.subject}
                                        </span>
                                        {isCurrent && (
                                          <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                                            problem.urgency === "High"
                                              ? "bg-red-100 text-red-700"
                                              : problem.urgency === "Medium"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-green-100 text-green-700"
                                          }`}
                                        >
                                          {problem.urgency}
                                        </span>
                                        <span
                                          className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                                            problem.status === "In Progress"
                                              ? "bg-blue-100 text-blue-700"
                                              : problem.status ===
                                                "Pending Response"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : problem.status === "Resolved"
                                              ? "bg-green-100 text-green-700"
                                              : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          {problem.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Messages Section */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Messages
                  </h3>
                  {selectedThread.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 mx-auto mb-3 text-gray-300" />
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
                    <div className="space-y-2">
                      {selectedThread.messages.map((message, idx) => {
                        const isExpanded = expandedMessages.has(idx);
                        const isLastMessage =
                          idx === selectedThread.messages.length - 1;

                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              !isExpanded && toggleMessageExpansion(idx)
                            }
                            className={`rounded-lg border transition-all ${
                              isExpanded
                                ? "bg-gray-50 border-l-4 border-primary-500 shadow-sm hover:shadow-md"
                                : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                            }`}
                          >
                            {isExpanded ? (
                              // Expanded View
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    {/* From → To */}
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                                        {message.from.charAt(0)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-base font-semibold text-gray-900">
                                            {message.from}
                                          </span>
                                          <ChevronRight className="w-4 h-4 text-gray-400" />
                                          <span className="text-sm font-medium text-gray-600">
                                            {message.to}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* CC */}
                                    {message.cc && message.cc.length > 0 && (
                                      <div className="flex items-start gap-2 mb-1 ml-10">
                                        <span className="text-xs font-medium text-gray-500">
                                          CC:
                                        </span>
                                        <span className="text-xs text-gray-600">
                                          {message.cc.join(", ")}
                                        </span>
                                      </div>
                                    )}

                                    {/* BCC */}
                                    {message.bcc && message.bcc.length > 0 && (
                                      <div className="flex items-start gap-2 mb-1 ml-10">
                                        <span className="text-xs font-medium text-gray-500">
                                          BCC:
                                        </span>
                                        <span className="text-xs text-gray-600">
                                          {message.bcc.join(", ")}
                                        </span>
                                      </div>
                                    )}

                                    {/* Reply To */}
                                    {message.replyTo && (
                                      <div className="flex items-center gap-2 mb-1 ml-10">
                                        <Reply className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-xs text-blue-600">
                                          Reply to: {message.replyTo}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">
                                      {message.timestamp}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMessageExpansion(idx);
                                      }}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                      title="Collapse message"
                                    >
                                      <ChevronUp className="w-5 h-5 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                                <div className="ml-10">
                                  <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                  </p>

                                  {/* Action Buttons - Reply & Forward */}
                                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Implement reply functionality
                                        alert(
                                          "Reply functionality coming soon!"
                                        );
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                      <Reply className="w-4 h-4" />
                                      Reply
                                    </button>

                                    {/* Reply All - show if there are multiple recipients */}
                                    {((message.cc && message.cc.length > 0) ||
                                      (message.bcc &&
                                        message.bcc.length > 0)) && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // TODO: Implement reply all functionality
                                          alert(
                                            "Reply All functionality coming soon!"
                                          );
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                      >
                                        <Reply className="w-4 h-4" />
                                        Reply All
                                      </button>
                                    )}

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Implement forward functionality
                                        alert(
                                          "Forward functionality coming soon!"
                                        );
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                      <Forward className="w-4 h-4" />
                                      Forward
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Collapsed View
                              <div className="p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                  {message.from.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {message.from}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {message.timestamp}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">
                                    {message.content.substring(0, 100)}
                                    {message.content.length > 100 && "..."}
                                  </p>
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/*  Section */}
                  {draftMessage &&
                    draftMessage.threadKey === selectedThreadKey && (
                      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-purple-600" />
                          <span className="text-base font-semibold text-purple-700"></span>
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
                            <Send className="w-4 h-4" />
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* TODOs - Right Section */}
              <div className="lg:col-span-1 bg-gray-50 overflow-y-auto">
                {/* Spacer to match description section height on left */}
                <div className="p-4 bg-gray-100 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900">
                    Related TODOs
                  </h3>
                </div>

                <div className="p-6 pt-4">
                  {threadTodos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
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
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
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
                                    <Lightbulb className="w-4 h-4" />
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
          </div>
        </div>
      ) : (
        // Inbox View
        <>
          {/* Inbox Layout: Email Threads (Left) + Tasks (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 flex-1 overflow-hidden">
            {/* Email Threads - Left Panel */}
            <div className="flex flex-col overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Email
                    </h2>
                    {(() => {
                      const unreadCount = filteredThreads.filter(
                        (t) => !t.isRead
                      ).length;
                      return unreadCount > 0 ? (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
                
                {/* Email Function Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    Starred
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <FileEdit className="w-4 h-4" />
                    Drafts
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4" />
                    Trash
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                  <span className="ml-auto text-xs text-gray-500">
                    {filteredThreads.length} thread
                    {filteredThreads.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div
                className="divide-y divide-gray-200 flex-1 overflow-y-auto"
                onScroll={handleThreadsScroll}
              >
                {filteredThreads.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Mail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">
                        {threadSearchTerm
                          ? "No threads match your search"
                          : "No email threads found"}
                      </p>
                    </div>
                  </div>
                ) : (
                  paginatedThreads.map((thread) => {
                    const isHighlighted =
                      (selectedProblemId !== null && selectedProblemId === thread.problemId) ||
                      (filteredThreadKey !== null && filteredThreadKey === thread.threadKey);
                    const isSelected = selectedThreadKey === thread.threadKey;
                    const lastMessage =
                      thread.messages[thread.messages.length - 1];

                    return (
                      <div
                        key={thread.threadKey}
                        onClick={() => handleThreadClick(thread.threadKey)}
                        className={`p-3 cursor-pointer transition-all border-l-4 ${
                          isSelected
                            ? "bg-primary-50 border-primary-500"
                            : isHighlighted
                            ? "bg-blue-50 border-blue-400"
                            : !thread.isRead
                            ? "bg-blue-25 border-transparent hover:bg-blue-50"
                            : "border-transparent hover:bg-gray-50"
                        } ${!thread.isRead ? "font-semibold" : ""}`}
                      >
                        {/* Header: Sender */}
                        <div className="flex items-baseline justify-between mb-1.5 gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Unread indicator dot */}
                            {!thread.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                            {/* Sender Avatar */}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                                isSelected
                                  ? "bg-primary-600"
                                  : isHighlighted
                                  ? "bg-blue-500"
                                  : !thread.isRead
                                  ? "bg-blue-600"
                                  : "bg-gray-500"
                              }`}
                            >
                              {lastMessage?.from?.charAt(0) || "?"}
                            </div>
                            {/* Sender Name */}
                            <span
                              className={`text-sm truncate ${
                                !thread.isRead
                                  ? "font-bold text-gray-900"
                                  : isSelected || isHighlighted
                                  ? "font-semibold text-gray-900"
                                  : "font-semibold text-gray-800"
                              }`}
                            >
                              {lastMessage?.from || "Unknown"}
                            </span>
                          </div>
                          {/* Open Email Icon */}
                          <button
                            onClick={(e) => handleThreadOpenEmail(e, thread.threadKey)}
                            className="text-gray-900 hover:text-gray-700 transition-colors flex-shrink-0"
                            title="Open email"
                          >
                            <SquareArrowOutUpRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subject */}
                        <h3
                          className={`text-sm mb-1 truncate ${
                            !thread.isRead
                              ? "font-bold text-gray-900"
                              : isSelected || isHighlighted
                              ? "font-medium text-gray-900"
                              : "font-medium text-gray-800"
                          }`}
                        >
                          {thread.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-600 mb-2 truncate">
                          {thread.description}
                        </p>

                        {/* Associated Task with Assignment Dropdown and Timestamp */}
                        <div className="relative">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              {/* AI Assist Sparkles Icon */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!thread.problemId) {
                                    handleAiAssist(thread);
                                  }
                                }}
                                disabled={!!thread.problemId || aiAssistLoading === thread.id}
                                className={`flex-shrink-0 transition-colors ${
                                  thread.problemId 
                                    ? 'cursor-not-allowed' 
                                    : 'cursor-pointer hover:opacity-80'
                                }`}
                                title={
                                  aiAssistLoading === thread.id
                                    ? "Analyzing..."
                                    : thread.problemId
                                    ? "Task already assigned"
                                    : "AI Task Recommendation"
                                }
                              >
                                {aiAssistLoading === thread.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#4190C5' }} />
                                ) : (
                                  <Sparkles 
                                    className="w-4 h-4" 
                                    style={{ color: thread.problemId ? '#9CA3AF' : '#4190C5' }}
                                  />
                                )}
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveThreadDropdown(
                                    activeThreadDropdown === thread.threadKey
                                      ? null
                                      : thread.threadKey
                                  );
                                }}
                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors min-w-0"
                              >
                                <ListTodo className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-700 truncate max-w-[450px]">
                                  {thread.problemSubject}
                                </span>
                                <ChevronDown className={`w-3 h-3 text-gray-500 flex-shrink-0 transition-transform ${
                                    activeThreadDropdown === thread.threadKey
                                      ? "rotate-180"
                                      : ""
                                  }`} />
                              </button>
                            </div>
                            
                            {/* Timestamp */}
                            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                              {lastMessage?.timestamp || "N/A"}
                            </span>
                          </div>

                          {/* Assignment Dropdown */}
                          {activeThreadDropdown === thread.threadKey && (
                            <>
                              {/* Backdrop to close dropdown */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveThreadDropdown(null);
                                }}
                              />

                              {/* Dropdown Menu */}
                              <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
                                <div className="p-2">
                                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                    Reassign Thread To:
                                  </div>

                                  {/* Unassign Option */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReassignThread(
                                        null,
                                        thread.threadKey
                                      );
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                    <span className="text-red-600 font-medium">
                                      Unassign from Task
                                    </span>
                                  </button>

                                  <div className="border-t border-gray-100 my-2" />

                                  {/* List of Tasks */}
                                  {filteredComs.map((problem) => {
                                    const isCurrent =
                                      problem.id === thread.problemId;
                                    return (
                                      <button
                                        key={problem.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReassignThread(
                                            problem.id,
                                            thread.threadKey
                                          );
                                        }}
                                        disabled={isCurrent}
                                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                          isCurrent
                                            ? "bg-primary-50 text-primary-700 cursor-default"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-medium truncate">
                                                {problem.subject}
                                              </span>
                                              {isCurrent && (
                                                <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span
                                                className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                                                  problem.urgency === "High"
                                                    ? "bg-red-100 text-red-700"
                                                    : problem.urgency ===
                                                      "Medium"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                              >
                                                {problem.urgency}
                                              </span>
                                              <span
                                                className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                                                  problem.status ===
                                                  "In Progress"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : problem.status ===
                                                      "Pending Response"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : problem.status ===
                                                      "Resolved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                              >
                                                {problem.status}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Loading indicator for threads */}
                {isLoadingThreads && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                      <span className="text-sm">Loading more threads...</span>
                    </div>
                  </div>
                )}

                {/* End of threads indicator */}
                {paginatedThreads.length >= filteredThreads.length &&
                  filteredThreads.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-center py-4 text-gray-400">
                      <span className="text-sm">All threads loaded</span>
                    </div>
                  )}
              </div>
            </div>

            {/* Tasks - Right Panel */}
            <div className="flex flex-col overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ListTodo className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                  </div>
                </div>
                
                {/* Task Function Buttons */}
                <div className="flex items-center gap-2">
                  <select
                    value={activeFilters.urgency}
                    onChange={(e) => handleFilterChange('urgency', e.target.value)}
                    className={`px-3 py-1.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${getUrgencyColor(activeFilters.urgency)}`}
                  >
                    {filterOptions.urgency.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    value={activeFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className={`px-3 py-1.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(activeFilters.status)}`}
                  >
                    {filterOptions.status.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                  <span className="ml-auto text-xs text-gray-500">
                    {filteredProblems.length} task
                    {filteredProblems.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div
                className="divide-y divide-gray-200 flex-1 overflow-y-auto"
                onScroll={handleProblemsScroll}
              >
                {filteredProblems.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <CheckSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">
                        {problemSearchTerm
                          ? "No tasks match your search"
                          : "No tasks match the selected filters"}
                      </p>
                    </div>
                  </div>
                ) : (
                  paginatedProblems.map((com) => {
                    const isSelected = selectedProblemId !== null && selectedProblemId === com.id;
                    const threadCount = threadsData.filter(
                      (t) => t.problemId === com.id
                    ).length;
                    return (
                      <div
                        key={com.id}
                        className={`p-4 transition-all ${
                          isSelected
                            ? "bg-primary-50 border-l-4 border-primary-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => handleProblemClick(com.id)}
                          >
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                              {com.subject}
                            </h3>
                          </div>

                          {/* Open Task Detail Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoreInfoClick(com);
                            }}
                            className="text-gray-900 hover:text-gray-700 transition-colors flex-shrink-0"
                            title="Open task details"
                          >
                            <SquareArrowOutUpRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => handleProblemClick(com.id)}
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                              <Mail className="w-3.5 h-3.5" />
                              <span>
                                {threadCount} thread
                                {threadCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>
                                {
                                  com.todos.filter(
                                    (t) => t.status === "pending"
                                  ).length
                                }{" "}
                                TODO
                                {com.todos.filter(
                                  (t) => t.status === "pending"
                                ).length !== 1
                                  ? "s"
                                  : ""}
                              </span>
                            </div>
                            <span className="ml-auto">{com.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Loading indicator for tasks */}
                {isLoadingProblems && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                      <span className="text-sm">Loading more tasks...</span>
                    </div>
                  </div>
                )}

                {/* End of tasks indicator */}
                {paginatedProblems.length >= filteredProblems.length &&
                  filteredProblems.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-center py-4 text-gray-400">
                      <span className="text-sm">All tasks loaded</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI Recommendation Modal */}
      {showRecommendationModal && aiRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {aiRecommendation.recommendedProblem
                ? "AI Assignment Recommendation"
                : "AI New Task Recommendation"}
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Thread Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Email Thread Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Subject:
                    </span>
                    <span className="text-sm text-gray-900">
                      {aiRecommendation.thread.name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Description:
                    </span>
                    <p className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                      {aiRecommendation.thread.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Participants:
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {aiRecommendation.thread.participants.map(
                        (participant, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {participant}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {aiRecommendation.thread.messages &&
                    aiRecommendation.thread.messages.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Latest Message:
                        </span>
                        <div className="bg-white p-3 rounded border border-gray-300">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {
                              aiRecommendation.thread.messages[
                                aiRecommendation.thread.messages.length - 1
                              ].content
                            }
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Existing Task Assignment */}
              {aiRecommendation.recommendedProblem && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Recommended Assignment
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-blue-900">
                      {aiRecommendation.recommendedProblem.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        aiRecommendation.recommendedProblem.urgency === "High"
                          ? "bg-red-100 text-red-700"
                          : aiRecommendation.recommendedProblem.urgency ===
                            "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {aiRecommendation.recommendedProblem.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    {aiRecommendation.recommendedProblem.summary}
                  </p>
                  <p className="text-sm text-blue-700 italic">
                    {aiRecommendation.reasoning}
                  </p>
                </div>
              )}

              {/* New Task Creation */}
              {aiRecommendation.newTask && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">
                    Recommended New Task
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-900">
                      {aiRecommendation.newTask.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        aiRecommendation.newTask.urgency === "High"
                          ? "bg-red-100 text-red-700"
                          : aiRecommendation.newTask.urgency === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {aiRecommendation.newTask.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-green-800 mb-3">
                    {aiRecommendation.newTask.summary}
                  </p>
                  <p className="text-sm text-green-700 italic">
                    {aiRecommendation.reasoning}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRejectRecommendation}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptRecommendation}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {aiRecommendation.recommendedProblem
                  ? "Accept Assignment"
                  : "Create & Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coms;
