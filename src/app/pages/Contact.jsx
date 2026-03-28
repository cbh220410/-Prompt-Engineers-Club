import { Send } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import { api } from "../lib/api";
import { useThemeMode } from "../lib/useThemeMode";
function Contact() {
  const isDarkTheme = useThemeMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      await api.submitContact(formData);
      setSubmitSuccess("Message sent successfully. We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-10">
          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Contact</h1>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <ScrollReveal direction="left" className="lg:col-span-1">
            <div className={`rounded-2xl border backdrop-blur-xl p-5 space-y-5 ${isDarkTheme ? "border-white/15 bg-black/35" : "border-slate-200/90 bg-white/80 shadow-[0_20px_46px_-34px_rgba(30,41,59,0.3)]"}`}>
              <div>
                <h2 className={`text-lg font-semibold ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Join Our Discord</h2>
                <p className={`text-sm mt-1 ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>Hang out with the community and stay updated.</p>
              </div>

              <div className={`rounded-xl border overflow-hidden ${isDarkTheme ? "border-white/10" : "border-slate-200/90"}`}>
                <iframe
    title="Prompt Engineers  Club Discord"
    src={`https://discord.com/widget?id=1483389840115368059&theme=${isDarkTheme ? "dark" : "light"}`}
    width="100%"
    height="420"
    frameBorder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
  />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={80} className="lg:col-span-2">
            <div className={`rounded-2xl border backdrop-blur-xl p-6 ${isDarkTheme ? "border-white/15 bg-black/35" : "border-slate-200/90 bg-white/80 shadow-[0_20px_46px_-34px_rgba(30,41,59,0.3)]"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className={`text-xl font-semibold ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Send a message</h2>
                <a
    href="https://discord.gg/fMycgcFf"
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${isDarkTheme ? "border-indigo-300/40 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30 hover:border-indigo-200/70" : "border-sky-300/70 bg-sky-100 text-sky-700 hover:bg-sky-200"}`}
  >
                  Join Discord
                </a>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? "text-slate-200" : "text-slate-700"}`}>Name</label>
                    <input
    type="text"
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    required
    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${isDarkTheme ? "border-white/15 bg-slate-950/55 text-slate-100 placeholder:text-slate-400 focus:ring-white/25 focus:border-white/40" : "border-slate-300/90 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-sky-200 focus:border-sky-300"}`}
    placeholder="Your name"
  />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? "text-slate-200" : "text-slate-700"}`}>Email</label>
                    <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${isDarkTheme ? "border-white/15 bg-slate-950/55 text-slate-100 placeholder:text-slate-400 focus:ring-white/25 focus:border-white/40" : "border-slate-300/90 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-sky-200 focus:border-sky-300"}`}
    placeholder="you@example.com"
  />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? "text-slate-200" : "text-slate-700"}`}>Subject</label>
                  <input
    type="text"
    id="subject"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    required
    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${isDarkTheme ? "border-white/15 bg-slate-950/55 text-slate-100 placeholder:text-slate-400 focus:ring-white/25 focus:border-white/40" : "border-slate-300/90 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-sky-200 focus:border-sky-300"}`}
    placeholder="What is this about?"
  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? "text-slate-200" : "text-slate-700"}`}>Message</label>
                  <textarea
    id="message"
    name="message"
    value={formData.message}
    onChange={handleChange}
    required
    rows={6}
    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-sm ${isDarkTheme ? "border-white/15 bg-slate-950/55 text-slate-100 placeholder:text-slate-400 focus:ring-white/25 focus:border-white/40" : "border-slate-300/90 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-sky-200 focus:border-sky-300"}`}
    placeholder="Tell us more about your inquiry..."
  />
                </div>

                <button
    type="submit"
    disabled={submitting}
    className={`w-full px-6 py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed ${isDarkTheme ? "bg-white text-black hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}
  >
                  {submitting ? "Sending..." : "Send Message"}
                  <Send size={16} />
                </button>

                {submitSuccess && <p className="text-sm text-emerald-200 bg-emerald-500/15 border border-emerald-300/30 rounded-xl px-3 py-2">
                    {submitSuccess}
                  </p>}
                {submitError && <p className="text-sm text-red-200 bg-red-500/15 border border-red-300/30 rounded-xl px-3 py-2">
                    {submitError}
                  </p>}
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>;
}
export {
  Contact
};
