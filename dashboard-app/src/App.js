import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // 🔥 Random Background Images
  const backgrounds = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(loaded);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (task.trim() === "") return;

    await addDoc(collection(db, "tasks"), {
      text: task,
      completed: false,
      category,
      date,
      notes,
      userId: user.uid,
    });

    setTask("");
    setNotes("");
    setDate("");
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (t) => {
    const ref = doc(db, "tasks", t.id);
    await updateDoc(ref, { completed: !t.completed });
  };

  const filteredTasks = tasks.filter((t) => {
    const match = t.text.toLowerCase().includes(search.toLowerCase());
    if (filter === "Completed") return t.completed && match;
    if (filter === "Pending") return !t.completed && match;
    return match;
  });

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const circleStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: `conic-gradient(#4caf50 ${progress * 3.6}deg, #e0e0e0 0deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    fontWeight: "bold",
    fontSize: "18px",
  };

  const inputStyle = {
    padding: "10px",
    margin: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
  };

  const buttonStyle = {
    padding: "10px",
    margin: "5px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "white",
    cursor: "pointer",
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login / Signup</h2>

        <input style={inputStyle} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <div>
          <input
            style={inputStyle}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button style={buttonStyle} onClick={() => signInWithEmailAndPassword(auth, email, password)}>Login</button>
        <button style={buttonStyle} onClick={() => createUserWithEmailAndPassword(auth, email, password)}>Signup</button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${randomBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "700px",
        margin: "auto"
      }}>

        <h1 style={{ textAlign: "center" }}>📊 Productivity Dashboard</h1>

        <button style={buttonStyle} onClick={() => signOut(auth)}>Logout</button>

        <div style={circleStyle}>{progress}%</div>

        <input style={inputStyle} value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter task" />

        <select style={inputStyle} onChange={(e) => setCategory(e.target.value)}>
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
        </select>

        <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <textarea style={inputStyle} placeholder="Notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />

        <button style={buttonStyle} onClick={addTask}>Add Task</button>

        <input style={inputStyle} placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />

        <select style={inputStyle} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

        {filteredTasks.map((t) => (
          <div key={t.id} style={{
            background: "#fff",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <div
              onClick={() => toggleComplete(t)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {t.completed ? "✔️" : "⭕"} {t.text}
            </div>

            <div>📂 {t.category} | 📅 {formatDate(t.date)}</div>
            <div>📝 {t.notes}</div>

            <button style={{ ...buttonStyle, backgroundColor: "#f44336" }} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;