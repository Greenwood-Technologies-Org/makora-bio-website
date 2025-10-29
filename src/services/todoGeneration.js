/**
 * Service for AI-powered TODO generation using DSPy backend
 */

const API_BASE_URL = "http://localhost:5001";
const CACHE_STORAGE_KEY = "ai_todos_cache_v1";

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore storage errors
  }
}

export function getCachedTodos(taskId) {
  const cache = loadCache();
  const entry = cache[String(taskId)];
  if (!entry) return null;
  return entry;
}

export function setCachedTodos(taskId, result) {
  const cache = loadCache();
  cache[String(taskId)] = {
    result,
    used: false,
    timestamp: Date.now(),
  };
  saveCache(cache);
}

export function markCachedTodosUsed(taskId) {
  const cache = loadCache();
  const key = String(taskId);
  if (cache[key]) {
    cache[key].used = true;
    saveCache(cache);
  }
}

export async function prefetchTodos(
  task,
  emailThreads,
  existingTodos,
  userProfile
) {
  try {
    const result = await generateTodosWithDSPy(
      task,
      emailThreads,
      existingTodos,
      userProfile
    );
    setCachedTodos(task.id, result);
  } catch (e) {
    // background prefetch failures are non-fatal
    console.warn("Prefetch AI TODOs failed:", e.message);
  }
}

/**
 * Generate AI-powered TODOs based on task context and email threads
 * @param {Object} task - The task object with id, subject, summary, urgency, status
 * @param {Array} emailThreads - Array of email thread objects
 * @param {Array} existingTodos - Array of existing TODO objects
 * @returns {Promise<Object>} The generated TODOs and summary
 */
export async function generateTodosWithDSPy(
  task,
  emailThreads,
  existingTodos,
  userProfile
) {
  try {
    const requestData = {
      task: {
        id: task.id,
        subject: task.subject,
        summary: task.summary,
        urgency: task.urgency,
        status: task.status,
      },
      email_threads: emailThreads.map((thread) => ({
        id: thread.id,
        name: thread.name,
        description: thread.description,
        participants: thread.participants || [],
        messages: thread.messages || [],
      })),
      existing_todos: existingTodos.map((todo) => ({
        id: todo.id,
        description: todo.description,
        status: todo.status,
        tag: todo.tag,
      })),
    };
    if (userProfile) {
      requestData.user_profile = userProfile;
    }

    console.log("Sending request to DSPy:", requestData);

    const response = await fetch(`${API_BASE_URL}/api/dspy/generate-todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const responseText = await response.text();
      console.log("Error response text:", responseText);

      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.log("Failed to parse error response as JSON");
      }

      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const responseText = await response.text();
    console.log("Success response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log("Failed to parse success response as JSON:", e);
      throw new Error("Invalid JSON format in AI response");
    }

    if (!data.success) {
      throw new Error(data.error || "AI TODO generation failed");
    }

    // Build map from absolute threadId -> relative index within this task
    const sortedThreads = [...emailThreads].sort((a, b) => a.id - b.id);
    const threadIdToRelativeIndex = new Map(
      sortedThreads.map((t, idx) => [t.id, idx + 1])
    );

    // Transform the DSPy response to match the expected frontend format
    const suggestedTodos = data.todos.map((todo, index) => {
      let tag = todo.tag;

      // Normalize tag to ensure any Thread reference maps only within this task
      if (typeof tag === "string" && tag.trim().length > 0) {
        const parts = tag
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        let nonThreadLabels = [];
        let normalizedThreadLabel = null;

        for (const part of parts) {
          if (/^Thread\s+/i.test(part)) {
            // Accept either relative numbers (Thread 1..N) or absolute IDs (Thread 203)
            const numMatch = part.match(/Thread\s+(\d+)/i);
            if (numMatch) {
              const num = parseInt(numMatch[1], 10);
              // If this number matches a relative index within the task, keep it
              if (num >= 1 && num <= sortedThreads.length) {
                normalizedThreadLabel = `Thread ${num}`;
              } else {
                // Otherwise try mapping from absolute thread id -> relative index
                const relativeIdx = threadIdToRelativeIndex.get(num);
                if (relativeIdx) {
                  normalizedThreadLabel = `Thread ${relativeIdx}`;
                }
              }
            }
          } else {
            nonThreadLabels.push(part);
          }
        }

        // Choose a single tag only: prefer valid Thread tag, else first non-thread label
        tag = normalizedThreadLabel || nonThreadLabels[0] || "";
      }

      return {
        id: Math.max(...existingTodos.map((t) => t.id || 0), 0) + index + 1,
        description: todo.description,
        status: "pending",
        tag,
        priority: todo.priority,
        reasoning: todo.reasoning,
        hasAIDraft: typeof tag === "string" && /^Thread\s+\d+$/i.test(tag),
      };
    });

    return {
      suggestedTodos,
      reasoning: data.summary,
      coverageAssessment: data.coverage_assessment,
    };
  } catch (error) {
    console.error("DSPy TODO generation error:", error);

    if (error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to AI service. Please check if the backend is running."
      );
    }

    throw error;
  }
}
