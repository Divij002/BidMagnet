import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8000/api/v1/users/register", {
        name,
        email,
        password,
      });

      navigate("/signin");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      console.error("Registration error:", message);
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-surface p-8 rounded-lg space-y-6 shadow-xl"
      >
        <h2 className="text-3xl font-heading text-primary font-bold text-center">
          Create Your Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none"
        />

        {error && <p className="text-danger text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary text-black py-3 rounded font-semibold hover:bg-lime-400 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
