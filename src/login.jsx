import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const MotionLink = motion.create(Link);

const parentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="relative min-h-screen bg-[#080616]">

      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover">
        <source src="/bg.mp4" type="video/mp4" />
      </motion.video>

      <motion.div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">

        <motion.div
          className="
            relative
            w-full max-w-[500px]
            rounded-2xl
            bg-zinc-900/95
            p-6 sm:p-10
            text-white
            shadow-2xl">

          <motion.div
            className="flex flex-col items-start gap-4 w-full"
            variants={parentVariants}
            initial="hidden"
            animate="visible">

            <motion.img
              className="w-20 sm:w-24 md:w-28 h-auto"
              src="/logo.png"
              alt="FLOW logo"
              variants={childVariants}/>

            <motion.p
              className="text-gray-400 text-sm sm:text-base mt-0.5 font-extrabold"
              variants={childVariants}>
              Take control of your money...
            </motion.p>

            <motion.h1
              className="text-white text-sm sm:text-base mt-0.5 font-extrabold"
              variants={childVariants}>
              Login to account →
            </motion.h1>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="login-error"
                  role="alert"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="
                    w-full
                    text-xs text-red-300
                    bg-red-500/10
                    border border-red-500/30
                    rounded-xl
                    px-4 py-3
                    break-words">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-4 w-full">

              <motion.div
                className="grid grid-cols-1 gap-4 w-full"
                variants={childVariants}>

                <motion.input
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  whileHover={{ scale: 1.02 }}
                  className="
                    w-full min-w-0
                    text-sm bg-zinc-800 text-white
                    rounded-full px-4 py-3
                    outline-none
                    focus:ring-2 focus:ring-white/30
                    disabled:opacity-50
                    transition-colors"/>

                <motion.input
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  whileHover={{ scale: 1.02 }}
                  className="
                    w-full min-w-0
                    text-sm bg-zinc-800 text-white
                    rounded-full px-4 py-3
                    outline-none
                    focus:ring-2 focus:ring-white/30
                    disabled:opacity-50
                    transition-colors"/>

              </motion.div>

              <motion.div
                className="
                  flex flex-wrap
                  items-center gap-3
                  pt-1">

                <motion.button
                  type="submit"
                  disabled={loading}
                  variants={childVariants}
                  className="
                    text-sm
                    bg-zinc-800 text-white
                    rounded-full px-4 py-3
                    hover:bg-white hover:text-black
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-colors"
                  whileTap={{ scale: 0.98 }}
                  whileHover={loading ? {} : { scale: 1.05 }}>
                  {loading ? "Logging in..." : "Login"}
                </motion.button>

                <motion.p
                  className="text-white text-sm"
                  variants={childVariants}>
                  Don't have an account?
                </motion.p>

                <MotionLink
                  to="/"
                  variants={childVariants}
                  className="text-white underline text-sm">
                  Sign Up
                </MotionLink>

              </motion.div>

            </form>

          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
