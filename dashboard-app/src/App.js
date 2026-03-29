import React, { useState, useEffect } from "react";
import tasksData from "./data/tasks.json";

function App() {
  const ACCESS_CODE = "5258745636951";

  const [enteredCode, setEnteredCode] = useState("");
  const [access, setAccess] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [expandedId, setExpandedId] = useState(null);

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Java");
  const [notes, setNotes] = useState("");

  const [editId, setEditId] = useState(null);

  const backgrounds = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];

  const [bg] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );

  // 🔥 LOAD FROM LOCAL STORAGE OR JSON
  useEffect(() => {
    const saved = localStorage.getItem("tasks");

    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const formatted = tasksData.map((t, i) => ({
        id: Date.now() + i,
        text: t.Task,
        category: t.Category,
        date: t.Date,
        notes: "",
        completed: false
      }));
      setTasks(formatted);
    }
  }, []);

  // 🔥 SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🔐 ACCESS SCREEN
  if (!access) {
    return (
      <div style={styles.centerScreen(bg)}>
        <div style={styles.glassCard}>
          <h2>Enter Access Code</h2>
          <input
            style={styles.input}
            value={enteredCode}
            onChange={(e)=>setEnteredCode(e.target.value)}
          />
          <button style={styles.button} onClick={()=>{
            if(enteredCode === ACCESS_CODE) setAccess(true);
            else alert("Wrong Code");
          }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ➕ Add Task
  const addTask = () => {
    if (!task) return;

    setTasks([...tasks, {
      id: Date.now(),
      text: task,
      category,
      date: selectedDate,
      notes,
      completed: false
    }]);

    setTask(""); setNotes("");
  };

  // ✏️ Edit
  const startEdit = (t) => {
    setTask(t.text);
    setCategory(t.category);
    setNotes(t.notes);
    setEditId(t.id);
  };

  const updateTask = () => {
    setTasks(tasks.map(t =>
      t.id === editId
        ? { ...t, text: task, category, notes, date: selectedDate }
        : t
    ));

    setEditId(null);
    setTask(""); setNotes("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // 🔍 SEARCH LOGIC
  const filteredTasks = tasks.filter(t => {
    const match = t.text.toLowerCase().includes(search.toLowerCase());

    if (search.trim() !== "") return match;

    if (t.date === selectedDate) return true;
    if (t.date < selectedDate && !t.completed) return true;

    return false;
  });

  return (
    <div style={styles.page(bg)}>
      <div style={styles.container}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <input
            style={styles.input}
            placeholder="Search..."
            onChange={(e)=>setSearch(e.target.value)}
          />

          <input
            style={styles.input}
            type="date"
            value={selectedDate}
            onChange={(e)=>setSelectedDate(e.target.value)}
          />
        </div>

        {/* Add/Edit */}
        <input style={styles.input} value={task} onChange={(e)=>setTask(e.target.value)} placeholder="Task" />
        <input style={styles.input} value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" />
        <textarea style={styles.input} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes"/>

        {editId ? (
          <button style={styles.button} onClick={updateTask}>Update</button>
        ) : (
          <button style={styles.button} onClick={addTask}>Add</button>
        )}

        {/* Tasks */}
        {filteredTasks.map(t => (
          <div key={t.id} style={styles.card}
            onClick={()=> setExpandedId(expandedId === t.id ? null : t.id)}
          >
            <div>
              {t.completed ? "✔️" : "⭕"} {t.text}
            </div>

            <div>{t.category} | {t.date}</div>

            {expandedId === t.id && (
              <div>{t.notes}</div>
            )}

            <button onClick={(e)=>{e.stopPropagation(); startEdit(t)}}>✏️</button>
            <button onClick={(e)=>{e.stopPropagation(); toggleComplete(t.id)}}>✔️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 STYLES (MOBILE RESPONSIVE)
const styles = {
  page: (bg) => ({
    minHeight: "100vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    padding: "10px"
  }),

  container: {
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    padding: "15px",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "auto"
  },

  topBar: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px"
  },

  card: {
    background: "#fff",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "10px"
  },

  centerScreen: (bg) => ({
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover"
  }),

  glassCard: {
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px"
  }
};

export default App;