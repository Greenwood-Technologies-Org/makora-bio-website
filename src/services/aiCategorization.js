/**
 * AI-powered email categorization service using DSPy backend
 */

const API_BASE_URL = "http://localhost:5001";

/**
 * Categorize an email thread using DSPy AI
 * @param {Object} emailThread - The email thread to categorize
 * @param {Array} existingTasks - Array of existing tasks to match against
 * @returns {Promise<Object>} AI recommendation for categorization
 */
export async function categorizeEmailWithDSPy(
  emailThread,
  existingTasks,
  userProfile
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dspy/categorize-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_thread: {
          id: emailThread.id,
          subject: emailThread.name, // Frontend uses 'name' for subject
          participants: emailThread.participants || [],
          description: emailThread.description,
          messages: emailThread.messages || [],
        },
        existing_tasks: existingTasks.map((task) => ({
          id: task.id,
          subject: task.subject,
          summary: task.summary,
          status: task.status,
          urgency: task.urgency,
        })),
        user_profile: userProfile || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "AI categorization failed");
    }

    // Transform the response to match the frontend's expected format
    const recommendation = data.recommendation;

    if (recommendation.action === "assign_existing") {
      const taskId = parseInt(recommendation.task_id);
      const matchedTask = existingTasks.find((task) => task.id === taskId);

      if (!matchedTask) {
        throw new Error("AI recommended a task that no longer exists");
      }

      return {
        recommendedProblem: matchedTask,
        newTask: null,
        confidence: parseInt(recommendation.confidence),
        reasoning: recommendation.reasoning,
      };
    } else if (recommendation.action === "create_new") {
      return {
        recommendedProblem: null,
        newTask: {
          subject: recommendation.new_task.subject,
          summary: recommendation.new_task.summary,
          urgency: recommendation.new_task.priority,
          status: "In Progress",
          timestamp: "Just now",
          todos: [],
        },
        confidence: parseInt(recommendation.confidence),
        reasoning: recommendation.reasoning,
      };
    }

    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("DSPy categorization error:", error);

    // Re-throw with user-friendly message
    if (error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to AI service. Please check if the backend is running."
      );
    }

    throw error;
  }
}
