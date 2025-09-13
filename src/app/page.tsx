"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Lock,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  availableInvites: number;
  maxUsers: number;
  progressPercentage: number;
  remainingSlots: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    inviteCode: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const validateInvite = async () => {
    if (!inviteCode.trim()) return;

    setIsValidating(true);
    try {
      const response = await fetch("/api/auth/validate-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      });

      const result = await response.json();
      setValidationResult(result);

      if (result.valid) {
        setRegistrationData((prev) => ({ ...prev, inviteCode }));
        setShowRegistration(true);
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: "Failed to validate invite code",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      setRegistrationResult(result);

      if (result.success) {
        await fetchStats(); // Refresh stats
      }
    } catch (error) {
      setRegistrationResult({ error: "Failed to register" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold gradient-text">144K</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>
                  {stats?.totalUsers || 0} / {stats?.maxUsers || 144000}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Invite Only</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-16">
          {!showRegistration && !registrationResult?.success ? (
            <>
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center max-w-4xl mx-auto mb-16"
              >
                <h1 className="text-6xl md:text-8xl font-black mb-6">
                  <span className="gradient-text">144K</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  An exclusive community of{" "}
                  <span className="text-purple-400 font-semibold">
                    144,000 change-makers
                  </span>
                  <br />
                  working together to make a positive impact on the world.
                </p>

                {/* Progress Bar */}
                {stats && (
                  <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Community Progress</span>
                      <span>{stats.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressPercentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {stats.remainingSlots.toLocaleString()} spots remaining
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Invite Code Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-md mx-auto"
              >
                <div className="glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Enter Your Invite Code
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) =>
                          setInviteCode(e.target.value.toUpperCase())
                        }
                        placeholder="CODE-ALPHA-01"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-center font-mono text-lg"
                        onKeyPress={(e) =>
                          e.key === "Enter" && validateInvite()
                        }
                      />
                    </div>

                    <button
                      onClick={validateInvite}
                      disabled={isValidating || !inviteCode.trim()}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {isValidating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Validate Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                        validationResult.valid
                          ? "bg-green-900/50 border border-green-500 text-green-400"
                          : "bg-red-900/50 border border-red-500 text-red-400"
                      }`}
                    >
                      {validationResult.valid ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="text-sm">
                        {validationResult.message || validationResult.error}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          ) : showRegistration && !registrationResult?.success ? (
            /* Registration Form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto"
            >
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Join the Community
                </h2>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={registrationData.name}
                      onChange={(e) =>
                        setRegistrationData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      value={registrationData.email}
                      onChange={(e) =>
                        setRegistrationData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Your Email"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={registrationData.inviteCode}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isRegistering ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join 144K</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {registrationResult?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-400 flex items-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm">{registrationResult.error}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Success Page */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="glass rounded-2xl p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Welcome to 144K!
                </h2>

                <p className="text-gray-300 mb-6">
                  You've successfully joined the exclusive community. Here are
                  your invite codes to share:
                </p>

                <div className="space-y-3 mb-6">
                  {registrationResult?.user?.inviteCodes?.map(
                    (code: string, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                      >
                        <span className="font-mono text-lg text-purple-400">
                          {code}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  Share these codes with two people you believe would be perfect
                  for this community.
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
