import React, { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const clearAllTasks = () => setTasks([]);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div style={styles.container}>
      <h1>📊 Productivity Dashboard</h1>

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

      <div style={styles.stats}>
        <p>Total: {tasks.length}</p>
        <p>Completed: {completedTasks}</p>
        <p>Progress: {progress}%</p>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
      </div>

      <h3>Tasks</h3>

      <ul style={styles.list}>
        {tasks.map((t, index) => (
          <li key={index} style={styles.taskItem}>
            <span
              onClick={() => toggleComplete(index)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
                color: t.completed ? "gray" : "black",
              }}
            >
              {t.text}
            </span>

            <button onClick={() => deleteTask(index)} style={styles.deleteBtn}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <button onClick={clearAllTasks} style={styles.clearBtn}>
          Clear All
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "auto",
    fontFamily: "Arial",
    textAlign: "center",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "10px",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#ddd",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: "5px",
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
    backgroundColor: "#f4f4f4",
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