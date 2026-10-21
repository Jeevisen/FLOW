
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "motion/react";

const MotionLink = motion.create(Link);

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error.message);
      return;
    }

    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
  ];

  return (
    <header
      className="
        sticky top-3 z-50
        mx-auto w-[95%] sm:w-[90%] lg:w-[85%]
        max-w-[1200px]
        min-h-[60px] lg:min-h-[65px]
        bg-white/10 backdrop-blur-xl
        border border-white/10 rounded-2xl
        shadow-lg shadow-black/10
        text-white
        px-4 sm:px-6
      "
    >
      <div className="flex items-center justify-between min-h-[60px] lg:min-h-[65px]">

        <motion.img
          src="/logo.png"
          alt="FLOW logo"
          className="w-20 sm:w-24 h-auto"
        />

        <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
          {navItems.map((item) => (
            <MotionLink
              key={item.name}
              to={item.path}
              className="text-sm text-white rounded-full px-3 py-2"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.08 }}
            >
              {item.name}
            </MotionLink>
          ))}

          <motion.button
            type="button"
            onClick={handleSignOut}
            className="hover:bg-white/80 text-sm bg-white/85 text-black rounded-full px-4 py-2 ml-2"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.05 }}
          >
            Sign Out
          </motion.button>
        </nav>

        <motion.button
            type="button"
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            whileTap={{ scale: 0.9 }}
            >
            <span className="text-xl">
                {menuOpen ? "✕" : "☰"}
            </span>
        </motion.button>

      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="lg:hidden flex flex-col gap-2 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            {navItems.map((item) => (
              <MotionLink
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="self-start text-sm text-white rounded-xl px-4 py-3 hover:bg-white/10"
                whileTap={{ scale: 0.98 }}  >
                {item.name}
              </MotionLink>
            ))}

            <motion.button
              type="button"
              onClick={handleSignOut}
              className="self-start text-sm bg-white/85 text-black rounded-full px-4 py-3 mt-2 hover:bg-white/80 hover:text-white"
              whileTap={{ scale: 0.98 }}
            >
              Sign Out
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
