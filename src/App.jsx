import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import RecruitmentStrip from "./components/RecruitmentStrip";
import Process from "./components/Process";
import Domains from "./components/Domains";
import ApplyPage from "./components/ApplyPage";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Events from "./components/Events";

export default function App() {
  const [toast, setToast] = useState("");

  const getRoute = () => {
    const p = window.location.pathname;
    if (p === "/events") return "events";
    if (p === "/apply" || p === "/join") return "apply";
    return "home";
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setRoute(getRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
    // force route recalc after pushState
    const p = path;
    if (p === "/events") setRoute("events");
    else if (p === "/apply" || p === "/join") setRoute("apply");
    else setRoute("home");
  };

  const comingSoon = (name) => {
    setToast(`${name} — Coming Soon`);
    window.clearTimeout(window.__artiverseToast);
    window.__artiverseToast = window.setTimeout(() => setToast(""), 2800);
  };

  const isEventsPage = route === "events";
  const isApplyPage = route === "apply";

  return (
    <div className="relative min-h-screen bg-ink text-white selection:bg-lime selection:text-ink">
      <Navbar
        onApply={() => navigate("/apply")}
        onComingSoon={comingSoon}
        onEvents={() => navigate("/events")}
        onHome={() => navigate("/")}
        isEventsPage={isEventsPage}
        isApplyPage={isApplyPage}
      />
      <main className="overflow-x-clip">
        {isApplyPage ? (
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
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
