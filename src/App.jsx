import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import RecruitmentStrip from "./components/RecruitmentStrip";
import Process from "./components/Process";
import Domains from "./components/Domains";
import ApplyForm from "./components/ApplyForm";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Events from "./components/Events";

export default function App() {
  const [toast, setToast] = useState("");
  const [isEventsPage, setIsEventsPage] = useState(() => window.location.pathname === "/events");
  useEffect(() => {
    const syncRoute = () => setIsEventsPage(window.location.pathname === "/events");
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);
  const navigate = (path) => {
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setIsEventsPage(path === "/events");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const apply = () =>
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  const comingSoon = (name) => {
    setToast(`${name} — Coming Soon`);
    window.clearTimeout(window.__artiverseToast);
    window.__artiverseToast = window.setTimeout(() => setToast(""), 2800);
  };
  return (
    <div className="overflow-x-clip">
      <Navbar onApply={apply} onComingSoon={comingSoon} onEvents={() => navigate("/events")} onHome={() => navigate("/")} isEventsPage={isEventsPage} />
      <main>
        {isEventsPage ? <Events onJoin={apply} /> : <>
          <Hero onApply={apply} />
          <StatsBar />
          {/* <RecruitmentStrip /> */}
          <Process />
          <Domains />
          {/* <ApplyForm /> */}
          {/* <FAQ /> */}
        </>}
      </main>
      {!isEventsPage && <Footer />}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
