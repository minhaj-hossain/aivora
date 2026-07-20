import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { IUser } from "../types";

interface AuthPageProps {
  view: "login" | "register";
  setView: (view: string) => void;
  onAuthSuccess: (token: string, user: IUser) => void;
}

export default function AuthPage({ view: initialView, setView: setViewProp, onAuthSuccess: onAuthSuccessProp }: AuthPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { onAuthSuccess } = useAuth();

  const [localView, setLocalView] = useState<"login" | "register">(initialView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Keep in sync with prop if it changes
  useEffect(() => {
    setLocalView(initialView);
  }, [initialView]);

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Google OAuth Popup Flow
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/google/url");
      if (!res.ok) {
        throw new Error("Failed to construct Google OAuth consent pathway.");
      }
      const data = await res.json();
      if (!data.url) {
        throw new Error("No OAuth URL provided by security endpoint.");
      }

      // Open popup
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        data.url,
        "Aivora Google Login",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        throw new Error("Popup blocked. Please allow popups for Aivora to authenticate via Google.");
      }

      // Message listener for the popup callback
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
          const { token, user: authedUser } = event.data;
          
          setSuccess("Google Authentication successful! Initializing your dashboard...");
          onAuthSuccess(token, authedUser);
          
          window.removeEventListener("message", messageHandler);
          
          setTimeout(() => {
            navigate(redirectPath);
          }, 1000);
        } else if (event.data?.type === "OAUTH_AUTH_FAILURE") {
          setError(event.data.error || "Google authentication rejected.");
          setLoading(false);
          window.removeEventListener("message", messageHandler);
        }
      };

      window.addEventListener("message", messageHandler);

      // Liveness poll for the popup
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setLoading(false);
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Could not launch Google authentication.");
      setLoading(false);
    }
  };

  const executeSubmit = async (submitEmail: string, submitPass: string, isRegistering: boolean, submitName: string) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const body = isRegistering 
        ? { name: submitName, email: submitEmail.toLowerCase(), password: submitPass } 
        : { email: submitEmail.toLowerCase(), password: submitPass };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      setSuccess("Authentication successful! Redirecting you to your strategic space...");
      onAuthSuccess(data.token, data.user);
      
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localView === "register") {
      if (!name.trim()) {
        setError("Please provide your name.");
        return;
      }
      if (!agreeTerms) {
        setError("You must agree to the Terms of Service and Privacy Policy.");
        return;
      }
    }
    if (!email.trim() || !password.trim()) {
      setError("Email and password fields are required.");
      return;
    }

    executeSubmit(email, password, localView === "register", name);
  };

  // Demo auto-fill and submit through standard login route
  const handleTryDemo = () => {
    setLocalView("login");
    const demoEmail = "demo@aivora.app";
    const demoPassword = "AivoraDemo123!";
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    // Execute submit directly with the filled demo values
    executeSubmit(demoEmail, demoPassword, false, "");
  };

  const setView = (v: "login" | "register") => {
    setLocalView(v);
    setViewProp(v);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#f7f9fb] text-[#191c1e] select-none text-left">
      
      {/* Left Section: Branding Sidebar */}
      <section className="hidden md:flex w-1/2 relative bg-[#eceef0] overflow-hidden items-center justify-center p-10 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#d5e3fd_0%,transparent_70%)] opacity-40"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#bec6e0] rounded-full blur-[100px] opacity-20"></div>

        <div className="absolute top-0 left-0 p-8 z-20">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <img 
              alt="Aivora Logo" 
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLuHWJcwMtrYHoLGsTp_dOS1kJgs2u3cHrOhtfSkGUsFZrHf9cv-V25TX03BzxTg_0emSq59rcmiSBFYFqqSZATx3_H_4cjttGZQiZO_z4TeOQoU_DZ3EcXMwj7SmWm_VYw6YSQz30QXmbl99_m7pVKx4Z5f8Vk7CuCsDD9wixSQ2rlZGoXGUmY21WfMuDKcEJIzfGBE60Her-4DI-9bfdaJ09oNotW6hpYUhxmbi9Wxmod6Hnwopbds4Qs"
            />
            <span className="font-display text-2xl font-bold tracking-tight text-[#0F172A]">Aivora</span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-2xl h-full flex flex-col justify-center items-center">
          <div className="relative w-full aspect-video rounded-xl shadow-2xl overflow-hidden animate-float">
            <img 
              className="w-full h-full object-cover select-none" 
              alt="Aivora Workspace"
              src={localView === "login" 
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuA1CLi2zjS0jKcGA4kxzsv01xGyd8_ASF8ntGXhYfyn-ERoiDKK1HefyzqOSg_hNTlSxb8WPvVggc-B-ZXOCTNcUJvYUp9bD3GVtGyWLDa55FpTUSKsMhhHbhG-AuQTEhFb57M-negiwbBtHbnrxLnSqgL8c902sQzRalufVBvNwu_8XGILlPulQh4eUhorDR47zgvQPmDh4s-ZBdnZbxGBVpBnRi-tSYSKbB_pBRF4zSeu7f2GgylRNQ"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuBG2WJb4umMkAnGLl6jDMnWVqrX5w-HKD51olNW9pGOYJ0rnq3HjGZZhG1C3SrFW38EcC7ZLRTHIGYe79XzYIQoLAU-RbWVIe5badlV_iEcdtdZW4pyoGpmu1MyjkmX9ktf2fAfWVdn5lcB-wVr4W7Lb_1IXz_LBDeW130LPRGz1bD-du3SO8XZk7m0RpnxN-kGQ5J1ZviKLSsetjlxgou97BbeyTN2OwPQyj_wDnmCeCslFr6gYdLuMg"
              }
            />
            
            {localView === "login" ? (
              <div className="absolute top-1/4 -right-8 w-48 h-32 glass-effect rounded-[1rem] p-4 shadow-lg border border-[#c6c6cd]/30 bg-white/20 backdrop-blur-md">
                <div className="h-2 w-12 bg-[#0F172A] rounded-full mb-2"></div>
                <div className="h-1 w-full bg-[#c6c6cd] rounded-full mb-1"></div>
                <div className="h-1 w-2/3 bg-[#c6c6cd] rounded-full"></div>
                <div className="mt-4 flex gap-1 items-end h-8">
                  <div className="flex-1 bg-[#0F172A] h-1/2 rounded-[0.125rem]"></div>
                  <div className="flex-1 bg-[#0F172A] h-full rounded-[0.125rem]"></div>
                  <div className="flex-1 bg-[#0F172A] h-2/3 rounded-[0.125rem]"></div>
                  <div className="flex-1 bg-[#0F172A] h-3/4 rounded-[0.125rem]"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute top-8 right-8 w-24 h-24 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 premium-shadow animate-bounce" style={{ animationDuration: "4s" }}></div>
                <div className="absolute bottom-12 left-12 w-32 h-32 bg-[#0F172A]/5 backdrop-blur-sm rounded-full border border-[#0F172A]/10 animate-pulse"></div>
              </>
            )}
          </div>

          <div className="absolute bottom-8 left-8 right-8 max-w-md">
            {localView === "login" ? (
              <>
                <h2 className="font-display text-4xl font-extrabold text-[#0F172A] leading-tight mb-3">Thinking in Tandem.</h2>
                <p className="font-sans text-sm text-[#515f74] leading-relaxed">
                  Collaborate with state-of-the-art co-thinking models to trace assumptions, model tradeoffs, and forge crisp, bulletproof strategies.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-4xl font-extrabold text-[#0F172A] leading-tight mb-3">Architecture of Intelligence.</h2>
                <p className="font-sans text-sm text-[#515f74] leading-relaxed">
                  Aivora provides the professional infrastructure to build, deploy, and scale enterprise-grade AI models and thinking spaces with unparalleled precision.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Right Section: Form Container */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#f7f9fb] relative">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 md:hidden">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <img 
              alt="Aivora Logo" 
              className="w-10 h-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLuHWJcwMtrYHoLGsTp_dOS1kJgs2u3cHrOhtfSkGUsFZrHf9cv-V25TX03BzxTg_0emSq59rcmiSBFYFqqSZATx3_H_4cjttGZQiZO_z4TeOQoU_DZ3EcXMwj7SmWm_VYw6YSQz30QXmbl99_m7pVKx4Z5f8Vk7CuCsDD9wixSQ2rlZGoXGUmY21WfMuDKcEJIzfGBE60Her-4DI-9bfdaJ09oNotW6hpYUhxmbi9Wxmod6Hnwopbds4Qs"
            />
            <span className="font-display text-xl font-bold tracking-tight text-[#0F172A]">Aivora</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] p-8 md:p-10 rounded-[1rem] bg-white shadow-[0px_4px_32px_rgba(15,23,42,0.06)] border border-[#c6c6cd]/30 flex flex-col space-y-6 animate-fadeIn">
          <div className="text-center md:text-left space-y-1.5">
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
              {localView === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="font-sans text-xs text-[#45464d]">
              {localView === "login" ? "Enter your details to access your workspace" : "Start building smarter with Aivora"}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50 p-3.5 text-xs text-red-700 leading-relaxed">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span className="font-sans">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 rounded-md border border-emerald-100 bg-emerald-50 p-3.5 text-xs text-emerald-800 leading-relaxed">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
              <span className="font-sans">{success}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {localView === "register" && (
              <div className="space-y-1.5 text-left">
                <label className="font-sans text-[11px] font-semibold text-[#45464d] uppercase tracking-wider block pl-0.5" htmlFor="full_name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c6c6cd] rounded-lg font-sans text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all outline-none" 
                    id="full_name" 
                    placeholder="Marie Curie" 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="font-sans text-[11px] font-semibold text-[#45464d] uppercase tracking-wider block pl-0.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c6c6cd] rounded-lg font-sans text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all outline-none" 
                  id="email" 
                  placeholder="name@company.com" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="font-sans text-[11px] font-semibold text-[#45464d] uppercase tracking-wider block pl-0.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input 
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#c6c6cd] rounded-lg font-sans text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#191c1e] transition-colors cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {localView === "login" ? (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none group">
                  <input 
                    className="w-4 h-4 rounded border-[#c6c6cd] text-[#0F172A] focus:ring-[#0F172A]/20 transition-all cursor-pointer" 
                    type="checkbox"
                    defaultChecked
                  />
                  <span className="ml-2 font-sans text-[11px] text-[#45464d] group-hover:text-[#191c1e] transition-colors">
                    Remember me
                  </span>
                </label>
                <button 
                  type="button" 
                  className="font-sans text-[11px] text-[#0F172A] hover:underline font-semibold cursor-pointer"
                  onClick={() => setError("Password reset request sent. Please check your inbox.")}
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2 pt-1 text-left">
                <input 
                  className="mt-0.5 h-4 w-4 rounded border-[#c6c6cd] text-[#0F172A] focus:ring-[#0F172A]/20 transition-all cursor-pointer" 
                  id="terms" 
                  name="terms" 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label className="font-sans text-[11px] text-[#45464d] leading-normal" htmlFor="terms">
                  I agree to the <Link className="text-[#0F172A] font-semibold hover:underline" to="/terms">Terms of Service</Link> and <Link className="text-[#0F172A] font-semibold hover:underline" to="/privacy">Privacy Policy</Link>.
                </label>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button 
                className="w-full py-2.5 bg-[#0F172A] text-white rounded-lg font-display text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-[#0F172A]/10 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    {localView === "login" ? "Login" : "Create Account"}
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#c6c6cd]/50"></div>
                <span className="flex-shrink mx-4 font-sans text-[10px] text-[#76777d] font-semibold uppercase tracking-wider">OR</span>
                <div className="flex-grow border-t border-[#c6c6cd]/50"></div>
              </div>

              {/* Real Google Login popup flow */}
              <button 
                className="w-full py-2.5 border border-[#c6c6cd] bg-white text-[#191c1e] rounded-lg font-sans text-xs font-semibold flex items-center justify-center space-x-2.5 hover:bg-[#f2f4f6] transition-all disabled:opacity-50 cursor-pointer" 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Try Demo button that auto-fills credentials and submits through real login flow */}
              <button 
                className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer" 
                type="button"
                onClick={handleTryDemo}
                disabled={loading}
              >
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Try Demo (Auto-fills & logs in)</span>
              </button>
            </div>
          </form>

          <div className="pt-2 text-center border-t border-[#c6c6cd]/30">
            <p className="font-sans text-xs text-[#45464d]">
              {localView === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setView("register")}
                    className="text-[#0F172A] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setView("login")}
                    className="text-[#0F172A] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
