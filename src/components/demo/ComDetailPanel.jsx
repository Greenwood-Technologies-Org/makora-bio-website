import React, { useState } from "react";

function ComDetailPanel({ com, onBack }) {
  const [expandedThread, setExpandedThread] = useState(null);
  const [threads, setThreads] = useState(com.threads);
  const [draftMessages, setDraftMessages] = useState({});
  const [todos, setTodos] = useState(com.todos);
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { todoId, x, y }
  const [newTodo, setNewTodo] = useState({
    description: "",
    tag: "",
    status: "pending",
  });

  // Existing TODO editing state
  const [editingExistingTodo, setEditingExistingTodo] = useState(null);
  const [editingExistingText, setEditingExistingText] = useState("");
  const [showExistingTagDropdown, setShowExistingTagDropdown] = useState(null);
  const [customExistingTags, setCustomExistingTags] = useState([]);

  // Task priority and status dropdown state
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [taskData, setTaskData] = useState(com);

  // AI TODO generation state
  const [aiTodoLoading, setAiTodoLoading] = useState(false);
  const [aiTodoRecommendations, setAiTodoRecommendations] = useState(null);
  const [showAiTodoModal, setShowAiTodoModal] = useState(false);

  const toggleThread = (threadId) => {
    setExpandedThread(expandedThread === threadId ? null : threadId);
  };

  // AI TODO Generation Engine
  const todoGenerationEngine = {
    async analyzeTaskAndGenerateTodos(task, existingTodos, threads) {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const taskText = `${task.subject} ${task.summary}`.toLowerCase();
      const existingTodoTexts = existingTodos.map((t) =>
        t.description.toLowerCase()
      );
      const threadContents = threads
        .map(
          (t) =>
            `${t.name} ${t.description} ${
              t.messages?.map((m) => m.content).join(" ") || ""
            }`
        )
        .join(" ")
        .toLowerCase();

      const allContext = `${taskText} ${threadContents}`;

      // Generate suggested TODOs based on task type and content
      const suggestions = this.generateTodoSuggestions(
        allContext,
        existingTodoTexts,
        threads
      );

      return {
        suggestedTodos: suggestions,
        reasoning: `Generated ${suggestions.length} Subtask suggestions based on task analysis and thread content.`,
      };
    },

    generateTodoSuggestions(context, existingTodos, threads) {
      const suggestions = [];

      // Common TODO patterns based on content analysis
      const todoPatterns = [
        {
          keywords: ["discrepancy", "mismatch", "error", "incorrect"],
          todos: [
            "Review and verify data accuracy",
            "Contact site for clarification",
            "Update EDC with correct information",
            "Document resolution in study files",
          ],
        },
        {
          keywords: ["deviation", "protocol", "violation"],
          todos: [
            "Submit protocol deviation report",
            "Obtain PI approval for deviation",
            "Update deviation log",
            "Implement corrective actions",
          ],
        },
        {
          keywords: ["supply", "inventory", "shipment", "kit"],
          todos: [
            "Coordinate emergency shipment",
            "Update inventory tracking system",
            "Confirm delivery with site",
            "Monitor future supply levels",
          ],
        },
        {
          keywords: ["adverse", "event", "ae", "safety"],
          todos: [
            "Complete AE assessment",
            "Notify medical monitor",
            "Update safety database",
            "Follow up on patient status",
          ],
        },
        {
          keywords: ["visit", "schedule", "appointment"],
          todos: [
            "Reschedule missed visit",
            "Update visit tracking log",
            "Coordinate with site staff",
            "Ensure protocol compliance",
          ],
        },
      ];

      // Default general TODOs
      const generalTodos = [
        "Follow up with site team",
        "Update study documentation",
        "Review compliance status",
        "Prepare status report",
      ];

      // Find matching patterns
      let matchedTodos = [];
      for (const pattern of todoPatterns) {
        if (pattern.keywords.some((keyword) => context.includes(keyword))) {
          matchedTodos = [...matchedTodos, ...pattern.todos];
        }
      }

      // If no specific patterns match, use general TODOs
      if (matchedTodos.length === 0) {
        matchedTodos = generalTodos;
      }

      // Filter out TODOs that are too similar to existing ones
      const filteredTodos = matchedTodos.filter((todo) => {
        return !existingTodos.some(
          (existing) =>
            this.calculateSimilarity(todo.toLowerCase(), existing) > 0.7
        );
      });

      // Create TODO objects with appropriate system tags
      filteredTodos.slice(0, 4).forEach((todoText, index) => {
        const tag = this.determineSystemTag(todoText, threads);

        suggestions.push({
          id: Math.max(...existingTodos.map((t) => t.id || 0), 0) + index + 1,
          description: todoText,
          status: "pending",
          tag: tag,
          hasAIDraft: tag.startsWith("Thread"),
          aiDraft: tag.startsWith("Thread")
            ? {
                threadId: this.extractThreadId(tag, threads),
                message: `Hello,\n\nRegarding: ${todoText}\n\nI wanted to follow up on this matter.\n\nBest regards,\nClinical Research Team`,
                references: [
                  {
                    type: "Document",
                    title: "Standard Operating Procedures",
                    date: new Date().toISOString().split("T")[0],
                  },
                ],
              }
            : undefined,
        });
      });

      return suggestions;
    },

    calculateSimilarity(text1, text2) {
      const words1 = text1.split(/\s+/);
      const words2 = text2.split(/\s+/);
      const intersection = words1.filter((word) => words2.includes(word));
      return intersection.length / Math.max(words1.length, words2.length);
    },

    determineSystemTag(todoText, threads) {
      const lowerText = todoText.toLowerCase();

      // First, try to match TODO to existing threads
      for (let i = 0; i < threads.length; i++) {
        const thread = threads[i];
        const threadText = `${thread.name} ${thread.description}`.toLowerCase();
        if (this.calculateSimilarity(lowerText, threadText) > 0.3) {
          return `Thread ${i + 1}`;
        }
      }

      // Then, determine system-specific tags based on content
      if (
        lowerText.includes("edc") ||
        lowerText.includes("data entry") ||
        lowerText.includes("case report")
      ) {
        return "Medidata Rave";
      }
      if (
        lowerText.includes("site") ||
        lowerText.includes("contact") ||
        lowerText.includes("communication")
      ) {
        return "Veeva Site Connect";
      }
      if (
        lowerText.includes("randomization") ||
        lowerText.includes("ivrs") ||
        lowerText.includes("iwrs") ||
        lowerText.includes("kit")
      ) {
        return "IWRS/IVRS";
      }
      if (
        lowerText.includes("safety") ||
        lowerText.includes("adverse") ||
        lowerText.includes("ae")
      ) {
        return "Safety Database";
      }
      if (
        lowerText.includes("tmf") ||
        lowerText.includes("document") ||
        lowerText.includes("file")
      ) {
        return "eTMF";
      }
      if (
        lowerText.includes("visit") ||
        lowerText.includes("schedule") ||
        lowerText.includes("appointment")
      ) {
        return "CTMS";
      }

      return "General"; // default
    },

    extractThreadId(tag, threads) {
      const match = tag.match(/Thread (\d+)/);
      if (match) {
        const threadIndex = parseInt(match[1]) - 1;
        return threads[threadIndex]?.id || 1;
      }
      return 1;
    },
  };

  const handleAIDraft = (todoId) => {
    // Find the todo with the
    const todo = todos.find((t) => t.id === todoId);
    if (!todo || !todo.aiDraft) return;

    const { threadId, message } = todo.aiDraft;

    // Check if the thread exists, if not create it (for new threads)
    const existingThread = threads.find((t) => t.id === threadId);
    if (!existingThread) {
      // Create a new thread based on the todo tag
      const newThread = {
        id: threadId,
        name: `Thread ${threadId}: ${todo.tag}`,
        description: `Thread for: ${todo.description}`,
        participants: ["CRA", "Site CRC"], // Default participants for new threads
        messages: [],
      };
      setThreads((prev) => [...prev, newThread]);
    }

    // Set the draft message for the thread
    setDraftMessages((prev) => ({
      ...prev,
      [threadId]: message,
    }));

    // Expand the thread to show the draft
    setExpandedThread(threadId);

    // Scroll to the thread smoothly
    setTimeout(() => {
      const threadElement = document.getElementById(`thread-${threadId}`);
      if (threadElement) {
        threadElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const handleDraftChange = (threadId, value) => {
    setDraftMessages((prev) => ({
      ...prev,
      [threadId]: value,
    }));
  };

  const handleSendDraft = (threadId) => {
    const message = draftMessages[threadId];
    if (!message || !message.trim()) return;

    const newMessage = {
      from: "CRA",
      to: threadId === 1 ? "Data Management" : "Site CRC",
      content: message,
      timestamp: "Just now",
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
          };
        }
        return thread;
      })
    );

    // Clear the draft
    setDraftMessages((prev) => {
      const newDrafts = { ...prev };
      delete newDrafts[threadId];
      return newDrafts;
    });
  };

  const handleCancelDraft = (threadId) => {
    setDraftMessages((prev) => {
      const newDrafts = { ...prev };
      delete newDrafts[threadId];
      return newDrafts;
    });
  };

  const handleAddTodo = () => {
    if (!newTodo.description.trim() || !newTodo.tag) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if the TODO is associated with a thread (tags like "Thread 1", "Thread 2", etc.)
    const isThreadAssociated = newTodo.tag.startsWith("Thread");

    // Extract thread number from tag (e.g., "Thread 1" -> 1)
    let threadId = null;
    let aiDraft = null;

    if (isThreadAssociated) {
      const threadMatch = newTodo.tag.match(/Thread (\d+)/);
      if (threadMatch) {
        threadId = parseInt(threadMatch[1]);

        // Find the thread to get participant information
        const thread = threads.find((t) => t.id === threadId);
        const toParticipant =
          thread && thread.participants.length > 1
            ? thread.participants[thread.participants.length - 1]
            : "Site CRC";

        // Generate  content
        aiDraft = {
          threadId: threadId,
          message: `Hello,\n\nRegarding: ${newTodo.description.trim()}\n\nI wanted to follow up on this matter and request your assistance.\n\n[AI-generated response based on the TODO description and thread context]\n\nPlease let me know if you need any additional information or clarification.\n\nBest regards,\nClinical Research Team`,
          references: [
            {
              type: "Document",
              title: "Protocol Guidelines",
              date: new Date().toISOString().split("T")[0],
            },
          ],
        };
      }
    }

    const todo = {
      id: todos.length + 1,
      description: newTodo.description.trim(),
      status: newTodo.status,
      tag: newTodo.tag,
      hasAIDraft: isThreadAssociated,
      ...(aiDraft && { aiDraft }), // Add aiDraft if it exists
    };

    setTodos([...todos, todo]);
    setShowAddTodoModal(false);
    setNewTodo({
      description: "",
      tag: "",
      status: "pending",
    });
  };

  const handleCancelAddTodo = () => {
    setShowAddTodoModal(false);
    setNewTodo({
      description: "",
      tag: "",
      status: "pending",
    });
  };

  // AI TODO Generation Handlers
  const handleAiTodoGeneration = async () => {
    setAiTodoLoading(true);

    try {
      const result = await todoGenerationEngine.analyzeTaskAndGenerateTodos(
        com,
        todos,
        threads
      );

      if (result.suggestedTodos.length > 0) {
        setAiTodoRecommendations(result);
        setShowAiTodoModal(true);
      } else {
        alert(
          "No new Subtask suggestions found based on current task and threads."
        );
      }
    } catch (error) {
      console.error("AI Subtask generation error:", error);
      alert("Failed to generate Subtask suggestions. Please try again.");
    } finally {
      setAiTodoLoading(false);
    }
  };

  const handleAcceptAiTodos = (selectedTodos) => {
    // Add selected TODOs to the existing list
    const newTodos = [...todos, ...selectedTodos];
    setTodos(newTodos);
    setShowAiTodoModal(false);
    setAiTodoRecommendations(null);
  };

  const handleRejectAiTodos = () => {
    setShowAiTodoModal(false);
    setAiTodoRecommendations(null);
  };

  const handleToggleTodo = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              status: todo.status === "completed" ? "pending" : "completed",
            }
          : todo
      )
    );
  };

  const handleContextMenu = (e, todoId) => {
    e.preventDefault();
    setContextMenu({
      todoId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDeleteTodo = (todoId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    setContextMenu(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Existing TODO editing functions
  const getExistingTagOptions = () => [
    ...threads.map((thread, idx) => ({
      value: `Thread ${idx + 1}`,
      label: `Thread ${idx + 1}`,
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    })),
    {
      value: "Medidata Rave",
      label: "Medidata Rave (EDC System)",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      value: "Veeva Site Connect",
      label: "Veeva Site Connect",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "CTMS",
      label: "CTMS (Clinical Trial Management)",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      value: "eTMF",
      label: "eTMF (Trial Master File)",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      value: "IWRS/IVRS",
      label: "IWRS/IVRS (Randomization)",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    {
      value: "Safety Database",
      label: "Safety Database",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      value: "General",
      label: "General",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    ...customExistingTags.map((tag) => ({
      value: tag,
      label: tag,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    })),
  ];

  const getExistingTagColor = (tagValue) => {
    if (tagValue.startsWith("Thread")) {
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    }
    const option = getExistingTagOptions().find(
      (opt) => opt.value === tagValue
    );
    return option ? option.color : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleStartExistingEdit = (todoId, currentDescription) => {
    setEditingExistingTodo(todoId);
    setEditingExistingText(currentDescription);
  };

  const handleSaveExistingEdit = (todoId) => {
    if (editingExistingText.trim()) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? { ...todo, description: editingExistingText.trim() }
            : todo
        )
      );
    }
    setEditingExistingTodo(null);
    setEditingExistingText("");
  };

  const handleCancelExistingEdit = () => {
    setEditingExistingTodo(null);
    setEditingExistingText("");
  };

  const handleExistingTagChange = (todoId, newTag) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === todoId ? { ...todo, tag: newTag } : todo))
    );
    setShowExistingTagDropdown(null);
  };

  const handleAddExistingCustomTag = (todoId, customTag) => {
    if (
      customTag.trim() &&
      !getExistingTagOptions().some((opt) => opt.value === customTag.trim())
    ) {
      setCustomExistingTags((prev) => [...prev, customTag.trim()]);
      handleExistingTagChange(todoId, customTag.trim());
    }
  };

  // Task priority and status functions
  const priorityOptions = [
    {
      value: "High",
      label: "High Priority",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      value: "Medium",
      label: "Medium Priority",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      value: "Low",
      label: "Low Priority",
      color: "bg-green-100 text-green-700 border-green-200",
    },
  ];

  const statusOptions = [
    {
      value: "In Progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      value: "Pending Response",
      label: "Pending Response",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      value: "Resolved",
      label: "Resolved",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "On Hold",
      label: "On Hold",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
  ];

  const getPriorityColor = (priority) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option ? option.color : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handlePriorityChange = (newPriority) => {
    setTaskData((prev) => ({ ...prev, urgency: newPriority }));
    setShowPriorityDropdown(false);
  };

  const handleStatusChange = (newStatus) => {
    setTaskData((prev) => ({ ...prev, status: newStatus }));
    setShowStatusDropdown(false);
  };

  // Generate tag options based on threads
  const tagOptions = [
    ...threads.map((thread, idx) => ({
      value: `Thread ${idx + 1}`,
      label: `Thread ${idx + 1}`,
    })),
    { value: "Medidata Rave", label: "Medidata Rave (EDC System)" },
    { value: "Veeva Site Connect", label: "Veeva Site Connect" },
    { value: "CTMS", label: "CTMS (Clinical Trial Management)" },
    { value: "eTMF", label: "eTMF (Trial Master File)" },
    { value: "IWRS/IVRS", label: "IWRS/IVRS (Randomization)" },
    { value: "Safety Database", label: "Safety Database" },
    { value: "General", label: "General" },
  ];

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      onClick={(e) => {
        handleCloseContextMenu();
        setShowExistingTagDropdown(null);
        setShowPriorityDropdown(false);
        setShowStatusDropdown(false);
      }}
    >
      {/* Header with Back Button */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Coms</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {taskData.subject}
              </h1>

              {/* Priority Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPriorityDropdown(!showPriorityDropdown);
                    setShowStatusDropdown(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-full font-medium border transition-colors hover:shadow-sm ${getPriorityColor(
                    taskData.urgency
                  )}`}
                >
                  {taskData.urgency}
                  <svg
                    className="w-3 h-3 ml-1 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showPriorityDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityChange(option.value);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${option.color}`}
                        >
                          {option.value}
                        </span>
                        <span className="text-gray-600">
                          {option.label
                            .replace(option.value, "")
                            .replace(/Priority/g, "")
                            .trim()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowPriorityDropdown(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-full font-medium border transition-colors hover:shadow-sm ${getStatusColor(
                    taskData.status
                  )}`}
                >
                  {taskData.status}
                  <svg
                    className="w-3 h-3 ml-1 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(option.value);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${option.color}`}
                        >
                          {option.value}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{taskData.summary}</p>
          </div>
          <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
            {taskData.timestamp}
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Threads - Left/Main Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Email Threads
          </h2>

          {threads.map((thread, index) => (
            <div
              key={thread.id}
              id={`thread-${thread.id}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
            >
              {/* Compact Thread Header - Gmail Style */}
              <div
                onClick={() => toggleThread(thread.id)}
                className={`p-3 cursor-pointer transition-all border-l-4 ${
                  expandedThread === thread.id
                    ? "bg-primary-50 border-primary-500"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                {/* Header: Sender + Time + Thread ID */}
                <div className="flex items-baseline justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Sender Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                        expandedThread === thread.id
                          ? "bg-primary-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {thread.messages && thread.messages.length > 0
                        ? thread.messages[
                            thread.messages.length - 1
                          ]?.from?.charAt(0) || "?"
                        : thread.participants[0]?.charAt(0) || "?"}
                    </div>
                    {/* Sender Name */}
                    <span
                      className={`text-sm truncate ${
                        expandedThread === thread.id
                          ? "font-semibold text-gray-900"
                          : "font-semibold text-gray-800"
                      }`}
                    >
                      {thread.messages && thread.messages.length > 0
                        ? thread.messages[thread.messages.length - 1]?.from ||
                          "Unknown"
                        : thread.participants[0] || "Unknown"}
                    </span>
                    {/* Thread ID Badge */}
                    <span className="px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-full flex-shrink-0">
                      #{index + 1}
                    </span>
                  </div>
                  {/* Timestamp and Expand Icon */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                      {thread.messages && thread.messages.length > 0
                        ? thread.messages[thread.messages.length - 1]
                            ?.timestamp || "N/A"
                        : "N/A"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        expandedThread === thread.id
                          ? "transform rotate-180"
                          : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Subject */}
                <h3
                  className={`text-sm mb-1 truncate ${
                    expandedThread === thread.id
                      ? "font-medium text-gray-900"
                      : "font-medium text-gray-800"
                  }`}
                >
                  {thread.name}
                </h3>

                {/* Description Preview */}
                <p className="text-xs text-gray-600 truncate">
                  {thread.description}
                </p>
              </div>

              {/* Thread Messages - Expandable */}
              {expandedThread === thread.id && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Messages
                  </h4>
                  <div className="space-y-3">
                    {thread.messages.map((message, msgIdx) => (
                      <div
                        key={msgIdx}
                        className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            {/* From → To */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {message.from}
                              </span>
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
                              <span className="text-sm font-medium text-gray-600">
                                {message.to}
                              </span>
                            </div>

                            {/* CC */}
                            {message.cc && message.cc.length > 0 && (
                              <div className="flex items-start gap-2 mb-1">
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
                              <div className="flex items-start gap-2 mb-1">
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
                              <div className="flex items-center gap-2 mb-1">
                                <svg
                                  className="w-3.5 h-3.5 text-blue-500"
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
                                <span className="text-xs text-blue-600">
                                  Reply to: {message.replyTo}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    ))}

                    {/*  Message Box */}
                    {draftMessages[thread.id] && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-300">
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
                          <span className="text-sm font-semibold text-purple-700"></span>
                        </div>
                        <textarea
                          value={draftMessages[thread.id]}
                          onChange={(e) =>
                            handleDraftChange(thread.id, e.target.value)
                          }
                          className="w-full h-96 p-3 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y mb-3"
                          placeholder="Edit your message..."
                        />

                        {/* AI References */}
                        {(() => {
                          const todo = com.todos.find(
                            (t) => t.aiDraft && t.aiDraft.threadId === thread.id
                          );
                          return (
                            todo &&
                            todo.aiDraft &&
                            todo.aiDraft.references &&
                            todo.aiDraft.references.length > 0 && (
                              <div className="mb-3">
                                <h5 className="text-xs font-semibold text-purple-700 mb-2">
                                  AI References Used:
                                </h5>
                                <div className="space-y-1">
                                  {todo.aiDraft.references.map((ref, idx) => (
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
                            )
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
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current TODOs - Right Panel */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Current TODOs
          </h2>
          <div className="space-y-3">
            {todos.map((todo) => {
              const isEDC = todo.tag === "EDC";
              return (
                <div
                  key={todo.id}
                  onContextMenu={(e) => handleContextMenu(e, todo.id)}
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
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {/* Editable Title */}
                          {editingExistingTodo === todo.id ? (
                            <div className="mb-2">
                              <input
                                type="text"
                                value={editingExistingText}
                                onChange={(e) =>
                                  setEditingExistingText(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                    handleSaveExistingEdit(todo.id);
                                  } else if (e.key === "Escape") {
                                    e.stopPropagation();
                                    handleCancelExistingEdit();
                                  }
                                }}
                                onBlur={() => handleSaveExistingEdit(todo.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full px-2 py-1 text-sm bg-white border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <p
                              className={`text-sm mb-2 cursor-text hover:bg-gray-100 px-1 py-0.5 rounded ${
                                todo.status === "completed"
                                  ? "text-gray-600 line-through"
                                  : "text-gray-900"
                              }`}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleStartExistingEdit(
                                  todo.id,
                                  todo.description
                                );
                              }}
                              title="Double-click to edit"
                            >
                              {todo.description}
                            </p>
                          )}

                          {/* System Tag with Dropdown */}
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowExistingTagDropdown(
                                    showExistingTagDropdown === todo.id
                                      ? null
                                      : todo.id
                                  );
                                }}
                                className={`px-2 py-0.5 rounded-full font-medium border transition-colors hover:shadow-sm ${getExistingTagColor(
                                  todo.tag
                                )}`}
                              >
                                {todo.tag}
                                <svg
                                  className="w-3 h-3 ml-1 inline"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>

                              {/* Tag Dropdown */}
                              {showExistingTagDropdown === todo.id && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                  {getExistingTagOptions().map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleExistingTagChange(
                                          todo.id,
                                          option.value
                                        );
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                    >
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${option.color}`}
                                      >
                                        {option.value}
                                      </span>
                                    </button>
                                  ))}
                                  <div className="border-t border-gray-200 p-2">
                                    <input
                                      type="text"
                                      placeholder="Create new tag..."
                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.stopPropagation();
                                          handleAddExistingCustomTag(
                                            todo.id,
                                            e.target.value
                                          );
                                          e.target.value = "";
                                        }
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {todo.hasAIDraft && todo.status !== "completed" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAIDraft(todo.id);
                            }}
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center flex-shrink-0"
                            title="AI Draft"
                          >
                            <svg
                              className="w-3 h-3"
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
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {todos.length === 0 && (
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
                <p className="text-sm">No TODOs</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setShowAddTodoModal(true)}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center justify-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Subtask
            </button>

            {/* AI Subtask Generation Button */}
            <button
              onClick={handleAiTodoGeneration}
              disabled={aiTodoLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              title={
                aiTodoLoading ? "Generating Subtasks..." : "AI Generate Subtasks"
              }
            >
              {aiTodoLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Context Menu for Delete */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleDeleteTodo(contextMenu.todoId)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Subtask
          </button>
        </div>
      )}

      {/* Add Subtask Modal */}
      {showAddTodoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Add New TODO
                </h3>
                <button
                  onClick={handleCancelAddTodo}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
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

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  placeholder="Enter TODO description..."
                  className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Associate with Thread/Topic */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Associate with <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTodo.tag}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, tag: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Select thread or topic...</option>
                  {tagOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose which email thread or topic this TODO is related to
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={newTodo.status === "pending"}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, status: e.target.value })
                      }
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Pending</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={newTodo.status === "completed"}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, status: e.target.value })
                      }
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Completed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">
              <button
                onClick={handleCancelAddTodo}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Subtask
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Subtask Recommendations Modal */}
      {showAiTodoModal && aiTodoRecommendations && (
        <AiTodoModal
          recommendations={aiTodoRecommendations}
          onAccept={handleAcceptAiTodos}
          onReject={handleRejectAiTodos}
        />
      )}
    </div>
  );
}

