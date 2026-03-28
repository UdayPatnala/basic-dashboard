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

  // 🔥 FETCH DATA
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

  // 🚀 BULK UPLOAD FROM EXCEL DATA
  const uploadFullPlan = async () => {
    const plans = [
      {
        date: "2026-04-08",
        day: "Wednesday",
        tasks: {
          core: "Python Basics + SQL Intro + Git basics",
          project: "Dashboard basic UI",
          dsa: "Arrays in Java",
          github: "Create repo + first commit",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-09",
        day: "Thursday",
        tasks: {
          core: "If-Else + SQL SELECT",
          project: "Add input field",
          dsa: "Array problems",
          github: "Push code + Update README",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-10",
        day: "Friday",
        tasks: {
          core: "Loops + SQL ORDER",
          project: "Display tasks",
          dsa: "String problems",
          github: "Commit changes + Update README",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-11",
        day: "Saturday",
        tasks: {
          core: "Functions + SQL Aggregates",
          project: "Task add logic",
          dsa: "2 Java problems",
          github: "Push + Update README",
          tools: "VS Code + Excel + PowerPoint",
        },
      },
      {
        date: "2026-04-12",
        day: "Sunday",
        tasks: {
          core: "MS Office Practice",
          project: "Docs formatting",
          dsa: "Light practice",
          github: "Optional commit",
          tools: "MS Word/Excel/PPT",
        },
      },
      {
        date: "2026-04-13",
        day: "Monday",
        tasks: {
          core: "Dict + SQL JOIN",
          project: "Improve UI",
          dsa: "Map/Set problems",
          github: "Push + Update README",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-14",
        day: "Tuesday",
        tasks: {
          core: "Revision",
          project: "Fix bugs",
          dsa: "Practice",
          github: "Commit + Update README",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-15",
        day: "Wednesday",
        tasks: {
          core: "Arrays + File Handling",
          project: "Save tasks",
          dsa: "Array practice",
          github: "Push + Update README",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-16",
        day: "Thursday",
        tasks: {
          core: "Strings + Subqueries",
          project: "Improve UI",
          dsa: "String problems",
          github: "Commit + Update README",
          tools: "VS Code",
        },
      },
      {
        date: "2026-04-17",
        day: "Friday",
        tasks: {
          core: "Stack + OOP",
          project: "Add stack logic",
          dsa: "Stack implementation",
          github: "Push + Update README",
          tools: "VS Code",
        },
      }
    ];

    for (let plan of plans) {
      await addDoc(collection(db, "plans"), {
        userId: user.uid,
        ...plan,
        completed: false,
      });
    }

    alert("Plans uploaded successfully 🚀");
  };

  // ✅ TOGGLE COMPLETE
  const toggleComplete = async (id, current) => {
    const ref = doc(db, "plans", id);
    await updateDoc(ref, {
      completed: !current,
    });
  };

  // 📅 FILTER
  const filtered = selectedDate
    ? plans.filter((p) => p.date === selectedDate)
    : plans;

  // 🔐 AUTH UI
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login / Signup</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <br />

        <button onClick={() => signInWithEmailAndPassword(auth, email, password)}>Login</button>
        <button onClick={() => createUserWithEmailAndPassword(auth, email, password)}>Signup</button>
      </div>
    );
  }

  // 🎯 UI
  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Learning Dashboard</h1>

      <button onClick={() => signOut(auth)}>Logout</button>

      <br /><br />

      <button onClick={uploadFullPlan}>Upload Full Plan</button>

      <br /><br />

      <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />

      <h3>Plans</h3>

      {filtered.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px 0",
            backgroundColor: p.completed ? "#d4edda" : "#f8f9fa",
          }}
        >
          <h3>{p.day} ({p.date})</h3>

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