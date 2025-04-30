import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login", {
        email,
        password,
      });

      const { user, accessToken } = response.data.data;
      login({ user, token: accessToken });
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      console.error("Login error:", message);
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-surface p-10 rounded-xl space-y-6 shadow-2xl border border-gray-700"
      >
        <h2 className="text-4xl font-heading text-primary font-bold text-center tracking-tight">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-background text-textPrimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-background text-textPrimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {error && <p className="text-danger text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary text-black py-3 rounded-lg font-semibold hover:bg-lime-400 transition shadow"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;
