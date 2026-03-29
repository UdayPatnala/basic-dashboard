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

  // Load JSON
  useEffect(() => {
    const formatted = tasksData.map((t, i) => ({
      id: Date.now() + i,
      text: t.Task,
      category: t.Category,
      date: t.Date,
      notes: "",
      completed: false
    }));
    setTasks(formatted);
  }, []);

  // Access screen
  if (!access) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.3)",
          backdropFilter: "blur(10px)",
          padding: "30px",
          borderRadius: "12px"
        }}>
          <h2>Enter Access Code</h2>
          <input value={enteredCode} onChange={(e)=>setEnteredCode(e.target.value)} />
          <button onClick={()=> {
            if(enteredCode === ACCESS_CODE) setAccess(true);
            else alert("Wrong Code");
          }}>Enter</button>
        </div>
      </div>
    );
  }

  // Add Task (AUTO DATE)
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

  // Edit
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

  // Filter logic
  const filteredTasks = tasks.filter(t => {
    const match = t.text.toLowerCase().includes(search.toLowerCase());

    if (t.date === selectedDate) return match;
    if (t.date < selectedDate && !t.completed) return match;

    return false;
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "12px"
      }}>

        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            placeholder="Search..."
            onChange={(e)=>setSearch(e.target.value)}
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e)=>setSelectedDate(e.target.value)}
          />
        </div>

        {/* Add/Edit */}
        <input value={task} onChange={(e)=>setTask(e.target.value)} placeholder="Task" />
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" />
        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} />

        {editId ? (
          <button onClick={updateTask}>Update</button>
        ) : (
          <button onClick={addTask}>Add</button>
        )}

        {/* Tasks */}
        {filteredTasks.map(t => (
          <div key={t.id}
            style={{
              background: "#fff",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
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

export default App;