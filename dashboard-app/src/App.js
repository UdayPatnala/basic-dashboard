import React, { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

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

  return (
    <div style={styles.container}>
      <h1>My Dashboard</h1>

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

      <ul>
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
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  addBtn: {
    padding: "8px",
    backgroundColor: "green",
    color: "white",
    border: "none",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    padding: "5px",
    borderBottom: "1px solid #ccc",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default App;