// AI Subtask Modal Component
function AiTodoModal({ recommendations, onAccept, onReject }) {
  const [selectedTodos, setSelectedTodos] = useState(
    recommendations.suggestedTodos.map((todo) => ({ ...todo, selected: true }))
  );
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(null);
  const [customTags, setCustomTags] = useState([]);

  // Tag options with colors
  const getTagOptions = () => [
    // Add threads first
    ...threads.map((thread, idx) => ({
      value: `Thread ${idx + 1}`,
      label: `Thread ${idx + 1}`,
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    })),
    {
      value: "Medidata Rave",
      label: "Medidata Rave (EDC System)",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      value: "Veeva Site Connect",
      label: "Veeva Site Connect",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "CTMS",
      label: "CTMS (Clinical Trial Management)",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      value: "eTMF",
      label: "eTMF (Trial Master File)",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      value: "IWRS/IVRS",
      label: "IWRS/IVRS (Randomization)",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    {
      value: "Safety Database",
      label: "Safety Database",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      value: "General",
      label: "General",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    ...customTags.map((tag) => ({
      value: tag,
      label: tag,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    })),
  ];

  const getTagColor = (tagValue) => {
    if (tagValue.startsWith("Thread")) {
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    }
    const option = getTagOptions().find((opt) => opt.value === tagValue);
    return option ? option.color : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleToggleTodo = (todoId) => {
    setSelectedTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, selected: !todo.selected } : todo
      )
    );
  };

  const handleStartEdit = (todoId, currentDescription) => {
    setEditingTodo(todoId);
    setEditingText(currentDescription);
  };

  const handleSaveEdit = (todoId) => {
    if (editingText.trim()) {
      setSelectedTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? { ...todo, description: editingText.trim() }
            : todo
        )
      );
    }
    setEditingTodo(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditingText("");
  };

  const handleTagChange = (todoId, newTag) => {
    setSelectedTodos((prev) =>
      prev.map((todo) => (todo.id === todoId ? { ...todo, tag: newTag } : todo))
    );
    setShowTagDropdown(null);
  };

  const handleAddCustomTag = (todoId, customTag) => {
    if (
      customTag.trim() &&
      !getTagOptions().some((opt) => opt.value === customTag.trim())
    ) {
      setCustomTags((prev) => [...prev, customTag.trim()]);
      handleTagChange(todoId, customTag.trim());
    }
  };

  const handleAccept = () => {
    const todosToAdd = selectedTodos.filter((todo) => todo.selected);
    onAccept(todosToAdd);
  };

  const selectedCount = selectedTodos.filter((todo) => todo.selected).length;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => setShowTagDropdown(null)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            AI Subtask Recommendations
          </h3>
          <p className="text-sm text-gray-600">{recommendations.reasoning}</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-3">
            {selectedTodos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  todo.selected
                    ? "border-purple-200 bg-purple-50"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => handleToggleTodo(todo.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        todo.selected
                          ? "bg-purple-500 border-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {todo.selected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Editable Title */}
                    {editingTodo === todo.id ? (
                      <div className="mb-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              handleSaveEdit(todo.id);
                            } else if (e.key === "Escape") {
                              e.stopPropagation();
                              handleCancelEdit();
                            }
                          }}
                          onBlur={() => handleSaveEdit(todo.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <p
                        className="font-medium text-gray-900 mb-1 cursor-text hover:bg-gray-100 px-1 py-0.5 rounded"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(todo.id, todo.description);
                        }}
                        title="Double-click to edit"
                      >
                        {todo.description}
                      </p>
                    )}

                    {/* Tags and AI Draft Indicator */}
                    <div className="flex items-center gap-4 text-sm">
                      {/* System Tag with Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTagDropdown(
                              showTagDropdown === todo.id ? null : todo.id
                            );
                          }}
                          className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors hover:shadow-sm ${getTagColor(
                            todo.tag
                          )}`}
                        >
                          {todo.tag}
                          <svg
                            className="w-3 h-3 ml-1 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Tag Dropdown */}
                        {showTagDropdown === todo.id && (
                          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                            {getTagOptions().map((option) => (
                              <button
                                key={option.value}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagChange(todo.id, option.value);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                              >
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${option.color}`}
                                >
                                  {option.value}
                                </span>
                              </button>
                            ))}
                            <div className="border-t border-gray-200 p-2">
                              <input
                                type="text"
                                placeholder="Create new tag..."
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                    handleAddCustomTag(todo.id, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Draft Indicator */}
                      {todo.hasAIDraft && (
                        <span className="flex items-center gap-1 text-purple-600">
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
                          <span className="text-xs">AI Draft</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {selectedCount} of {selectedTodos.length} Subtasks selected
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onReject}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={selectedCount === 0}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              Add {selectedCount} Subtask{selectedCount !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComDetailPanel;
