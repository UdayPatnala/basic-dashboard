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
  // 🔐 Auth states
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 📊 Dashboard states
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Real-time user-specific tasks
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔐 SIGNUP
  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Enter a valid email (example@gmail.com)");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful ✅");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful ✅");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔐 LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  // ➕ Add Task
  const addTask = async () => {
    if (task.trim() === "") return;

    await addDoc(collection(db, "tasks"), {
      text: task,
      completed: false,
      category,
      userId: user.uid,
    });

    setTask("");
  };

  // ❌ Delete Task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // ✅ Toggle Complete
  const toggleComplete = async (taskItem) => {
    const taskRef = doc(db, "tasks", taskItem.id);

    await updateDoc(taskRef, {
      completed: !taskItem.completed,
    });
  };

  // 🎨 Category Colors
  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Work":
        return "#007bff";
      case "Study":
        return "green";
      case "Personal":
        return "orange";
      default:
        return "gray";
    }
  };

  // 🔍 Filter + Search
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.text
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "Completed") return t.completed && matchesSearch;
    if (filter === "Pending") return !t.completed && matchesSearch;

    return matchesSearch;
  });

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  // 🔐 AUTH UI
  if (!user) {
    return (
      <div style={styles.authContainer}>
        <h2>🔐 Login / Signup</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.btn}>
          Login
        </button>

        <button onClick={handleSignup} style={styles.btn}>
          Signup
        </button>
      </div>
    );
  }

  // 🔥 DASHBOARD UI
  return (
    <div
      style={{
        ...styles.container,
        ...(darkMode ? styles.dark : styles.light),
      }}
    >
      <h1>📊 Productivity Dashboard</h1>

      <button onClick={handleLogout} style={styles.btn}>
        Logout
      </button>

      <button onClick={() => setDarkMode(!darkMode)} style={styles.btn}>
        Toggle Theme
      </button>

      {/* INPUT */}
      <div style={styles.inputContainer}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      {/* SEARCH + FILTER */}
      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Completed</option>
        <option>Pending</option>
      </select>

      {/* STATS */}
      <p>Progress: {progress}%</p>

      {/* TASK LIST */}
      <ul>
        {filteredTasks.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggleComplete(t)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {t.text}
            </span>

            <span style={{ marginLeft: "10px", color: getCategoryColor(t.category) }}>
              [{t.category}]
            </span>

            <button onClick={() => deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
  authContainer: {
    textAlign: "center",
    marginTop: "100px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
  },
  btn: {
    margin: "5px",
    padding: "10px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  light: {
    backgroundColor: "#fff",
    color: "#000",
  },
  dark: {
    backgroundColor: "#121212",
    color: "#fff",
  },
};

export default App;