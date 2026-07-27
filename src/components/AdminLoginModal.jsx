import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginModal({ open, onClose }) {
  const { signIn, isAuthenticated, isSupabaseConfigured, authError, clearAuthError } =
    useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && isAuthenticated) {
      onClose();
      navigate("/admin");
    }
  }, [open, isAuthenticated, navigate, onClose]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setSubmitting(false);
      clearAuthError();
    }
  }, [open, clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (!error) {
      onClose();
      navigate("/admin");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close admin login"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#0F172A] transition cursor-pointer"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#0F172A] text-[#F59E0B] p-2.5 rounded-lg">
                <Lock size={20} />
              </div>
              <div>
                <h2 id="admin-login-title" className="text-xl font-bold text-[#0F172A]">
                  Admin Login
                </h2>
                <p className="text-sm text-gray-500">Sign in to manage site content</p>
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm p-3">
                Supabase is not configured yet. Add your keys to <code>.env</code> and follow{" "}
                <code>SUPABASE_SETUP.md</code>.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F172A] transition cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isSupabaseConfigured}
                className="w-full bg-[#0F172A] text-white py-3 rounded-lg font-semibold hover:bg-[#1E293B] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
