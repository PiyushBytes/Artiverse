import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import RecruitmentStrip from "./components/RecruitmentStrip";
import Process from "./components/Process";
import Domains from "./components/Domains";
import ApplyPage from "./components/ApplyPage";
import AuthPage from "./components/AuthPage";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Events from "./components/Events";
import { MobileBottomBar } from "./mobile";
import { clearAuthSession, logoutFromServer } from "./api/auth";

export default function App() {
  const [toast, setToast] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("artiverse_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const getRoute = () => {
    const p = window.location.pathname;
    if (p === "/events") return "events";
    if (p === "/apply" || p === "/join") return "apply";
    if (p === "/register") return "register";
    if (p === "/login" || p === "/auth") return "login";
    return "home";
  };

  const [route, setRoute] = useState(getRoute);

  // Sync user state on storage updates or navigation
  const syncUser = () => {
    try {
      const stored = localStorage.getItem("artiverse_current_user");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRoute());
      syncUser();
    };
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    syncUser();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const p = path;
    if (p === "/events") setRoute("events");
    else if (p === "/apply" || p === "/join") setRoute("apply");
    else if (p === "/register") setRoute("register");
    else if (p === "/login" || p === "/auth") setRoute("login");
    else setRoute("home");
  };

  const comingSoon = (name) => {
    setToast(`${name} — Coming Soon`);
    window.clearTimeout(window.__artiverseToast);
    window.__artiverseToast = window.setTimeout(() => setToast(""), 2800);
  };

  const signOut = async () => {
    let message = "You have been signed out.";
    try {
      await logoutFromServer();
    } catch (error) {
      message = `Signed out on this device. Server logout failed: ${error.message}`;
    } finally {
      clearAuthSession();
      setCurrentUser(null);
      navigate("/");
      setToast(message);
    }
  };

  const isEventsPage = route === "events";
  const isApplyPage = route === "apply";
  const isLoginPage = route === "login";
  const isRegisterPage = route === "register";
  const isAuthPage = isLoginPage || isRegisterPage;

  return (
    <div className="relative min-h-screen bg-ink text-white selection:bg-lime selection:text-ink">
      {!isAuthPage && (
        <Navbar
          onApply={() => navigate("/apply")}
          onComingSoon={comingSoon}
          onEvents={() => navigate("/events")}
          onHome={() => navigate("/")}
          onLogin={() => navigate("/login")}
          onSignOut={signOut}
          isEventsPage={isEventsPage}
          isApplyPage={isApplyPage}
          isLoginPage={isLoginPage}
          currentUser={currentUser}
        />
      )}

      <main className={`overflow-x-clip ${!isAuthPage ? "has-mobile-bottom-bar" : ""}`}>
        {isAuthPage ? (
          <AuthPage
            mode={isRegisterPage ? "register" : "login"}
            onNavigateLogin={() => navigate("/login")}
            onNavigateRegister={() => navigate("/register")}
            onBack={() => navigate("/")}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setToast(`Welcome, ${user.fullName?.split(" ")[0] || user.first_name || "Creator"}!`);
              navigate("/");
            }}
          />
        ) : isApplyPage ? (
          <ApplyPage onBack={() => navigate("/")} />
        ) : isEventsPage ? (
          <Events onJoin={() => navigate("/apply")} />
        ) : (
          <>
            <Hero onApply={() => navigate("/apply")} />
            <StatsBar />
            {/* <RecruitmentStrip /> */}
            <Process />
            <Domains />
            {/* <FAQ /> */}
          </>
        )}
      </main>

      {route === "home" && <Footer />}

      {/* Global Mobile Quick Navigation Dock */}
      {!isAuthPage && (
        <MobileBottomBar
          onHome={() => navigate("/")}
          onEvents={() => navigate("/events")}
          onApply={() => navigate("/apply")}
          isEventsPage={isEventsPage}
          isApplyPage={isApplyPage}
          isLoginPage={isLoginPage}
        />
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
