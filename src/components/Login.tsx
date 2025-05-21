"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"admin" | "manager" | "member">("member");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle normal signup/login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: `${username}gmail.com`,
          password,
          options: {
            data: { username, role },
          },
        });
        if (signUpError) throw signUpError;

        await supabase.from("users").insert({
          id: data.user!.id,
          username,
          role,
        });

        setMessage("Sign up successful! Please check your email to confirm.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `${username}@gmail.com`,
          password,
        });
        if (signInError) throw signInError;

        setMessage("Login successful!");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset email.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // Redirects to Google login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Optional redirect URL after login, adjust as needed
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // Note: The actual user data insertion will be handled
      // in an auth state listener below after redirect
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Google login failed.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Listen for auth state changes (after OAuth redirect)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;
          // console.log(user);

          try {
            // Upsert user profile data to users table
            await supabase.from("users").upsert({
              id: user.id,
              username:
                user.user_metadata?.username || user.email?.split("@")[0] || "",
              role: "member", // default role, or customize as needed
            });

            setMessage("Logged in with Google successfully!");
            setError(null);
          } catch (dbError: unknown) {
            if (dbError instanceof Error) {
              setError(`Error updating user data: ${dbError.message}`);
            } else {
              setError(`Error updating user data: ${String(dbError)}`);
            }
          }
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
            Reset Password
          </h2>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base disabled:opacity-50"
            >
              Send Reset Email
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Remember your password?
            <button
              onClick={() => {
                setForgotPassword(false);
                setMessage(null);
                setError(null);
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
              disabled={loading}
            />
          </div>
          {!isSignUp && (
            <p
              className="text-right text-blue-500 hover:underline cursor-pointer text-sm"
              onClick={() => setForgotPassword(true)}
            >
              Forgot Password?
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "admin" | "manager" | "member")
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base disabled:opacity-50"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-md flex flex-col items-center space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm sm:text-base disabled:opacity-50"
        >
          Continue with Google
        </button>
      </div>

      <p className="text-center text-sm">
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage(null);
            setError(null);
          }}
          className="text-blue-500 hover:text-blue-600"
          disabled={loading}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
