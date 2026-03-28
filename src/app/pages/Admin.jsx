import { useEffect, useState } from "react";
import { api } from "../lib/api";
const emptyProjectDraft = {
  title: "",
  description: "",
  image: "",
  link: "",
  repoUrl: "",
  tags: [],
  status: "Planning"
};
const emptyTeamDraft = {
  name: "",
  role: "",
  image: "",
  linkedin: "",
  github: "",
  email: "",
  bio: "",
  order: 0
};
const emptyPlanDraft = {
  title: "",
  type: "",
  description: "",
  attendees: 0,
  category: "upcoming",
  order: 0
};
const emptyHomeDraft = {
  heroBadge: "",
  heroDescription: "",
  stats: [],
  features: []
};
const emptyHomeFeatureDraft = {
  icon: "Lightbulb",
  title: "",
  desc: "",
  link: "",
  cta: ""
};
function toPrettyJson(value) {
  return JSON.stringify(value, null, 2);
}
function Admin() {
  const ADMIN_PASSWORD = "freefire";
  const ADMIN_UNLOCK_KEY = "pec_admin_unlocked";
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [plans, setPlans] = useState([]);
  const [home, setHome] = useState(emptyHomeDraft);
  const [projectDraft, setProjectDraft] = useState(emptyProjectDraft);
  const [projectEditId, setProjectEditId] = useState(null);
  const [teamDraft, setTeamDraft] = useState(emptyTeamDraft);
  const [teamEditId, setTeamEditId] = useState(null);
  const [planDraft, setPlanDraft] = useState(emptyPlanDraft);
  const [planEditId, setPlanEditId] = useState(null);
  const [statsJson, setStatsJson] = useState("[]");
  const [homeFeatures, setHomeFeatures] = useState([]);
  const [homeFeatureDraft, setHomeFeatureDraft] = useState(emptyHomeFeatureDraft);
  const [homeFeatureEditIndex, setHomeFeatureEditIndex] = useState(null);
  const [seedCode, setSeedCode] = useState("");
  const resetMsg = () => {
    setError("");
    setNotice("");
  };
  const loadAll = async () => {
    setLoading(true);
    resetMsg();
    try {
      const [projectsRes, teamRes, plansRes, homeRes, seedText] = await Promise.all([
        api.getProjects(),
        api.getTeam(),
        api.getPlans(),
        api.getHomeContent(),
        api.getSeedModuleText()
      ]);
      setProjects(projectsRes);
      setTeam(teamRes);
      setPlans(plansRes);
      setHome(homeRes);
      setStatsJson(toPrettyJson(homeRes.stats || []));
      setHomeFeatures(Array.isArray(homeRes.features) ? homeRes.features : []);
      setHomeFeatureDraft(emptyHomeFeatureDraft);
      setHomeFeatureEditIndex(null);
      setSeedCode(seedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unlocked = localStorage.getItem(ADMIN_UNLOCK_KEY) === "1";
    setAccessGranted(unlocked);
    if (!unlocked) return () => {
    };
    loadAll();
    return api.onDataChange(loadAll);
  }, []);
  const unlockAdmin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_UNLOCK_KEY, "1");
      setAccessGranted(true);
      setPasswordInput("");
      setPasswordError("");
      loadAll();
      return;
    }
    setPasswordError("Incorrect password");
  };
  if (!accessGranted) {
    return <div className="max-w-md mx-auto px-4 py-24">
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 space-y-4">
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-sm text-slate-300">
            Enter password to open admin dashboard.
          </p>
          <form onSubmit={unlockAdmin} className="space-y-3">
            <input
      type="password"
      value={passwordInput}
      onChange={(e) => setPasswordInput(e.target.value)}
      className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2"
      placeholder="Enter password"
      required
    />
            <button type="submit" className="w-full px-4 py-2 rounded-lg bg-white text-black font-medium">
              Unlock Admin
            </button>
          </form>
          {passwordError && <p className="text-sm text-red-300 bg-red-950/30 border border-red-500/40 rounded-lg px-3 py-2">
              {passwordError}
            </p>}
        </div>
      </div>;
  }
  const refreshSeedCode = async () => {
    setSeedCode(await api.getSeedModuleText());
  };
  const saveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    resetMsg();
    try {
      const payload = {
        ...projectDraft,
        tags: projectDraft.tags.filter(Boolean)
      };
      if (projectEditId) {
        await api.updateProject(projectEditId, payload);
        setNotice("Project updated");
      } else {
        await api.createProject(payload);
        setNotice("Project created");
      }
      setProjectDraft(emptyProjectDraft);
      setProjectEditId(null);
      setProjects(await api.getProjects());
      await refreshSeedCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };
  const saveTeam = async (e) => {
    e.preventDefault();
    setSaving(true);
    resetMsg();
    try {
      if (teamEditId) {
        await api.updateTeamMember(teamEditId, teamDraft);
        setNotice("Team member updated");
      } else {
        await api.createTeamMember(teamDraft);
        setNotice("Team member added");
      }
      setTeamDraft(emptyTeamDraft);
      setTeamEditId(null);
      setTeam(await api.getTeam());
      await refreshSeedCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member");
    } finally {
      setSaving(false);
    }
  };
  const savePlan = async (e) => {
    e.preventDefault();
    setSaving(true);
    resetMsg();
    try {
      if (planEditId) {
        await api.updatePlan(planEditId, planDraft);
        setNotice("Plan updated");
      } else {
        await api.createPlan(planDraft);
        setNotice("Plan added");
      }
      setPlanDraft(emptyPlanDraft);
      setPlanEditId(null);
      setPlans(await api.getPlans());
      await refreshSeedCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };
  const saveHomeFeatureDraft = (e) => {
    e.preventDefault();
    resetMsg();
    const normalized = {
      icon: String(homeFeatureDraft.icon || "Lightbulb").trim() || "Lightbulb",
      title: String(homeFeatureDraft.title || "").trim(),
      desc: String(homeFeatureDraft.desc || "").trim(),
      link: String(homeFeatureDraft.link || "").trim(),
      cta: String(homeFeatureDraft.cta || "").trim()
    };
    if (!normalized.title || !normalized.desc) {
      setError("Future plan card title and description are required");
      return;
    }
    setHomeFeatures((prev) => {
      if (homeFeatureEditIndex === null) {
        return [...prev, normalized];
      }
      return prev.map((feature, index) => index === homeFeatureEditIndex ? normalized : feature);
    });
    setHomeFeatureDraft(emptyHomeFeatureDraft);
    setHomeFeatureEditIndex(null);
    setNotice("Future plan card updated locally. Click Save Home to publish.");
  };
  const startEditHomeFeature = (index) => {
    const target = homeFeatures[index];
    if (!target) return;
    resetMsg();
    setHomeFeatureEditIndex(index);
    setHomeFeatureDraft({
      icon: target.icon || "Lightbulb",
      title: target.title || "",
      desc: target.desc || "",
      link: target.link || "",
      cta: target.cta || ""
    });
  };
  const removeHomeFeature = (index) => {
    resetMsg();
    setHomeFeatures((prev) => prev.filter((_, idx) => idx !== index));
    if (homeFeatureEditIndex === index) {
      setHomeFeatureEditIndex(null);
      setHomeFeatureDraft(emptyHomeFeatureDraft);
    } else if (homeFeatureEditIndex !== null && homeFeatureEditIndex > index) {
      setHomeFeatureEditIndex(homeFeatureEditIndex - 1);
    }
    setNotice("Future plan card removed locally. Click Save Home to publish.");
  };
  const saveHome = async () => {
    setSaving(true);
    resetMsg();
    try {
      const stats = JSON.parse(statsJson);
      const updated = await api.updateHomeContent({
        heroBadge: home.heroBadge || "",
        heroDescription: home.heroDescription || "",
        stats: Array.isArray(stats) ? stats : [],
        features: homeFeatures
      });
      setHome(updated);
      setHomeFeatures(Array.isArray(updated.features) ? updated.features : []);
      setNotice("Home content updated");
      await refreshSeedCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save home content");
    } finally {
      setSaving(false);
    }
  };
  return <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">
          Backend removed. All changes are now saved in frontend local data.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
    onClick={loadAll}
    disabled={loading}
    className="px-4 py-2 rounded-lg border border-white/20 text-sm"
  >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
        <button
    onClick={async () => {
      setSaving(true);
      resetMsg();
      try {
        await api.downloadDataJson();
        setNotice("JSON downloaded");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Download failed");
      } finally {
        setSaving(false);
      }
    }}
    className="px-4 py-2 rounded-lg border border-white/20 text-sm"
  >
          Download JSON
        </button>
        <button
    onClick={async () => {
      setSaving(true);
      resetMsg();
      try {
        await api.copySeedModuleToClipboard();
        setNotice("Seed code copied");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Copy failed");
      } finally {
        setSaving(false);
      }
    }}
    className="px-4 py-2 rounded-lg border border-white/20 text-sm"
  >
          Copy Seed Code
        </button>
        <button
    onClick={async () => {
      setSaving(true);
      resetMsg();
      try {
        await api.saveSeedModuleToFile();
        setNotice("Pick src/app/data/siteData.ts to directly update code.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save file failed");
      } finally {
        setSaving(false);
      }
    }}
    className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium"
  >
          Save To Code File
        </button>
      </div>

      {error && <p className="rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 px-3 py-2 text-sm">{error}</p>}
      {notice && <p className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 px-3 py-2 text-sm">{notice}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveTeam} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">Team</h2>
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Name" value={teamDraft.name} onChange={(e) => setTeamDraft((d) => ({ ...d, name: e.target.value }))} required />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Role" value={teamDraft.role} onChange={(e) => setTeamDraft((d) => ({ ...d, role: e.target.value }))} required />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Image URL" value={teamDraft.image || ""} onChange={(e) => setTeamDraft((d) => ({ ...d, image: e.target.value }))} />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="LinkedIn URL" value={teamDraft.linkedin || ""} onChange={(e) => setTeamDraft((d) => ({ ...d, linkedin: e.target.value }))} />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="GitHub URL" value={teamDraft.github || ""} onChange={(e) => setTeamDraft((d) => ({ ...d, github: e.target.value }))} />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Email" value={teamDraft.email || ""} onChange={(e) => setTeamDraft((d) => ({ ...d, email: e.target.value }))} />
          <textarea className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Bio" value={teamDraft.bio || ""} onChange={(e) => setTeamDraft((d) => ({ ...d, bio: e.target.value }))} />
          <div className="flex gap-2">
            <button disabled={saving} className="px-4 py-2 rounded-lg bg-white text-black font-medium">{teamEditId ? "Update" : "Add"}</button>
            {teamEditId && <button type="button" onClick={() => {
    setTeamEditId(null);
    setTeamDraft(emptyTeamDraft);
  }} className="px-4 py-2 rounded-lg border border-white/20">Cancel</button>}
          </div>
          <div className="space-y-2 pt-2 border-t border-white/10">
            {team.map((member) => <div key={member._id} className="rounded-lg border border-white/10 p-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-white font-medium">{member.name}</p>
                  <p className="text-xs text-slate-300">{member.role}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => {
    setTeamEditId(member._id);
    setTeamDraft({ ...member });
  }} className="px-2 py-1 rounded border border-white/20 text-xs">Edit</button>
                  <button type="button" onClick={async () => {
    await api.deleteTeamMember(member._id);
    setTeam(await api.getTeam());
    await refreshSeedCode();
  }} className="px-2 py-1 rounded border border-red-400/40 text-xs text-red-300">Delete</button>
                </div>
              </div>)}
          </div>
        </form>

        <form onSubmit={savePlan} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">Plans</h2>
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Title" value={planDraft.title} onChange={(e) => setPlanDraft((d) => ({ ...d, title: e.target.value }))} required />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Type" value={planDraft.type} onChange={(e) => setPlanDraft((d) => ({ ...d, type: e.target.value }))} required />
          <textarea className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Description" value={planDraft.description} onChange={(e) => setPlanDraft((d) => ({ ...d, description: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Attendees" value={planDraft.attendees || 0} onChange={(e) => setPlanDraft((d) => ({ ...d, attendees: Number(e.target.value) }))} />
            <input type="number" className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Order" value={planDraft.order || 0} onChange={(e) => setPlanDraft((d) => ({ ...d, order: Number(e.target.value) }))} />
          </div>
          <select className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" value={planDraft.category} onChange={(e) => setPlanDraft((d) => ({ ...d, category: e.target.value }))}>
            <option value="upcoming">Upcoming</option>
            <option value="recurring">Recurring</option>
          </select>
          <div className="flex gap-2">
            <button disabled={saving} className="px-4 py-2 rounded-lg bg-white text-black font-medium">{planEditId ? "Update" : "Add"}</button>
            {planEditId && <button type="button" onClick={() => {
    setPlanEditId(null);
    setPlanDraft(emptyPlanDraft);
  }} className="px-4 py-2 rounded-lg border border-white/20">Cancel</button>}
          </div>
          <div className="space-y-2 pt-2 border-t border-white/10 max-h-56 overflow-auto">
            {plans.map((plan) => <div key={plan._id} className="rounded-lg border border-white/10 p-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-white font-medium">{plan.title}</p>
                  <p className="text-xs text-slate-300">{plan.type}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => {
    setPlanEditId(plan._id);
    setPlanDraft({ ...plan });
  }} className="px-2 py-1 rounded border border-white/20 text-xs">Edit</button>
                  <button type="button" onClick={async () => {
    await api.deletePlan(plan._id);
    setPlans(await api.getPlans());
    await refreshSeedCode();
  }} className="px-2 py-1 rounded border border-red-400/40 text-xs text-red-300">Delete</button>
                </div>
              </div>)}
          </div>
        </form>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveProject} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Title" value={projectDraft.title} onChange={(e) => setProjectDraft((d) => ({ ...d, title: e.target.value }))} required />
          <textarea className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Description" value={projectDraft.description} onChange={(e) => setProjectDraft((d) => ({ ...d, description: e.target.value }))} required />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Image URL" value={projectDraft.image || ""} onChange={(e) => setProjectDraft((d) => ({ ...d, image: e.target.value }))} />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Details Link" value={projectDraft.link || ""} onChange={(e) => setProjectDraft((d) => ({ ...d, link: e.target.value }))} />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Repo URL" value={projectDraft.repoUrl || ""} onChange={(e) => setProjectDraft((d) => ({ ...d, repoUrl: e.target.value }))} />
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Tags comma separated" value={projectDraft.tags.join(", ")} onChange={(e) => setProjectDraft((d) => ({ ...d, tags: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))} />
          <select className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" value={projectDraft.status} onChange={(e) => setProjectDraft((d) => ({ ...d, status: e.target.value }))}>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex gap-2">
            <button disabled={saving} className="px-4 py-2 rounded-lg bg-white text-black font-medium">{projectEditId ? "Update" : "Add"}</button>
            {projectEditId && <button type="button" onClick={() => {
    setProjectEditId(null);
    setProjectDraft(emptyProjectDraft);
  }} className="px-4 py-2 rounded-lg border border-white/20">Cancel</button>}
          </div>
          <div className="space-y-2 pt-2 border-t border-white/10 max-h-56 overflow-auto">
            {projects.map((project) => <div key={project._id} className="rounded-lg border border-white/10 p-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-white font-medium">{project.title}</p>
                  <p className="text-xs text-slate-300">{project.status}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => {
    setProjectEditId(project._id);
    setProjectDraft({ ...project, tags: project.tags || [] });
  }} className="px-2 py-1 rounded border border-white/20 text-xs">Edit</button>
                  <button type="button" onClick={async () => {
    await api.deleteProject(project._id);
    setProjects(await api.getProjects());
    await refreshSeedCode();
  }} className="px-2 py-1 rounded border border-red-400/40 text-xs text-red-300">Delete</button>
                </div>
              </div>)}
          </div>
        </form>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">Home Content</h2>
          <input className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Hero badge" value={home.heroBadge} onChange={(e) => setHome((d) => ({ ...d, heroBadge: e.target.value }))} />
          <textarea className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2" placeholder="Hero description" value={home.heroDescription} onChange={(e) => setHome((d) => ({ ...d, heroDescription: e.target.value }))} />
          <label className="block text-xs text-slate-300">Stats JSON</label>
          <textarea className="w-full min-h-[90px] rounded-lg bg-slate-950 border border-white/10 px-3 py-2 font-mono text-xs" value={statsJson} onChange={(e) => setStatsJson(e.target.value)} />
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">Future Plans Cards (Home)</h3>
            <p className="text-xs text-slate-300">
              Manage cards shown on the Home page section.
            </p>
            <form onSubmit={saveHomeFeatureDraft} className="space-y-2">
              <select
    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2"
    value={homeFeatureDraft.icon || "Lightbulb"}
    onChange={(e) => setHomeFeatureDraft((d) => ({ ...d, icon: e.target.value }))}
  >
                <option value="Lightbulb">Lightbulb</option>
                <option value="Users">Users</option>
                <option value="Calendar">Calendar</option>
              </select>
              <input
    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2"
    placeholder="Card title"
    value={homeFeatureDraft.title}
    onChange={(e) => setHomeFeatureDraft((d) => ({ ...d, title: e.target.value }))}
    required
  />
              <textarea
    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2"
    placeholder="Card description"
    value={homeFeatureDraft.desc}
    onChange={(e) => setHomeFeatureDraft((d) => ({ ...d, desc: e.target.value }))}
    required
  />
              <input
    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2"
    placeholder="CTA text (optional)"
    value={homeFeatureDraft.cta || ""}
    onChange={(e) => setHomeFeatureDraft((d) => ({ ...d, cta: e.target.value }))}
  />
              <input
    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2"
    placeholder="Link (optional, e.g. /plans)"
    value={homeFeatureDraft.link || ""}
    onChange={(e) => setHomeFeatureDraft((d) => ({ ...d, link: e.target.value }))}
  />
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-white text-black font-medium">
                  {homeFeatureEditIndex === null ? "Add Card" : "Update Card"}
                </button>
                {homeFeatureEditIndex !== null && <button
    type="button"
    onClick={() => {
      setHomeFeatureEditIndex(null);
      setHomeFeatureDraft(emptyHomeFeatureDraft);
    }}
    className="px-4 py-2 rounded-lg border border-white/20"
  >
                    Cancel
                  </button>}
              </div>
            </form>

            <div className="space-y-2 border-t border-white/10 pt-2 max-h-56 overflow-auto">
              {homeFeatures.map((feature, index) => <div key={`${feature.title}-${index}`} className="rounded-lg border border-white/10 p-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white font-medium">{feature.title}</p>
                    <p className="text-xs text-slate-300">{feature.desc}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {feature.icon || "Lightbulb"} {feature.link ? `| ${feature.link}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEditHomeFeature(index)} className="px-2 py-1 rounded border border-white/20 text-xs">Edit</button>
                    <button type="button" onClick={() => removeHomeFeature(index)} className="px-2 py-1 rounded border border-red-400/40 text-xs text-red-300">Delete</button>
                  </div>
                </div>)}
              {homeFeatures.length === 0 && <p className="text-xs text-slate-400">No future plan cards added yet.</p>}
            </div>
          </div>
          <button type="button" disabled={saving} onClick={saveHome} className="px-4 py-2 rounded-lg bg-white text-black font-medium">Save Home</button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-2">
        <h2 className="text-lg font-semibold text-white">Generated Seed Code</h2>
        <p className="text-xs text-slate-300">
          This code is your current frontend data state. Save it to <code>src/app/data/siteData.ts</code> to make admin changes reflect in code.
        </p>
        <textarea readOnly value={seedCode} className="w-full min-h-[260px] rounded-lg bg-slate-950 border border-white/10 p-3 text-xs text-slate-200 font-mono" />
      </div>
    </div>;
}
export {
  Admin
};
