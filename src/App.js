import "./storage";
import React, { useState, useEffect } from "react";
import {
  Camera,
  TrendingUp,
  Award,
  Calendar,
  UtensilsCrossed,
  Dumbbell,
  ChevronRight,
  Star,
  Flame,
  Trophy,
  Target,
  Plus,
  Upload,
  Play,
  Check,
  X,
} from "lucide-react";

const FitSensePro = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [showAuth, setShowAuth] = useState(true);
  const [authMode, setAuthMode] = useState("login");

  // Initialize with demo data
  useEffect(() => {
    const initDemoData = async () => {
      try {
        const storedUser = await window.storage.get("user");
        const storedWorkouts = await window.storage.get("workouts");
        const storedExercises = await window.storage.get("exercises");
        const storedMealPlan = await window.storage.get("mealPlan");

        if (storedUser) {
          setUser(JSON.parse(storedUser.value));
          setShowAuth(false);
        }
        if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts.value));
        if (storedExercises) setExercises(JSON.parse(storedExercises.value));
        if (storedMealPlan) setMealPlan(JSON.parse(storedMealPlan.value));
      } catch (error) {
        // First time user - show auth
        console.log("New user");
      }
    };

    initDemoData();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (authMode === "signup") {
      const name = formData.get("name");
      const age = formData.get("age");
      const goal = formData.get("goal");

      const newUser = {
        id: Date.now(),
        name,
        email,
        age: parseInt(age),
        goal,
        xp: 0,
        level: 1,
        streak: 0,
        badges: [],
        joinDate: new Date().toISOString(),
      };

      await window.storage.set("user", JSON.stringify(newUser));
      setUser(newUser);
      setShowAuth(false);

      // Generate initial meal plan
      generateMealPlan(newUser);
    } else {
      // Demo login
      const demoUser = {
        id: 1,
        name: "Demo User",
        email,
        age: 28,
        goal: "muscle_gain",
        xp: 2450,
        level: 5,
        streak: 12,
        badges: ["First Workout", "Week Warrior", "Form Master"],
        joinDate: new Date().toISOString(),
      };

      await window.storage.set("user", JSON.stringify(demoUser));
      setUser(demoUser);
      setShowAuth(false);
    }
  };

  const generateMealPlan = async (userData) => {
    const goals = {
      fat_loss: { calories: 1800, protein: 150, carbs: 150, fats: 60 },
      muscle_gain: { calories: 2800, protein: 200, carbs: 320, fats: 80 },
      maintenance: { calories: 2300, protein: 170, carbs: 230, fats: 75 },
    };

    const macros = goals[userData.goal] || goals.maintenance;

    const plan = {
      dailyCalories: macros.calories,
      macros,
      meals: [
        {
          name: "Breakfast",
          time: "8:00 AM",
          foods: ["Oatmeal with berries", "Greek yogurt", "Banana", "Almonds"],
          calories: Math.round(macros.calories * 0.25),
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          foods: [
            "Grilled chicken breast",
            "Brown rice",
            "Steamed broccoli",
            "Olive oil",
          ],
          calories: Math.round(macros.calories * 0.35),
        },
        {
          name: "Snack",
          time: "3:30 PM",
          foods: ["Protein shake", "Apple", "Peanut butter"],
          calories: Math.round(macros.calories * 0.15),
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          foods: [
            "Salmon fillet",
            "Sweet potato",
            "Mixed vegetables",
            "Avocado",
          ],
          calories: Math.round(macros.calories * 0.25),
        },
      ],
      groceryList: [
        "Oats",
        "Greek yogurt",
        "Berries",
        "Bananas",
        "Almonds",
        "Chicken breast",
        "Brown rice",
        "Broccoli",
        "Olive oil",
        "Protein powder",
        "Apples",
        "Peanut butter",
        "Salmon",
        "Sweet potatoes",
        "Mixed vegetables",
        "Avocado",
      ],
    };

    await window.storage.set("mealPlan", JSON.stringify(plan));
    setMealPlan(plan);
  };

  const analyzeWorkout = async (exerciseName, formData) => {
    // Simulate AI analysis
    const variations = {
      "Bench Press": [
        "Flat Bench",
        "Incline Bench",
        "Decline Bench",
        "Close-Grip",
        "Wide-Grip",
      ],
      "Pull-ups": [
        "Standard",
        "Wide-Grip",
        "Close-Grip",
        "Neutral-Grip",
        "Archer",
      ],
      Squats: [
        "Back Squat",
        "Front Squat",
        "Goblet",
        "Bulgarian Split",
        "Pistol",
      ],
      Deadlift: ["Conventional", "Sumo", "Romanian", "Trap Bar", "Single-Leg"],
    };

    const feedback = {
      exercise: exerciseName,
      variation: formData.variation || "Standard",
      musclesTargeted: ["Chest", "Triceps", "Shoulders"],
      formScore: Math.floor(Math.random() * 30) + 70,
      feedback: [
        "Good depth on reps",
        "Keep elbows at 45° angle",
        "Slight arch in lower back detected - maintain neutral spine",
      ],
      riskLevel: "Low",
      suggestions: variations[exerciseName] || [
        "Try different grips",
        "Adjust tempo",
        "Add pauses",
      ],
      difficulty: formData.difficulty || "Intermediate",
      xpEarned: 50,
    };

    // Update user XP
    const updatedUser = { ...user, xp: user.xp + feedback.xpEarned };
    if (updatedUser.xp >= updatedUser.level * 500) {
      updatedUser.level += 1;
      updatedUser.badges.push(`Level ${updatedUser.level} Warrior`);
    }

    await window.storage.set("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    return feedback;
  };

  const logWorkout = async (workoutData) => {
    const newWorkout = {
      id: Date.now(),
      date: new Date().toISOString(),
      exercises: workoutData.exercises,
      totalVolume: workoutData.exercises.reduce(
        (sum, ex) => sum + ex.sets * ex.reps * (ex.weight || 0),
        0
      ),
      duration: workoutData.duration || 60,
      rpe: workoutData.rpe || 7,
      notes: workoutData.notes || "",
    };

    const updatedWorkouts = [...workouts, newWorkout];
    await window.storage.set("workouts", JSON.stringify(updatedWorkouts));
    setWorkouts(updatedWorkouts);

    // Update streak
    const updatedUser = { ...user, streak: user.streak + 1, xp: user.xp + 100 };
    await window.storage.set("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Dumbbell className="w-16 h-16 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FitSense Pro</h1>
            <p className="text-gray-400">AI-Powered Fitness Companion</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                authMode === "login"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                authMode === "signup"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
                <select
                  name="goal"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select Goal</option>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
            >
              {authMode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">FitSense Pro</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-full border border-purple-500/30">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-semibold">{user?.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-full border border-blue-500/30">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Level {user?.level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "analyze", label: "Analyze", icon: Camera },
              { id: "workouts", label: "Workouts", icon: Dumbbell },
              { id: "progress", label: "Progress", icon: Award },
              { id: "diet", label: "Diet Plan", icon: UtensilsCrossed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-purple-600/30 text-white border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <Dashboard user={user} workouts={workouts} mealPlan={mealPlan} />
        )}
        {activeTab === "analyze" && (
          <AnalyzeWorkout analyzeWorkout={analyzeWorkout} />
        )}
        {activeTab === "workouts" && (
          <WorkoutLog workouts={workouts} logWorkout={logWorkout} />
        )}
        {activeTab === "progress" && (
          <Progress user={user} workouts={workouts} />
        )}
        {activeTab === "diet" && <DietPlan mealPlan={mealPlan} />}
      </main>
    </div>
  );
};

const Dashboard = ({ user, workouts, mealPlan }) => {
  const weeklyVolume = workouts
    .slice(-7)
    .reduce((sum, w) => sum + w.totalVolume, 0);
  const xpToNextLevel = user.level * 500;
  const xpProgress = ((user.xp % 500) / 500) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 border border-purple-400/30">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-300" />
            <span className="text-2xl font-bold">{user.xp}</span>
          </div>
          <p className="text-purple-200">Total XP</p>
          <div className="mt-4 bg-purple-900/50 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-xs text-purple-200 mt-2">
            {Math.round(500 - (user.xp % 500))} XP to Level {user.level + 1}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 border border-blue-400/30">
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="w-8 h-8 text-blue-200" />
            <span className="text-2xl font-bold">{workouts.length}</span>
          </div>
          <p className="text-blue-200">Total Workouts</p>
          <p className="text-xs text-blue-200 mt-2">Keep crushing it!</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 border border-orange-400/30">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-8 h-8 text-orange-200" />
            <span className="text-2xl font-bold">{user.streak}</span>
          </div>
          <p className="text-orange-200">Day Streak</p>
          <p className="text-xs text-orange-200 mt-2">Don't break the chain!</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 border border-green-400/30">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <span className="text-2xl font-bold">{user.badges.length}</span>
          </div>
          <p className="text-green-200">Badges Earned</p>
          <p className="text-xs text-green-200 mt-2">Collect them all!</p>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/30">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Today's Workout
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="font-semibold text-lg">Upper Body Power</p>
              <p className="text-sm text-gray-400">4 exercises • 45 min</p>
              <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Workout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/30">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-green-400" />
            Today's Nutrition
          </h2>
          {mealPlan && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Calories</span>
                <span className="font-bold text-lg">
                  {mealPlan.dailyCalories} kcal
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Protein</span>
                <span className="font-semibold">
                  {mealPlan.macros.protein}g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Carbs</span>
                <span className="font-semibold">{mealPlan.macros.carbs}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fats</span>
                <span className="font-semibold">{mealPlan.macros.fats}g</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Recent Badges
        </h2>
        <div className="flex flex-wrap gap-3">
          {user.badges.map((badge, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl px-4 py-3 border border-yellow-400/30 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyzeWorkout = ({ analyzeWorkout }) => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const exercises = [
    "Bench Press",
    "Pull-ups",
    "Squats",
    "Deadlift",
    "Overhead Press",
    "Rows",
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);

    const formData = new FormData(e.target);
    const data = {
      variation: formData.get("variation"),
      sets: formData.get("sets"),
      reps: formData.get("reps"),
      weight: formData.get("weight"),
      difficulty: formData.get("difficulty"),
    };

    setTimeout(async () => {
      const result = await analyzeWorkout(selectedExercise, data);
      setAnalysis(result);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Camera className="w-8 h-8 text-purple-400" />
          Analyze Your Workout
        </h2>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Exercise</label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select Exercise</option>
              {exercises.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Sets</label>
              <input
                type="number"
                name="sets"
                min="1"
                defaultValue="3"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Reps</label>
              <input
                type="number"
                name="reps"
                min="1"
                defaultValue="10"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                name="weight"
                min="0"
                defaultValue="135"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Variation (Optional)
            </label>
            <input
              type="text"
              name="variation"
              placeholder="e.g., Wide-grip, Incline, etc."
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing || !selectedExercise}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Analyze Form
              </>
            )}
          </button>
        </form>

        {analysis && (
          <div className="mt-8 space-y-4 animate-fadeIn">
            <div className="bg-green-600/20 rounded-lg p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Analysis Results</h3>
                <div className="bg-green-600 px-4 py-2 rounded-full font-bold text-lg">
                  +{analysis.xpEarned} XP
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Form Score</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all"
                        style={{ width: `${analysis.formScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-lg">
                      {analysis.formScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Muscles Targeted</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.musclesTargeted.map((muscle, i) => (
                      <span
                        key={i}
                        className="bg-purple-600/30 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Feedback</p>
                  <div className="space-y-2">
                    {analysis.feedback.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 bg-gray-700/50 p-3 rounded-lg"
                      >
                        {item.includes("Good") || item.includes("Great") ? (
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Suggested Variations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.suggestions.map((suggestion, i) => (
                      <span
                        key={i}
                        className="bg-blue-600/30 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-gray-400">Risk Level</span>
                  <span
                    className={`font-bold ${
                      analysis.riskLevel === "Low"
                        ? "text-green-400"
                        : analysis.riskLevel === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {analysis.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkoutLog = ({ workouts, logWorkout }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [exercises, setExercises] = useState([
    { name: "", sets: 3, reps: 10, weight: 0 },
  ]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10, weight: 0 }]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    logWorkout({
      exercises: exercises.filter((ex) => ex.name),
      duration: parseInt(formData.get("duration")),
      rpe: parseInt(formData.get("rpe")),
      notes: formData.get("notes"),
    });

    setShowAddModal(false);
    setExercises([{ name: "", sets: 3, reps: 10, weight: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout History</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Workout
        </button>
      </div>

      <div className="grid gap-4">
        {workouts
          .slice()
          .reverse()
          .map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-bold">
                    {new Date(workout.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-400">
                    {workout.duration} minutes • RPE: {workout.rpe}/10
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">
                    {workout.totalVolume.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Total Volume (lbs)</p>
                </div>
              </div>

              <div className="space-y-2">
                {workout.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className="bg-gray-700/50 rounded-lg p-3 flex justify-between items-center"
                  >
                    <span className="font-semibold">{exercise.name}</span>
                    <span className="text-sm text-gray-400">
                      {exercise.sets} × {exercise.reps} @ {exercise.weight} lbs
                    </span>
                  </div>
                ))}
              </div>

              {workout.notes && (
                <p className="mt-4 text-sm text-gray-400 italic">
                  {workout.notes}
                </p>
              )}
            </div>
          ))}

        {workouts.length === 0 && (
          <div className="bg-gray-800/50 rounded-xl p-12 border border-purple-500/30 text-center">
            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-400 mb-2">
              No workouts logged yet
            </p>
            <p className="text-gray-500">
              Start your fitness journey by logging your first workout!
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-6">Log Workout</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Exercises</h4>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Exercise
                  </button>
                </div>

                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) => {
                          const newExercises = [...exercises];
                          newExercises[index].name = e.target.value;
                          setExercises(newExercises);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(index)}
                          className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Sets
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[index].sets = parseInt(e.target.value);
                            setExercises(newExercises);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Reps
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[index].reps = parseInt(e.target.value);
                            setExercises(newExercises);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Weight
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.weight}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[index].weight = parseInt(
                              e.target.value
                            );
                            setExercises(newExercises);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    defaultValue="60"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    RPE (1-10)
                  </label>
                  <input
                    type="number"
                    name="rpe"
                    min="1"
                    max="10"
                    defaultValue="7"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="How did the workout feel?"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Progress = ({ user, workouts }) => {
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];

    const dayWorkouts = workouts.filter(
      (w) => w.date.split("T")[0] === dateStr
    );

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      volume: dayWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
    };
  });

  const maxVolume = Math.max(...weeklyData.map((d) => d.volume), 1);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold mb-6">Your Progress</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
            <p className="text-sm text-gray-400 mb-1">Level</p>
            <p className="text-4xl font-bold">{user.level}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
            <p className="text-sm text-gray-400 mb-1">Total XP</p>
            <p className="text-4xl font-bold">{user.xp.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
            <p className="text-sm text-gray-400 mb-1">Workouts</p>
            <p className="text-4xl font-bold">{workouts.length}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Weekly Volume</h3>
          <div className="flex items-end justify-between gap-2 h-64 bg-gray-900/50 rounded-xl p-6">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gray-700 rounded-t-lg relative overflow-hidden"
                  style={{ height: "100%" }}
                >
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(data.volume / maxVolume) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 font-semibold">
                  {data.day}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.badges.map((badge, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30 flex items-center gap-3"
            >
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="font-bold">{badge}</p>
                <p className="text-xs text-gray-400">Unlocked</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DietPlan = ({ mealPlan }) => {
  if (!mealPlan) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-12 border border-purple-500/30 text-center">
        <UtensilsCrossed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-400">
          No meal plan available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <UtensilsCrossed className="w-8 h-8 text-green-400" />
          Your Personalized Meal Plan
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-4 border border-green-500/30 text-center">
            <p className="text-sm text-gray-400 mb-1">Daily Calories</p>
            <p className="text-2xl font-bold">{mealPlan.dailyCalories}</p>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-xl p-4 border border-red-500/30 text-center">
            <p className="text-sm text-gray-400 mb-1">Protein</p>
            <p className="text-2xl font-bold">{mealPlan.macros.protein}g</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 text-center">
            <p className="text-sm text-gray-400 mb-1">Carbs</p>
            <p className="text-2xl font-bold">{mealPlan.macros.carbs}g</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30 text-center">
            <p className="text-sm text-gray-400 mb-1">Fats</p>
            <p className="text-2xl font-bold">{mealPlan.macros.fats}g</p>
          </div>
        </div>

        <div className="space-y-4">
          {mealPlan.meals.map((meal, i) => (
            <div key={i} className="bg-gray-700/50 rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold">{meal.name}</h3>
                  <p className="text-sm text-gray-400">{meal.time}</p>
                </div>
                <span className="bg-purple-600/30 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/30">
                  {meal.calories} cal
                </span>
              </div>
              <ul className="space-y-1">
                {meal.foods.map((food, j) => (
                  <li key={j} className="text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    {food}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-4">Grocery List</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mealPlan.groceryList.map((item, i) => (
            <div
              key={i}
              className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FitSensePro;
