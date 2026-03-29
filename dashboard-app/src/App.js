import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection, addDoc, deleteDoc, doc, updateDoc,
  onSnapshot, query, where
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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

  const [editId, setEditId] = useState(null);
  const [bgImage, setBgImage] = useState("");

  const backgrounds = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];

  useEffect(() => {
    setBgImage(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
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

    setTask(""); setNotes(""); setDate("");
  };

  const updateTask = async () => {
    const ref = doc(db, "tasks", editId);

    await updateDoc(ref, {
      text: task,
      category,
      date,
      notes,
    });

    setEditId(null);
    setTask(""); setNotes(""); setDate("");
  };

  const startEdit = (t) => {
    setTask(t.text);
    setCategory(t.category);
    setDate(t.date);
    setNotes(t.notes);
    setEditId(t.id);
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
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
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
    transition: "0.3s"
  };

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)",
          padding: "30px",
          borderRadius: "12px",
          width: "300px",
          textAlign: "center"
        }}>
          <h2>Login</h2>

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
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.9)",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "700px",
        margin: "auto",
        position: "relative"
      }}>

        <h1>📊 Dashboard</h1>
        <button onClick={() => signOut(auth)}>Logout</button>

        {/* Progress Ring */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `conic-gradient(#4caf50 ${progress * 3.6}deg, #ddd 0deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {progress}%
          </div>
        </div>

        <input style={inputStyle} value={task} onChange={(e) => setTask(e.target.value)} placeholder="Task" />
        <select style={inputStyle} onChange={(e) => setCategory(e.target.value)}>
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
        </select>

        <input style={{ ...inputStyle, width: "50%" }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <textarea style={inputStyle} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {editId ? (
          <button style={buttonStyle} onClick={updateTask}>Update Task</button>
        ) : (
          <button style={buttonStyle} onClick={addTask}>Add Task</button>
        )}

        <input style={inputStyle} placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />

        {filteredTasks.map((t) => (
          <div key={t.id}
            style={{
              background: "#fff",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "10px",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div onClick={() => toggleComplete(t)}>
              {t.completed ? "✔️" : "⭕"} {t.text}
            </div>

            <div>{formatDate(t.date)}</div>
            <div>{t.notes}</div>

            <button onClick={() => startEdit(t)}>✏️</button>
            <button onClick={() => deleteTask(t.id)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;