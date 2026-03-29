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
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: `conic-gradient(#4caf50 ${progress * 3.6}deg, #ddd 0deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    fontWeight: "bold",
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login / Signup</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            style={{ cursor: "pointer", marginLeft: "5px" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <br />

        <button onClick={() => signInWithEmailAndPassword(auth, email, password)}>
          Login
        </button>

        <button onClick={() => createUserWithEmailAndPassword(auth, email, password)}>
          Signup
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>📊 Productivity Dashboard</h1>

      <button onClick={() => signOut(auth)}>Logout</button>

      {/* Progress */}
      <div style={circleStyle}>{progress}%</div>

      {/* Inputs */}
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option>Work</option>
        <option>Study</option>
        <option>Personal</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <textarea
        placeholder="Notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={addTask}>Add</button>

      {/* Search */}
      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Completed</option>
        <option>Pending</option>
      </select>

      {/* Task List */}
      <ul>
        {filteredTasks.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggleComplete(t)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {t.completed ? "✔️" : "⭕"} {t.text}
            </span>

            <div>📂 {t.category} | 📅 {formatDate(t.date)}</div>
            <div>📝 {t.notes}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;