/**
 * Data persistence service for managing coms.json data
 * Handles saving tasks, todos, and thread assignments back to the JSON file
 */

const API_BASE_URL = "http://localhost:5001";

/**
 * Save the entire data structure back to coms.json
 * @param {Object} data - The complete data object with problems and threads
 * @returns {Promise<boolean>} Success status
 */
export async function saveData(data) {
  try {
    console.log("Saving data to backend:", {
      problems: data.problems?.length || 0,
      threads: data.threads?.length || 0,
    });

    const response = await fetch(`${API_BASE_URL}/api/data/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `HTTP error! status: ${response.status}`;
      console.error("Backend save failed:", errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Data saved successfully:", result.message);
    return result.success;
  } catch (error) {
    console.error("Data save error:", error);

    // Provide user-friendly error messages
    if (error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to backend server. Please ensure the backend is running on port 5001."
      );
    } else if (error.message.includes("NetworkError")) {
      throw new Error(
        "Network error occurred. Please check your connection and try again."
      );
    } else {
      throw new Error(`Save failed: ${error.message}`);
    }
  }
}

/**
 * Create a new task and persist it
 * @param {Object} taskData - The task data to create
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<Object>} The created task with assigned ID
 */
export async function createTask(taskData, currentProblems, currentThreads) {
  try {
    // Generate new ID
    const maxId = Math.max(...currentProblems.map((p) => p.id || 0), 0);
    const newTask = {
      id: maxId + 1,
      ...taskData,
      todos: taskData.todos || [],
    };

    console.log("Creating new task:", {
      id: newTask.id,
      subject: newTask.subject,
      urgency: newTask.urgency,
    });

    // Update the data structure
    const updatedData = {
      problems: [...currentProblems, newTask],
      threads: currentThreads,
    };

    // Persist to backend
    await saveData(updatedData);

    console.log("Task created and persisted successfully");
    return newTask;
  } catch (error) {
    console.error("Create task error:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

/**
 * Update an existing task and persist it
 * @param {Object} updatedTask - The updated task data
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<boolean>} Success status
 */
export async function updateTask(updatedTask, currentProblems, currentThreads) {
  try {
    const updatedProblems = currentProblems.map((problem) =>
      problem.id === updatedTask.id ? updatedTask : problem
    );

    const updatedData = {
      problems: updatedProblems,
      threads: currentThreads,
    };

    await saveData(updatedData);
    return true;
  } catch (error) {
    console.error("Update task error:", error);
    throw error;
  }
}

/**
 * Add a TODO to a task and persist it
 * @param {number} taskId - The task ID to add the TODO to
 * @param {Object} todoData - The TODO data to add
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<Object>} The created TODO with assigned ID
 */
export async function addTodoToTask(
  taskId,
  todoData,
  currentProblems,
  currentThreads
) {
  try {
    const task = currentProblems.find((p) => p.id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    // Generate new TODO ID
    const maxTodoId = Math.max(...task.todos.map((t) => t.id || 0), 0);
    const newTodo = {
      id: maxTodoId + 1,
      ...todoData,
      status: todoData.status || "pending",
    };

    // Update the task with the new TODO
    const updatedTask = {
      ...task,
      todos: [...task.todos, newTodo],
    };

    await updateTask(updatedTask, currentProblems, currentThreads);
    return newTodo;
  } catch (error) {
    console.error("Add TODO error:", error);
    throw error;
  }
}

/**
 * Add multiple TODOs to a task and persist them
 * @param {number} taskId - The task ID to add the TODOs to
 * @param {Array} todosData - Array of TODO data to add
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<Array>} The created TODOs with assigned IDs
 */
export async function addTodosToTask(
  taskId,
  todosData,
  currentProblems,
  currentThreads
) {
  try {
    const task = currentProblems.find((p) => p.id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    // Generate new TODO IDs
    const maxTodoId = Math.max(...task.todos.map((t) => t.id || 0), 0);
    const newTodos = todosData.map((todoData, index) => ({
      id: maxTodoId + index + 1,
      ...todoData,
      status: todoData.status || "pending",
    }));

    // Update the task with the new TODOs
    const updatedTask = {
      ...task,
      todos: [...task.todos, ...newTodos],
    };

    await updateTask(updatedTask, currentProblems, currentThreads);
    return newTodos;
  } catch (error) {
    console.error("Add TODOs error:", error);
    throw error;
  }
}

/**
 * Assign a thread to a task and persist it
 * @param {number} threadId - The thread ID to assign
 * @param {number} taskId - The task ID to assign to (null to unassign)
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<boolean>} Success status
 */
export async function assignThreadToTask(
  threadId,
  taskId,
  currentProblems,
  currentThreads
) {
  try {
    console.log("Assigning thread to task:", {
      threadId,
      taskId: taskId || "unassigned",
    });

    const updatedThreads = currentThreads.map((thread) =>
      thread.id === threadId ? { ...thread, problemId: taskId } : thread
    );

    const updatedData = {
      problems: currentProblems,
      threads: updatedThreads,
    };

    await saveData(updatedData);
    console.log("Thread assignment persisted successfully");
    return true;
  } catch (error) {
    console.error("Assign thread error:", error);
    throw new Error(`Failed to assign thread: ${error.message}`);
  }
}

/**
 * Update a TODO and persist it
 * @param {number} taskId - The task ID containing the TODO
 * @param {Object} updatedTodo - The updated TODO data
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<boolean>} Success status
 */
export async function updateTodo(
  taskId,
  updatedTodo,
  currentProblems,
  currentThreads
) {
  try {
    const task = currentProblems.find((p) => p.id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    const updatedTodos = task.todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );

    const updatedTask = {
      ...task,
      todos: updatedTodos,
    };

    await updateTask(updatedTask, currentProblems, currentThreads);
    return true;
  } catch (error) {
    console.error("Update TODO error:", error);
    throw error;
  }
}

/**
 * Mark a thread as read/unread and persist it
 * @param {number} threadId - The thread ID to update
 * @param {boolean} isRead - Whether the thread is read
 * @param {Array} currentProblems - Current problems array
 * @param {Array} currentThreads - Current threads array
 * @returns {Promise<boolean>} Success status
 */
export async function markThreadAsRead(
  threadId,
  isRead,
  currentProblems,
  currentThreads
) {
  try {
    const updatedThreads = currentThreads.map((thread) =>
      thread.id === threadId ? { ...thread, isRead } : thread
    );

    const updatedData = {
      problems: currentProblems,
      threads: updatedThreads,
    };

    await saveData(updatedData);
    return true;
  } catch (error) {
    console.error("Mark thread as read error:", error);
    throw error;
  }
}
