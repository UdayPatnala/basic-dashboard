import React, { useState, useEffect, useMemo } from "react";
import tasksData from "./data/tasks.json";
import { Search, Plus, Calendar as CalendarIcon, CheckCircle2, Circle, LogOut, Briefcase, Code, Layout, Wrench, Folder } from "lucide-react";
import { format } from "date-fns";

// UI Components
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

import { Badge } from "./components/ui/badge";

// Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const ACCESS_CODES = ["9703660750", "8639481969"];

  const [enteredCode, setEnteredCode] = useState("");
  const [access, setAccess] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // actual search trigger

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const defaultCategories = [
    { name: "Java", icon: Code, color: "bg-orange-100 text-orange-700 border-orange-200" },
    { name: "DSA", icon: Briefcase, color: "bg-blue-100 text-blue-700 border-blue-200" },
    { name: "Web", icon: Layout, color: "bg-green-100 text-green-700 border-green-200" },
    { name: "Project", icon: Folder, color: "bg-purple-100 text-purple-700 border-purple-200" },
    { name: "Tools", icon: Wrench, color: "bg-slate-100 text-slate-700 border-slate-200" }
  ];

  // Professional background gradient instead of image
  const background = "bg-gradient-to-br from-slate-50 to-slate-100";

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
      completed: false,
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
            <div className="bg-indigo-600 h-2 w-full"></div>
            <CardHeader className="space-y-1 pb-8 pt-8">
              <CardTitle className="text-3xl font-bold text-center tracking-tight text-slate-900">TaskMaster Pro</CardTitle>
              <CardDescription className="text-center text-base">Enter your access code to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter Access Code"
                  className="h-12 text-center text-lg tracking-widest"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (ACCESS_CODES.includes(enteredCode)) {
                        setAccess(true);
                        setIsGuest(false);
                      } else alert("Invalid Code");
                    }
                  }}
                />
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-base font-medium"
                  onClick={() => {
                    if (ACCESS_CODES.includes(enteredCode)) {
                      setAccess(true);
                      setIsGuest(false);
                    } else alert("Invalid Code");
                  }}
                >
                  Authenticate
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue as</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={() => {
                    setAccess(true);
                    setIsGuest(true);
                  }}
                >
                  Guest User
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const finalCategory = category === "Other" ? customCategory : category;

  // ADD
  const addTask = () => {
    if (!task || !finalCategory) return;

    setTasks([
      {
        id: Date.now(),
        text: task,
        category: finalCategory,
        date: selectedDate,
        completed: false,
      },
      ...tasks,
    ]);

    setTask("");
    setCategory("");
    setCustomCategory("");
  };

  // TOGGLE STATUS
  const toggleStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // 🔍 SEARCH BUTTON ACTION
  const handleSearch = () => {
    setSearch(searchInput.toLowerCase());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleLogout = () => {
    setAccess(false);
    setEnteredCode("");
  };

  const getCategoryDetails = (catName) => {
    const found = defaultCategories.find(c => c.name === catName);
    if (found) return found;
    return { name: catName, icon: Folder, color: "bg-slate-100 text-slate-700 border-slate-200" };
  };

  // 🔥 FINAL FILTER LOGIC
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
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
  }, [tasks, search, selectedDate]);

  const completedCount = filteredTasks.filter(t => t.completed).length;
  const progress = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  return (
    <div className={`min-h-screen ${background} font-sans`}>
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CheckCircle2 className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">TaskMaster Pro</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-600 bg-slate-100 py-1.5 px-3 rounded-full flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              {isGuest ? "Guest Mode" : "Authenticated"}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Top Controls: Search & Date */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="md:col-span-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tasks, categories..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">Search</Button>
            {search && (
              <Button variant="outline" onClick={clearSearch}>Clear</Button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2 justify-end border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
            <CalendarIcon className="h-4 w-4 text-slate-500" />
            <Input
              type="date"
              className="w-auto border-0 bg-transparent font-medium text-slate-700 p-0 h-auto focus-visible:ring-0 shadow-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{filteredTasks.length}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-indigo-600">{progress}%</div>
                <div className="h-10 w-10 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeDasharray={`${progress}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Task List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {search ? "Search Results" : `Tasks for ${format(new Date(selectedDate), 'MMM do, yyyy')}`}
                <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 rounded-full px-2.5">
                  {filteredTasks.length}
                </Badge>
              </h2>
            </div>

            {filteredTasks.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <CheckCircle2 className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks found</h3>
                  <p className="text-slate-500 max-w-sm">
                    {search
                      ? "We couldn't find any tasks matching your search."
                      : "You have no tasks scheduled for this date. Enjoy your free time or add a new task!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence>
                <div className="space-y-3">
                  {filteredTasks.map((t) => {
                    const catDetails = getCategoryDetails(t.category);
                    const CatIcon = catDetails.icon;

                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`overflow-hidden transition-all duration-200 border-l-4 hover:shadow-md ${
                          t.completed
                            ? "border-l-green-500 bg-slate-50/50"
                            : t.date < selectedDate
                              ? "border-l-red-500"
                              : "border-l-indigo-500"
                        }`}>
                          <CardContent className="p-0">
                            <div className="flex items-center p-4 gap-4">
                              <button
                                onClick={() => toggleStatus(t.id)}
                                className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                              >
                                {t.completed ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                  <Circle className="h-6 w-6 text-slate-300 hover:text-indigo-500 transition-colors" />
                                )}
                              </button>

                              <div className="flex-grow min-w-0">
                                <p className={`text-base font-medium truncate transition-all duration-200 ${
                                  t.completed ? "text-slate-500 line-through" : "text-slate-900"
                                }`}>
                                  {t.text}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${catDetails.color}`}>
                                    <CatIcon className="h-3 w-3" />
                                    {t.category}
                                  </span>

                                  <span className={`flex items-center gap-1 ${
                                    t.date < selectedDate && !t.completed ? "text-red-600 font-medium" : "text-slate-500"
                                  }`}>
                                    <CalendarIcon className="h-3 w-3" />
                                    {t.date === selectedDate
                                      ? "Today"
                                      : format(new Date(t.date), 'MMM d, yyyy')}
                                    {t.date < selectedDate && !t.completed && " (Overdue)"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Add New Task Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5 text-indigo-600" />
                    Add New Task
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Task Description</label>
                    <Input
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="What needs to be done?"
                      className="bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addTask();
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    {isGuest ? (
                      <Input
                        placeholder="Type category..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white"
                      />
                    ) : (
                      <>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultCategories.map((c) => (
                              <SelectItem key={c.name} value={c.name}>
                                <div className="flex items-center gap-2">
                                  <c.icon className="h-4 w-4 text-slate-500" />
                                  {c.name}
                                </div>
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">
                              <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-slate-500" />
                                Custom...
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {category === "Other" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-2"
                          >
                            <Input
                              placeholder="Enter custom category name"
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              className="bg-white"
                            />
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    onClick={addTask}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700"
                    disabled={!task || (!category && !customCategory)}
                  >
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
