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

  // Notifications
  useEffect(() => {
    if ("Notification" in window) Notification.requestPermission();
  }, []);

  // Load + Save
  useEffect(() => {
    const saved = localStorage.getItem("tasks");

    if (saved) setTasks(JSON.parse(saved));
    else {
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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const notify = (msg) => {
    if (Notification.permission === "granted") {
      new Notification(msg);
    }
  };

  if (!access) {
    return (
      <div style={styles.center(bg)}>
        <div style={styles.card}>
          <h2>Enter Access Code</h2>
          <input value={enteredCode} onChange={(e)=>setEnteredCode(e.target.value)} />
          <button onClick={()=>{
            if(enteredCode === ACCESS_CODE) setAccess(true);
            else alert("Wrong Code");
          }}>Enter</button>
        </div>
      </div>
    );
  }

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

    notify("Task Added");
    setTask(""); setNotes("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    notify("Task Updated");
  };

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

  // Filter logic
  const filteredTasks = tasks.filter(t => {
    const match = t.text.toLowerCase().includes(search.toLowerCase());

    if (search.trim() !== "") return match;

    if (t.date === selectedDate) return true;
    if (t.date < selectedDate && !t.completed) return true;

    return false;
  });

  // 📊 Global Progress
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // 🔵 Daily Progress
  const dayTasks = tasks.filter(t => t.date === selectedDate);
  const dayCompleted = dayTasks.filter(t => t.completed).length;
  const dayPercent = dayTasks.length
    ? Math.round((dayCompleted / dayTasks.length) * 100)
    : 0;

  return (
    <div style={styles.page(bg)}>
      <div style={styles.container}>

        {/* Global Progress */}
        <div>
          <div>{completed}/{total} Completed</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${percent}%` }} />
          </div>
        </div>

        {/* Top Section */}
        <div style={styles.top}>
          <input placeholder="Search..." onChange={(e)=>setSearch(e.target.value)} />

          <input
            type="date"
            value={selectedDate}
            onChange={(e)=>setSelectedDate(e.target.value)}
          />

          {/* Daily Ring */}
          <div style={styles.ring(dayPercent)}>
            <div style={styles.innerRing}>{dayPercent}%</div>
          </div>
        </div>

        {/* Inputs */}
        <input value={task} onChange={(e)=>setTask(e.target.value)} placeholder="Task" />
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" />
        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} />

        <button onClick={editId ? updateTask : addTask}>
          {editId ? "Update" : "Add"}
        </button>

        {/* Tasks */}
        {filteredTasks.map(t => (
          <div key={t.id} style={styles.task}
            onClick={()=> setExpandedId(expandedId === t.id ? null : t.id)}
          >
            <div>{t.completed ? "✔️" : "⭕"} {t.text}</div>
            <div>{t.category} | {t.date}</div>

            {expandedId === t.id && <div>{t.notes}</div>}

            <button onClick={(e)=>{e.stopPropagation(); startEdit(t)}}>✏️</button>
            <button onClick={(e)=>{e.stopPropagation(); toggleComplete(t.id)}}>✔️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: (bg) => ({ minHeight: "100vh", backgroundImage: `url(${bg})`, backgroundSize: "cover", padding: "20px" }),

  container: { background: "rgba(255,255,255,0.3)", backdropFilter: "blur(10px)", padding: "20px", borderRadius: "12px", maxWidth: "800px", margin: "auto" },

  progressBar: { height: "10px", background: "#ccc", borderRadius: "5px" },
  progressFill: { height: "10px", background: "green", borderRadius: "5px" },

  top: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" },

  task: { background: "#fff", padding: "10px", margin: "10px 0", borderRadius: "10px" },

  ring: (percent) => ({
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: `conic-gradient(green ${percent * 3.6}deg, #ccc 0deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }),

  innerRing: {
    width: "50px",
    height: "50px",
    background: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  center: (bg) => ({ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundImage: `url(${bg})`, backgroundSize: "cover" }),
  card: { background: "rgba(255,255,255,0.3)", padding: "20px", borderRadius: "10px" }
};

export default App;