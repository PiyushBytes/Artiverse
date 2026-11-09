import { useState } from "react";
import { CheckCircle2, LoaderCircle, ExternalLink } from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import { submitApplication } from "../lib/submitApplication";

const initial = {
  fullName: "",
  email: "",
  phone: "",
  rollNumber: "",
  department: "",
  year: "",
  domain1: "",
  domain2: "",
  why: "",
  portfolio: "",
  website: "",
};
export default function ApplyForm() {
  const [form, setForm] = useState(initial),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(false),
    [already, setAlready] = useState(
      () => localStorage.getItem("artiverseApplied") === "yes" || localStorage.getItem("artezaApplied") === "yes",
    ),
    [error, setError] = useState("");
  const booking = import.meta.env.VITE_BOOKING_URL;
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const validate = () => {
    const x = {};
    if (!form.fullName.trim()) x.fullName = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      x.email = "Enter a valid email.";
    if (!/^\d{10}$/.test(form.phone))
      x.phone = "Enter a 10-digit phone number.";
    ["rollNumber", "department", "year", "domain1", "domain2", "why"].forEach(
      (k) => {
        if (!form[k].trim()) x[k] = "This field is required.";
      },
    );
    if (form.domain1 === form.domain2)
      x.domain2 = "Choose a different second preference.";
    return x;
  };
  const submit = async (e) => {
    e.preventDefault();
    if (form.website) return;
    const x = validate();
    setErrors(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    setError("");
    try {
      await submitApplication({ ...form });
      setSuccess(true);
      setAlready(true);
      localStorage.setItem("artiverseApplied", "yes");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const reset = () => {
    localStorage.removeItem("artiverseApplied");
    localStorage.removeItem("artezaApplied");
    setAlready(false);
    setSuccess(false);
    setForm(initial);
  };
  const select = (name, label, options) => (
    <label className="block text-sm">
      {label}
      <select
        className="field mt-2"
        name={name}
        value={form[name]}
        onChange={update}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#10131b]">
            {o}
          </option>
        ))}
      </select>
      {errors[name] && <small className="text-[#ff9b91]">{errors[name]}</small>}
    </label>
  );
  const input = (name, label, placeholder, type = "text") => (
    <label className="block text-sm">
      {label}
      <input
        className="field mt-2"
        name={name}
        type={type}
        value={form[name]}
        onChange={update}
        placeholder={placeholder}
      />
      {errors[name] && <small className="text-[#ff9b91]">{errors[name]}</small>}
    </label>
  );
  return (
    <section id="apply" className="section">
      <div className="container-x">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl">
          Apply for <i className="text-lime">Artiverse.</i>
        </h2>
        <div className="panel mt-7 max-w-4xl rounded-2xl p-4 sm:mt-10 sm:rounded-3xl sm:p-6 md:p-10">
          {success || already ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-lime" />
              <h3 className="mt-5 font-display text-3xl sm:text-4xl">
                Application received.
              </h3>
              <p className="mt-3 text-white/60">
                You've already applied. Book your PI slot to complete the next
                step.
              </p>
              {booking ? (
                <a
                  className="lime-button glow mt-8"
                  href={booking}
                  target="_blank"
                  rel="noreferrer"
                >
                  Book your PI slot <ExternalLink size={16} />
                </a>
              ) : (
                <p className="mt-6 text-sm text-cobalt-soft">
                  PI booking link will be available soon.
                </p>
              )}
              <div>
                <button
                  onClick={reset}
                  className="mt-6 text-xs text-white/50 underline"
                >
                  Apply again
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="grid gap-5 md:grid-cols-2"
              noValidate
            >
              <input
                name="website"
                value={form.website}
                onChange={update}
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              {input("fullName", "Full name", "Your name")}
              {input("email", "College email", "you@msit.edu", "email")}
              {input("phone", "Phone / WhatsApp", "10-digit number", "tel")}
              {input("rollNumber", "Roll number", "Your roll number")}
              {select("department", "Department", [
                "CSE",
                "IT",
                "ECE",
                "EE",
                "Mechanical",
                "Civil",
                "Other",
              ])}
              {select("year", "Year", ["1st", "2nd", "3rd"])}
              {select(
                "domain1",
                "Domain preference 1",
                siteConfig.domains.map((d) => d.name),
              )}
              {select(
                "domain2",
                "Domain preference 2",
                siteConfig.domains.map((d) => d.name),
              )}
              <label className="block text-sm md:col-span-2">
                Why do you want to join Artiverse?
                <textarea
                  className="field mt-2 min-h-32"
                  name="why"
                  maxLength="400"
                  value={form.why}
                  onChange={update}
                  placeholder="Tell us what inspires you..."
                />
                <div className="mt-1 flex justify-between text-xs text-white/45">
                  <span>
                    {errors.why && (
                      <span className="text-[#ff9b91]">{errors.why}</span>
                    )}
                  </span>
                  <span>{form.why.length}/400</span>
                </div>
              </label>
              <div className="md:col-span-2">
                {input(
                  "portfolio",
                  "Portfolio / Drive / Instagram link (optional)",
                  "https://",
                )}
              </div>
              <p className="text-xs text-[#ff9b91] md:col-span-2">{error}</p>
              <button
                disabled={busy}
                className="lime-button glow md:col-span-2 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <LoaderCircle className="animate-spin" size={17} />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit application"
                )}
              </button>
              <p className="text-xs text-white/40 md:col-span-2">
                Your information will be used for Artiverse recruitment and
                interview coordination.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
