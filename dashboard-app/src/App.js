import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
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

  const [plans, setPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // 🔐 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 🔥 FETCH USER PLANS (REAL-TIME)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "plans"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlans(data);
    });

    return () => unsubscribe();
  }, [user]);

  // ➕ ADD SAMPLE PLAN
  const addSamplePlan = async () => {
    await addDoc(collection(db, "plans"), {
      userId: user.uid,
      date: "2026-04-09",
      day: "Wednesday",
      tasks: {
        core: "Python Basics + SQL Intro",
        project: "Dashboard UI",
        dsa: "Arrays",
        github: "Create repo + commit",
        tools: "VS Code",
      },
      completed: false,
    });
  };

  // ✅ FIXED TOGGLE COMPLETE
  const toggleComplete = async (id, current) => {
    const ref = doc(db, "plans", id);

    await updateDoc(ref, {
      completed: !current,
    });
  };

  // 📅 FILTER BY DATE
  const filtered = selectedDate
    ? plans.filter((p) => p.date === selectedDate)
    : plans;

  // 🔐 AUTH UI
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login / Signup</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button
          onClick={() =>
            signInWithEmailAndPassword(auth, email, password)
          }
        >
          Login
        </button>

        <button
          onClick={() =>
            createUserWithEmailAndPassword(auth, email, password)
          }
        >
          Signup
        </button>
      </div>
    );
  }

  // 🎯 MAIN UI
  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Learning Dashboard</h1>

      <button onClick={() => signOut(auth)}>Logout</button>

      <br /><br />

      <button onClick={addSamplePlan}>Add Sample Plan</button>

      <br /><br />

      <input
        type="date"
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <h3>Plans</h3>

      {filtered.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            backgroundColor: p.completed ? "#d4edda" : "#f8f9fa",
          }}
        >
          <h3>
            {p.day} ({p.date})
          </h3>

          <p><b>Core:</b> {p.tasks.core}</p>
          <p><b>Project:</b> {p.tasks.project}</p>
          <p><b>DSA:</b> {p.tasks.dsa}</p>
          <p><b>GitHub:</b> {p.tasks.github}</p>
          <p><b>Tools:</b> {p.tasks.tools}</p>

          <button onClick={() => toggleComplete(p.id, p.completed)}>
            {p.completed ? "Undo" : "Mark Done"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;