import { useState } from "react";
import { registerUser, loginUser } from "../services/authService";

/* ─────────────────────────────────────────
   All CSS-in-JS styles preserved 1-to-1
   from the original HTML/CSS source.
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .janseva-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #191834;
    position: relative;
    overflow-x: hidden;
    padding: 20px 16px;
  }

  .janseva-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse at 0% 0%,   #2b2c68 0%, transparent 55%),
      radial-gradient(ellipse at 100% 0%,  #26b7cd 0%, transparent 50%),
      radial-gradient(ellipse at 100% 100%,#61bdaf 0%, transparent 50%),
      radial-gradient(ellipse at 0% 100%,  #338aca 0%, transparent 55%),
      radial-gradient(ellipse at 50% 50%,  #2b2c68 0%, transparent 70%);
    background-color: #191834;
  }

  .janseva-outer-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    border-radius: 22px;
    background: rgba(18, 22, 58, 0.55);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(97,189,175,0.18);
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ── TOP BRAND HEADER ── */
  .janseva-top-header {
    background: rgba(15, 18, 50, 0.6);
    border-bottom: 1px solid rgba(97,189,175,0.12);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
  }

  .janseva-top-header::before {
    content: '';
    position: absolute;
    top: -40px; left: -40px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(51,138,202,0.2) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .janseva-sidebar-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #338aca, #61bdaf);
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(97,189,175,0.35);
    flex-shrink: 0;
  }

  .janseva-brand-text { z-index: 1; }

  .janseva-sidebar-name { font-size: 16px; font-weight: 700; color: #fff; }
  .janseva-sidebar-sub  { font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.4; margin-top: 2px; }

  /* ── CONTENT ── */
  .janseva-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 24px 28px;
  }

  .janseva-tabs {
    display: flex;
    width: 100%;
    border-bottom: 1px solid rgba(97,189,175,0.2);
    margin-bottom: 20px;
  }

  .janseva-tab {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    font-family: inherit;
    outline: none;
  }

  .janseva-tab.active {
    color: #61bdaf;
    border-bottom: 2px solid #61bdaf;
  }

  .janseva-role-toggle { display: flex; gap: 10px; width: 100%; margin-bottom: 16px; }

  .janseva-role-btn {
    flex: 1;
    padding: 9px 10px;
    border-radius: 9px;
    border: 1.5px solid #fff;
    background: #fff;
    color: #2b2c68;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .janseva-role-btn.active {
    border-color: #61bdaf;
    color: #338aca;
    box-shadow: 0 2px 12px rgba(97,189,175,0.3);
  }

  .janseva-role-btn:not(.active):hover {
    color: #338aca;
    border-color: #61bdaf;
  }

  .janseva-form { width: 100%; display: flex; flex-direction: column; gap: 12px; }
  .janseva-form-row { display: flex; gap: 10px; }
  .janseva-field { display: flex; flex-direction: column; gap: 4px; flex: 1; }

  .janseva-field label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(97,189,175,0.85);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .janseva-field input,
  .janseva-field select {
    padding: 11px 13px;
    border-radius: 9px;
    border: 1px solid rgba(97,189,175,0.2);
    background: rgba(255,255,255,0.06);
    color: #f0fdfa;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
  }

  .janseva-field input:focus,
  .janseva-field select:focus {
    border-color: #61bdaf;
    background: rgba(97,189,175,0.08);
  }

  .janseva-field input::placeholder { color: rgba(255,255,255,0.2); }

  .janseva-field.city-field input {
    border-color: rgba(97,189,175,0.35);
    background: rgba(97,189,175,0.06);
    padding-left: 36px;
  }

  .janseva-field.city-field label { color: #61bdaf; }

  .janseva-submit-btn {
    width: 100%;
    padding: 13px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #61bdaf 0%, #338aca 60%, #26b7cd 100%);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s, transform 0.1s;
    box-shadow: 0 5px 20px rgba(97,189,175,0.35);
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .janseva-submit-btn:hover  { opacity: 0.9; transform: translateY(-1px); }
  .janseva-submit-btn:active { transform: translateY(0); }

  .janseva-or-divider {
    text-align: center;
    color: #61bdaf;
    font-size: 12px;
    font-weight: 600;
  }

  .janseva-google-btn {
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    border: 1.5px solid #fff;
    background: #fff;
    color: #338aca;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .janseva-google-btn:hover {
    border-color: #61bdaf;
    box-shadow: 0 2px 12px rgba(97,189,175,0.25);
  }

  .janseva-footer-link {
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.4);
  }

  .janseva-footer-link a {
    color: #61bdaf;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }

  .janseva-input-wrap { position: relative; }

  .janseva-loc-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #61bdaf;
    font-size: 14px;
    pointer-events: none;
    line-height: 1;
  }
`;

/* ─── Google SVG (reusable) ─── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

/* ─── Role Toggle (shared by both views) ─── */
const RoleToggle = ({ activeRole, setActiveRole }) => (
  <div className="janseva-role-toggle">
    <button
      className={`janseva-role-btn${activeRole === "citizen" ? " active" : ""}`}
      onClick={() => setActiveRole("citizen")}
    >
      👤 Citizen
    </button>
    <button
      className={`janseva-role-btn${activeRole === "admin" ? " active" : ""}`}
      onClick={() => setActiveRole("admin")}
    >
      🏛️ Admin / Govt.
    </button>
  </div>
);

/* ─── Sign In View ─── */
const SignInView = ({
  activeRole,
  setActiveRole,
  switchTab,
  loginData,
  setLoginData,
  handleLogin,
}) => (
  
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
    <RoleToggle activeRole={activeRole} setActiveRole={setActiveRole} />

    <div className="janseva-form">
      <div className="janseva-field">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="xyz@example.com"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
      </div>

      <div className="janseva-field">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
      </div>

      <button
       className="janseva-submit-btn"
       onClick={handleLogin}
      >
        Sign In →
      </button>

      <div className="janseva-or-divider">or</div>

      <button className="janseva-google-btn">
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="janseva-footer-link">
        Don't have an account?{" "}
        <a onClick={() => switchTab("register")}>Register here</a>
      </div>
    </div>
  </div>
);

/* ─── Register View ─── */
const RegisterView = ({
  activeRole,
  setActiveRole,
  switchTab,
  registerData,
  setRegisterData,
  handleRegister,
}) =>(
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
    <RoleToggle activeRole={activeRole} setActiveRole={setActiveRole} />

    <div className="janseva-form">
      <div className="janseva-form-column">
        <div className="janseva-field">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Arjun Kumar"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                name: e.target.value,
                role: activeRole,
              })
            }
          />
        </div>

        <div className="janseva-field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="xyz@example.com"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                email: e.target.value,
                role: activeRole,
              })
            }
          />
        </div>

        <div className="janseva-field city-field">
          <label>📍 City</label>
          <div className="janseva-input-wrap">
            <span className="janseva-loc-icon">🏘️</span>
            <input 
              type="text"
              placeholder="e.g. Indore, Bhopal, Sehore..."
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  city: e.target.value,
                  role: activeRole,
                })
              }
            />
          </div>
        </div>

        <div className="janseva-form-column">
          <div className="janseva-field">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                  role: activeRole,
                })
              }
            />
          </div>
          <div className="janseva-field">
            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                role: activeRole,
                })
              }
            />
          </div>
        </div>

        <button
          className="janseva-submit-btn"
          onClick={handleRegister}
        >
          Create Account →
        </button>

        <div className="janseva-or-divider">or</div>

        <button className="janseva-google-btn">
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="janseva-footer-link">
        Already registered?{" "}
        <a onClick={() => switchTab("signin")}>Sign in</a>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────── */
export default function JanSeva() {
  const [complaint, setComplaint] = useState("");
  const [category, setCategory] = useState("");
  const [activeRole, setActiveRole] = useState("citizen");

  const [activeTab, setActiveTab] = useState("signin");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
 });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "citizen",
  });

  const switchTab = (tab) => setActiveTab(tab);
  const handleRegister = async () => {
     if (registerData.password !== registerData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        const data = await registerUser(registerData);

        alert(data.message);

      } catch (error) {
        alert(error.response?.data?.message || "Registration Failed");
      }
    };
  const handleLogin = async () => {
  try {

    const data = await loginUser(loginData);

    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.user));

    if (loginData.role === "citizen") {
      window.location.href = "/citizen";
    } else {
     window.location.href = "/admin";
    }

    if (data.user.role === "citizen") {
      window.location.href = "/citizen";
    }

    else if (data.user.role === "admin") {
      window.location.href = "/admin";
    }

    else {
      window.location.href = "/pending";
    }

  } catch (error) {
    alert(error.response?.data?.message || "Login Failed");
  }
  };

  const classifyComplaint = (text) => {
  text = text.toLowerCase();

  if (text.includes("road") || text.includes("bridge")) {
    return "Infrastructure";
  }

  if (text.includes("water")) {
    return "Water Supply";
  }

  if (text.includes("electricity")) {
    return "Electricity";
  }

  return "General";
};
return (
    <div
      style={{
        padding: "30px",
        color: "white",
        minHeight: "100vh",
        background: "#0f172a",
      }}
    >
      <h1>Citizen Dashboard</h1>

      <textarea
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder="Enter your complaint..."
        style={{
          width: "100%",
          height: "150px",
          padding: "15px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      />

      <button
        onClick={() => {
          const result = classifyComplaint(complaint);
          setCategory(result);
        }}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          border: "none",
          borderRadius: "10px",
          background: "#06b6d4",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Analyze Complaint
      </button>

      {category && (
        <h2 style={{ marginTop: "20px" }}>
          AI Category: {category}
        </h2>
      )}
    </div>
  );
}
return (
      <>
         {/* Inject scoped CSS */}
          <style>{STYLES}</style>
  
           <div className="janseva-root">
           {/* Radial gradient background */}
           <div className="janseva-bg" />
  
           {/* Main card */}
           <div className="janseva-outer-card">
  
           {/* ── Brand header ── */}
           <div className="janseva-top-header">
             <div className="janseva-sidebar-icon">
               <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
                 <rect x="4"  y="27" width="36" height="4" rx="2" fill="white" />
                   <rect x="8"  y="19" width="28" height="4" rx="2" fill="white" />
                     <rect x="13" y="11" width="18" height="4" rx="2" fill="white" />
                   <rect x="2"  y="33" width="40" height="4" rx="2" fill="white" />
                 <rect x="6"  y="37" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
               </svg>
                </div>
               <div className="janseva-brand-text">
                 <div className="janseva-sidebar-name">JanSeva AI</div>
               <div className="janseva-sidebar-sub">
                  AI-Powered Citizen Grievance · MP Government
                </div>
             </div>
           </div>
 
           {/* ── Content ── */}
            <div className="janseva-content">
 
             {/* Tab bar */}
             <div className="janseva-tabs">
               <button
                 className={`janseva-tab${activeTab === "signin" ? " active" : ""}`}
                 onClick={() => switchTab("signin")}
                 >
                 Sign In
               </button>
               <button
                  className={`janseva-tab${activeTab === "register" ? " active" : ""}`}
                 onClick={() => switchTab("register")}
               >
                 Register
               </button>
             </div>
 
             {/* Conditional view */}
             {activeTab === "signin" ? (
               <SignInView
                 activeRole={activeRole}
                 setActiveRole={setActiveRole}
                 switchTab={switchTab}
                 loginData={loginData}
                 setLoginData={setLoginData}
                 handleLogin={handleLogin}
               />
               ) : (
               <RegisterView
                 switchTab={switchTab}
                 registerData={registerData}
                 setRegisterData={setRegisterData}
                 handleRegister={handleRegister}
               />
             )}
 
           </div>
         </div>
       </div>
     </>
   );

