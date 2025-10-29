/**
 * Service for AI-powered email drafting using DSPy backend
 */

const API_BASE_URL = "http://localhost:5001";

/**
 * Generate an AI-powered email draft based on an email thread and todo task
 * @param {Object} emailThread - The email thread object
 * @param {string} todoDescription - The todo task description
 * @returns {Promise<Object>} The generated email draft
 */
export async function generateEmailDraftWithDSPy(
  emailThread,
  todoDescription,
  userProfile
) {
  try {
    // Format the email thread for the API
    let emailThreadText = `Subject: ${
      emailThread.name || emailThread.subject || ""
    }\n`;
    emailThreadText += `Participants: ${(emailThread.participants || []).join(
      ", "
    )}\n`;
    emailThreadText += `Description: ${emailThread.description || ""}\n\n`;
    emailThreadText += `Messages:\n`;

    // Add all messages from the thread
    if (emailThread.messages && emailThread.messages.length > 0) {
      emailThread.messages.forEach((message, index) => {
        emailThreadText += `From: ${message.from || "Unknown"}\n`;
        emailThreadText += `To: ${message.to || "Unknown"}\n`;
        emailThreadText += `Date: ${message.timestamp || "Unknown"}\n`;
        emailThreadText += `Content: ${message.content || ""}\n`;
        emailThreadText += `---\n`;
      });
    } else {
      // If no messages, use thread description as content
      emailThreadText += `Content: ${emailThread.description || ""}\n`;
    }

    const response = await fetch(`${API_BASE_URL}/api/dspy/draft-email-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_thread: emailThreadText.trim(),
        todo_description: todoDescription,
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
      throw new Error(data.error || "AI email drafting failed");
    }

    return {
      to: data.draft.to,
      cc: data.draft.cc,
      bcc: data.draft.bcc,
      subject: data.draft.subject,
      body: data.draft.body,
    };
  } catch (error) {
    console.error("DSPy email drafting error:", error);

    if (error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to AI service. Please check if the backend is running."
      );
    }

    throw error;
  }
}
