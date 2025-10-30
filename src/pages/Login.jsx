import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import lpgImage from "../assets/lpg.png";

function Login() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("customer");
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setIsSignUp(false);
    setMessage("");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { name, email, password, confirm } = formData;

    try {
      if (isSignUp && activeRole === "customer") {
        if (password !== confirm) throw new Error("Passwords do not match");

        // Create customer in Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save customer data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          role: activeRole,
          createdAt: new Date(),
        });

        setMessage("Account created successfully!");
        navigate("/dashboard"); // Redirect after signup
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password);

        // Redirect based on role
        if (activeRole === "customer") navigate("/dashboard");
        else if (activeRole === "driver") navigate("/driver");
        else if (activeRole === "admin") navigate("/admin");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section - Image */}
      <div className="relative  md:w-1/2 h-screen">
        <img
          src={lpgImage}
          alt="Cylinder Track"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 ">
          <h1 className="text-white text-5xl font-extrabold mb-3 tracking-tight drop-shadow-lg">
            CylinderTrack
          </h1>
          <p className="text-gray-200 text-lg max-w-md">
            Smart LPG management made simple, transparent, and secure.
          </p>
        </div>
      </div>

      {/* Right Section - Login / Signup */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Role Tabs */}
          <div className="flex justify-between mb-6 border-b border-gray-200">
            {["customer", "driver", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-1/3 py-2 font-semibold capitalize ${
                  activeRole === role
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isSignUp && activeRole === "customer"
              ? "Create Your Account"
              : `Login as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
          </h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignUp && activeRole === "customer" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {isSignUp && activeRole === "customer" && (
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm"
                  value={formData.confirm}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
            >
              {loading
                ? "Processing..."
                : isSignUp
                ? "Create Account"
                : "Log In"}
            </button>

            {message && (
              <p
                className={`text-center text-sm mt-3 ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            {/* Switch between login/signup */}
            {activeRole === "customer" && (
              <p className="text-center text-sm text-gray-500 mt-4">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-blue-600 hover:underline"
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
