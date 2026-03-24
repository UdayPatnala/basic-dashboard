import React, { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work");
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

    const newTask = {
      text: task,
      completed: false,
      category: category,
    };

    setTasks([...tasks, newTask]);
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

  const getCategoryColor = (cat) => {
    if (cat === "Work") return "#007bff";
    if (cat === "Study") return "green";
    if (cat === "Personal") return "orange";
    return "gray";
  };

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

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
        </select>

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

      <ul style={styles.list}>
        {tasks.map((t, index) => (
          <li key={index} style={styles.taskItem}>
            <div>
              <span
                onClick={() => toggleComplete(index)}
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {t.text}
              </span>

              <span
                style={{
                  ...styles.categoryTag,
                  backgroundColor: getCategoryColor(t.category),
                }}
              >
                {t.category}
              </span>
            </div>

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
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: 2,
    padding: "10px",
  },
  select: {
    padding: "10px",
  },
  addBtn: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#ddd",
    margin: "10px 0",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "green",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    marginTop: "10px",
  },
  categoryTag: {
    marginLeft: "10px",
    padding: "3px 8px",
    color: "white",
    borderRadius: "5px",
    fontSize: "12px",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
  },
  clearBtn: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "black",
    color: "white",
    border: "none",
  },
};

export default App;