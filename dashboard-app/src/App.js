import React, { useState, useEffect } from "react";
import tasksData from "./data/tasks.json";

function App() {
  const ACCESS_CODES = ["9703660750", "8639481969"]; // ✅ FIXED

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
  const [customCategory, setCustomCategory] = useState("");
  const [notes, setNotes] = useState("");

  const defaultCategories = ["Java", "DSA", "Web", "Project", "Tools"];

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

  useEffect(() => {
    if (!isGuest) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isGuest]);

  // LOGIN
  if (!access) {
    return (
      <div style={styles.center}>
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

          <button onClick={()=>{
            setAccess(true);
            setIsGuest(true);
          }}>
            Guest Mode
          </button>
        </div>
      </div>
    );
  }

  const uniqueCategories = [...new Set(tasks.map(t => t.category))];

  const finalCategory =
    category === "Other" ? customCategory : category;

  // ADD TASK
  const addTask = () => {
    if (!task || !finalCategory) return;

    setTasks([...tasks, {
      id: Date.now(),
      text: task,
      category: finalCategory,
      date: selectedDate,
      notes,
      completed: false
    }]);

    setTask("");
    setCategory("");
    setCustomCategory("");
    setNotes("");
  };

  // 🔥 FIXED FILTER (IMPORTANT)
  const filteredTasks = tasks.filter(t => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      t.text.toLowerCase().includes(searchText) ||
      t.category.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      t.category === categoryFilter;

    if (search.trim() !== "") {
      return matchesSearch && matchesCategory;
    }

    if (t.date === selectedDate && matchesCategory) return true;
    if (t.date < selectedDate && !t.completed && matchesCategory) return true;

    return false;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div>Results: {filteredTasks.length}</div>

        {/* TOP */}
        <div style={styles.row}>
          <input
            placeholder="Search..."
            onChange={(e)=>setSearch(e.target.value)}
          />

          {!isGuest && (
            <select onChange={(e)=>setCategoryFilter(e.target.value)}>
              <option>All</option>
              {uniqueCategories.map(c => <option key={c}>{c}</option>)}
            </select>
          )}

          <input
            type="date"
            value={selectedDate}
            onChange={(e)=>setSelectedDate(e.target.value)}
          />
        </div>

        {/* ADD */}
        <div style={styles.row}>
          <input
            value={task}
            onChange={(e)=>setTask(e.target.value)}
            placeholder="Task"
          />

          {isGuest ? (
            <input
              placeholder="Category"
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
            />
          ) : (
            <>
              <select
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
              >
                <option value="">Select</option>
                {defaultCategories.map(c => <option key={c}>{c}</option>)}
                <option>Other</option>
              </select>

              {category === "Other" && (
                <input
                  placeholder="Custom category"
                  value={customCategory}
                  onChange={(e)=>setCustomCategory(e.target.value)}
                />
              )}
            </>
          )}

          <button onClick={addTask}>Add</button>
        </div>

        {/* TASKS */}
        {filteredTasks.map(t => (
          <div key={t.id} style={styles.task}>
            {t.text}
            <div>{t.category} | {t.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "20px" },
  container: { maxWidth: "900px", margin: "auto" },
  row: { display: "flex", gap: "10px", marginBottom: "10px" },
  task: { background: "#fff", padding: "10px", margin: "10px 0" },
  center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#fff", padding: "20px" }
};

export default App;