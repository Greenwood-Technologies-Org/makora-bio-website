/**
 * Service for AI-powered TODO generation using DSPy backend
 */

const API_BASE_URL = "http://localhost:5001";

/**
 * Generate AI-powered TODOs based on task context and email threads
 * @param {Object} task - The task object with id, subject, summary, urgency, status
 * @param {Array} emailThreads - Array of email thread objects
 * @param {Array} existingTodos - Array of existing TODO objects
 * @returns {Promise<Object>} The generated TODOs and summary
 */
export async function generateTodosWithDSPy(task, emailThreads, existingTodos) {
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

    // Transform the DSPy response to match the expected frontend format
    const suggestedTodos = data.todos.map((todo, index) => ({
      id: Math.max(...existingTodos.map((t) => t.id || 0), 0) + index + 1,
      description: todo.description,
      status: "pending",
      tag: todo.tag,
      priority: todo.priority,
      reasoning: todo.reasoning,
      hasAIDraft: todo.tag && todo.tag.startsWith("Thread"),
    }));

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
