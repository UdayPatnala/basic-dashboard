import React, { useState, useEffect } from "react";
import tasksData from "./data/tasks.json";

function App() {
  const ACCESS_CODES = ["5258745636951", "9703660750", "8639481969"];

  const [enteredCode, setEnteredCode] = useState("");
  const [access, setAccess] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const defaultCategories = ["Java", "DSA", "Web", "Project", "Tools"];

  const backgrounds = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];

  const [bg] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );

  // LOAD
  useEffect(() => {
    if (isGuest) {
      setTasks([]);
      return;
    }

    const saved = localStorage.getItem("tasks");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) setTasks(parsed);
      else loadJSON();
    } else {
      loadJSON();
    }
  }, [isGuest]);

  const loadJSON = () => {
    const formatted = tasksData.map((t, i) => ({
      id: Date.now() + i,
      text: t.Task,
      category: t.Category,
      date: t.Date,
      notes: "",
      completed: false
    }));
    setTasks(formatted);
  };

  // SAVE
  useEffect(() => {
    if (!isGuest) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isGuest]);

  // LOGIN
  if (!access) {
    return (
      <div style={styles.center(bg)}>
        <div style={styles.card}>
          <h2>Enter Access Code</h2>
          <input value={enteredCode} onChange={(e)=>setEnteredCode(e.target.value)} />

          <button onClick={()=>{
            if (ACCESS_CODES.includes(enteredCode)) {
              setAccess(true);
              setIsGuest(false);
            } else alert("Invalid Code");
          }}>
            Enter
          </button>

          <hr />

          <button onClick={()=>{
            setAccess(true);
            setIsGuest(true);
          }}>
            Continue as Guest
          </button>
        </div>
      </div>
    );
  }

  // CATEGORY DATA
  const uniqueCategories = [...new Set(tasks.map(t => t.category))];
  const customCategories = uniqueCategories.filter(c => !defaultCategories.includes(c));

  // ADD
  const addTask = () => {
    if (!task || !category) return;

    setTasks([...tasks, {
      id: Date.now(),
      text: task,
      category,
      date: selectedDate,
      notes,
      completed: false
    }]);

    setTask(""); setCategory(""); setNotes("");
  };

  // 🔥 FIXED SEARCH LOGIC
  const filteredTasks = tasks.filter(t => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      t.text.toLowerCase().includes(searchText) ||
      t.category.toLowerCase().includes(searchText);

    // 👉 SEARCH = GLOBAL (ignore date)
    if (search.trim() !== "") {
      if (isGuest) return matchesSearch;

      const categoryMatch =
        categoryFilter === "All" ||
        (categoryFilter === "Other"
          ? customCategories.includes(t.category)
          : t.category === categoryFilter);

      return matchesSearch && categoryMatch;
    }

    // 👉 NORMAL MODE (date filter)
    if (t.date === selectedDate) return true;
    if (t.date < selectedDate && !t.completed) return true;

    return false;
  });

  // PROGRESS
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const dayTasks = tasks.filter(t => t.date === selectedDate);
  const dayCompleted = dayTasks.filter(t => t.completed).length;
  const dayPercent = dayTasks.length
    ? Math.round((dayCompleted / dayTasks.length) * 100)
    : 0;

  return (
    <div style={styles.page(bg)}>
      <div style={styles.container}>

        {isGuest && <div style={{color:"red"}}>Guest Mode</div>}

        {/* RESULT COUNT */}
        <div>Results: {filteredTasks.length}</div>

        {/* PROGRESS */}
        <div>{completed}/{total}</div>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width:`${percent}%`}} />
        </div>

        {/* TOP */}
        <div style={styles.top}>
          <input placeholder="Search..." onChange={(e)=>setSearch(e.target.value)} />

          {/* ❌ REMOVE FILTER IN GUEST */}
          {!isGuest && (
            <select onChange={(e)=>setCategoryFilter(e.target.value)}>
              <option>All</option>
              {defaultCategories.map(c => <option key={c}>{c}</option>)}
              <option>Other</option>
            </select>
          )}

          <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} />

          <div style={styles.ring(dayPercent)}>
            <div style={styles.innerRing}>{dayPercent}%</div>
          </div>
        </div>

        {/* INPUT */}
        <input value={task} onChange={(e)=>setTask(e.target.value)} placeholder="Task" />

        {isGuest ? (
          <input placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} />
        ) : (
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">Select</option>
            {defaultCategories.map(c => <option key={c}>{c}</option>)}
            {customCategories.map(c => <option key={c}>{c}</option>)}
          </select>
        )}

        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} />

        <button onClick={addTask}>Add</button>

        {/* TASKS */}
        {filteredTasks.map(t => (
          <div key={t.id} style={styles.task}>
            {t.completed ? "✔️" : "⭕"} {t.text}
            <div>{t.category} | {t.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: (bg) => ({
    minHeight: "100vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    padding: "20px"
  }),

  container: {
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "auto"
  },

  progressBar: { height:"10px", background:"#ccc" },
  progressFill: { height:"10px", background:"green" },

  top: { display:"flex", gap:"10px", flexWrap:"wrap" },

  task: { background:"#fff", padding:"10px", margin:"10px 0", borderRadius:"10px" },

  ring: (p)=>({
    width:"70px",
    height:"70px",
    borderRadius:"50%",
    background:`conic-gradient(green ${p*3.6}deg,#ccc 0)`,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }),

  innerRing:{ background:"#fff", padding:"10px", borderRadius:"50%" },

  center:(bg)=>({
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    backgroundImage:`url(${bg})`,
    backgroundSize:"cover"
  }),

  card:{ background:"#fff", padding:"20px", borderRadius:"10px" }
};

export default App;