import React, { useState, useEffect } from "react";
import tasksData from "./data/tasks.json";

function App() {
  const ACCESS_CODES = ["9703660750", "8639481969"];

  const [enteredCode, setEnteredCode] = useState("");
  const [access, setAccess] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // actual search trigger

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [notes, setNotes] = useState("");

  const defaultCategories = ["Java", "DSA", "Web", "Project", "Tools"];

  // 🔥 FIXED BACKGROUND
  const background =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

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
      <div style={styles.center(background)}>
        <div style={styles.card}>
          <h2>Enter Access Code</h2>

          <input
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
          />

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

  const finalCategory =
    category === "Other" ? customCategory : category;

  // ADD
  const addTask = () => {
    if (!task || !finalCategory) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        category: finalCategory,
        date: selectedDate,
        notes,
        completed: false
      }
    ]);

    setTask("");
    setCategory("");
    setCustomCategory("");
    setNotes("");
  };

  // 🔍 SEARCH BUTTON ACTION
  const handleSearch = () => {
    setSearch(searchInput.toLowerCase());
  };

  // 🔥 FINAL FILTER LOGIC
  const filteredTasks = tasks.filter((t) => {
    if (search) {
      return (
        t.text.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search)
      );
    }

    if (t.date === selectedDate) return true;
    if (t.date < selectedDate && !t.completed) return true;

    return false;
  });

  return (
    <div style={styles.page(background)}>
      <div style={styles.container}>

        {/* RESULT COUNT */}
        {search && <div>Results: {filteredTasks.length}</div>}

        {/* TOP */}
        <div style={styles.row}>
          <input
            placeholder="Search task or category..."
            value={searchInput}
            onChange={(e)=>setSearchInput(e.target.value)}
          />

          <button onClick={handleSearch}>Search</button>

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
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <div key={t.id} style={styles.task}>
              {t.text}
              <div>{t.category} | {t.date}</div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "500", color: "#333" }}>
              {search ? "No tasks found matching your search." : "No tasks found for this date."}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {!search && "Use the form above to add a new task and get started!"}
            </div>
          </div>
        )}
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
    padding: "20px"
  }),

  container: {
    maxWidth: "900px",
    margin: "auto",
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "10px"
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px"
  },

  task: {
    background: "#fff",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px"
  },

  emptyState: {
    background: "#fff",
    padding: "30px 20px",
    margin: "10px 0",
    textAlign: "center",
    borderRadius: "8px"
  },

  center: (bg) => ({
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover"
  }),

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px"
  }
};

export default App;
