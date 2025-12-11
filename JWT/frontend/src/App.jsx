import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [daysSinceIAte, setDaysSinceIAte] = useState("");
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      fetchFoods(token);
    }
  }, []);

  const fetchFoods = async (token) => {
    try {
      const response = await axios.get("http://localhost:5001/api/food", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(response.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/register", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setIsLogin(true);
      fetchFoods(response.data.token);

      alert("Registered successfully!");
    } catch (error) {
      console.log("Register error:", error);
      alert("Registration failed!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setIsLogin(true);
      fetchFoods(response.data.token);
    } catch (error) {
      console.log("Login error:", error);
      alert("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    setFoods([]);
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/food",
        {
          name,
          daysSinceIAte,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName("");
      setDaysSinceIAte("");
      fetchFoods(token);
    } catch (error) {
      console.log("Add food error:", error);
    }
  };

  if (!isLogin) {
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Add Food</h3>
      <form onSubmit={handleAddFood}>
        <input
          type="text"
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Days Since Ate"
          value={daysSinceIAte}
          onChange={(e) => setDaysSinceIAte(e.target.value)}
        />
        <button type="submit">Add Food</button>
      </form>

      <h3>Food List</h3>
      <ul>
        {foods.map((item) => (
          <li key={item._id}>
            {item.name} - {item.daysSinceIAte} days ago
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
