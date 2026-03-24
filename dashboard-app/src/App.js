import React, { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  return (
    <div style={styles.container}>
      <h1>📊 My Dashboard</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={styles.input}
        />

        <button onClick={addTask} style={styles.addBtn}>
          Add
        </button>
      </div>

      <h3>Total Tasks: {tasks.length}</h3>

      <ul style={styles.list}>
        {tasks.map((t, index) => (
          <li key={index} style={styles.taskItem}>
            <span
              onClick={() => toggleComplete(index)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {t.text}
            </span>

            <button
              onClick={() => deleteTask(index)}
              style={styles.deleteBtn}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <button onClick={clearAllTasks} style={styles.clearBtn}>
          Clear All Tasks
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
    fontFamily: "Arial",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#f5f5f5",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  clearBtn: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;