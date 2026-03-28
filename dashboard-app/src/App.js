import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
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

  const [plans, setPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // FETCH DATA
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

  // ADD PLAN (MANUAL ENTRY)
  const addSamplePlan = async () => {
    await addDoc(collection(db, "plans"), {
      userId: user.uid,
      date: "2026-04-09",
      day: "Wednesday",
      core: "Python Basics + SQL Intro",
      project: "Dashboard UI",
      dsa: "Arrays",
      github: "Create repo + commit",
      tools: "VS Code",
      completed: false,
    });
  };

  const toggleComplete = async (id, current) => {
    const ref = collection(db, "plans");
    await addDoc(ref, {
      completed: !current,
    });
  };

  const filtered = selectedDate
    ? plans.filter((p) => p.date === selectedDate)
    : plans;

  // AUTH UI
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login / Signup</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={() => signInWithEmailAndPassword(auth, email, password)}>Login</button>
        <button onClick={() => createUserWithEmailAndPassword(auth, email, password)}>Signup</button>
      </div>
    );
  }

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
          }}
        >
          <h3>{p.day} ({p.date})</h3>
          <p><b>Core:</b> {p.core}</p>
          <p><b>Project:</b> {p.project}</p>
          <p><b>DSA:</b> {p.dsa}</p>
          <p><b>GitHub:</b> {p.github}</p>
          <p><b>Tools:</b> {p.tools}</p>
        </div>
      ))}
    </div>
  );
}

export default App;