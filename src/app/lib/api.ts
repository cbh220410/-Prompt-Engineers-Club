import { seedSiteData } from "../data/siteData";

export type Project = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  repoUrl?: string;
  tags: string[];
  status: "Completed" | "In Progress" | "Planning";
  createdAt?: string;
  updatedAt?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Plan = {
  _id: string;
  title: string;
  type: string;
  attendees?: number;
  description: string;
  category: "upcoming" | "recurring";
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  avatarUrl?: string;
};

export type ChatServer = {
  _id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isMember: boolean;
};

export type ChatServerMember = {
  _id: string;
  username: string;
  avatarUrl?: string;
  role: "admin" | "user";
};

export type ChatMessage = {
  _id: string;
  serverId: string;
  content: string;
  createdAt: string;
  editedAt?: string;
  user: AuthUser;
  replyTo?: {
    _id: string;
    content: string;
    user: AuthUser | null;
  } | null;
  reactions?: Array<{
    emoji: string;
    users: string[];
    count: number;
  }>;
};

export type HomeStat = {
  label: string;
  value: string;
};

export type HomeFeature = {
  icon?: string;
  title: string;
  desc: string;
  link?: string;
  cta?: string;
};

export type HomeContent = {
  _id?: string;
  heroBadge: string;
  heroDescription: string;
  stats: HomeStat[];
  features: HomeFeature[];
};

export type ContactSubmission = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type LocalDataStore = {
  projects: Project[];
  team: TeamMember[];
  plans: Plan[];
  home: HomeContent;
  contacts: ContactSubmission[];
};

const STORAGE_KEY = "pec_frontend_data_v1";
const STORAGE_EVENT = "pec_frontend_data_changed";
const DISCORD_CONTACT_WEBHOOK_URL =
  import.meta.env.VITE_DISCORD_CONTACT_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1483389894414958692/3rjsr-Y-eTXpo8rK8rzLnEEoMoqu2dyb9OrmE1yY7YHva3Bufgqr8NWguz5RHeoAjMXT";
const BASELINE_TEAM_MEMBERS: TeamMember[] = [
  {
    _id: "team_001",
    name: "REVANTH",
    role: "CORE",
    bio: "BIO-Y24",
    image: "",
    linkedin: "https://www.linkedin.com/in/revanth-jaladi-800081345/",
    github: "",
    email: "REVANTHJALADI16@GMAIL.COM",
    order: 0,
  },
  {
    _id: "team_002",
    name: "ASHOK",
    role: "CORE",
    bio: "BIO-Y24",
    image: "",
    linkedin: "",
    github: "https://github.com/LunoXD/PromptEngineersClub",
    email: "",
    order: 1,
  },
  {
    _id: "team_003",
    name: "GOPI KRISHNA",
    role: "CORE",
    bio: "BIO-Y22",
    image: "",
    linkedin: "https://www.linkedin.com/in/krishna-sai-08597a28a/",
    github: "",
    email: "",
    order: 2,
  },
  {
    _id: "team_004",
    name: "DEEPAK REDDY",
    role: "CORE",
    bio: "BIO-Y22",
    image: "",
    linkedin: "https://www.linkedin.com/in/deepakreddyyaramala20/",
    github: "",
    email: "",
    order: 3,
  },
];

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getSeedStore(): LocalDataStore {
  return normalizeStore(deepClone(seedSiteData));
}

function normalizeStore(raw: Partial<LocalDataStore> | null | undefined): LocalDataStore {
  return {
    projects: Array.isArray(raw?.projects) ? raw!.projects : [],
    team: mergeBaselineTeamMembers(Array.isArray(raw?.team) ? raw!.team : []),
    plans: Array.isArray(raw?.plans) ? raw!.plans : [],
    home: {
      heroBadge: raw?.home?.heroBadge || "",
      heroDescription: raw?.home?.heroDescription || "",
      stats: Array.isArray(raw?.home?.stats) ? raw!.home!.stats : [],
      features: Array.isArray(raw?.home?.features) ? raw!.home!.features : [],
    },
    contacts: Array.isArray(raw?.contacts) ? raw!.contacts : [],
  };
}

function readStore(): LocalDataStore {
  if (typeof window === "undefined") return getSeedStore();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = getSeedStore();
    writeStore(seeded, false);
    return seeded;
  }

  try {
    return normalizeStore(JSON.parse(raw) as LocalDataStore);
  } catch {
    const seeded = getSeedStore();
    writeStore(seeded, false);
    return seeded;
  }
}

function writeStore(store: LocalDataStore, notify = true) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  if (notify) window.dispatchEvent(new Event(STORAGE_EVENT));
}

function withStore<T>(update: (store: LocalDataStore) => T): T {
  const store = readStore();
  const result = update(store);
  writeStore(store);
  return result;
}

function sortProjects(projects: Project[]) {
  return [...projects].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

function sortTeam(team: TeamMember[]) {
  return [...team].sort((a, b) => {
    const orderDiff = (a.order || 0) - (b.order || 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.name || "").localeCompare(b.name || "");
  });
}

function sortPlans(plans: Plan[]) {
  return [...plans].sort((a, b) => {
    const categoryDiff = (a.category || "").localeCompare(b.category || "");
    if (categoryDiff !== 0) return categoryDiff;
    const orderDiff = (a.order || 0) - (b.order || 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.title || "").localeCompare(b.title || "");
  });
}

function parseTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((tag) => String(tag).trim())
    .filter(Boolean);
}

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function normalizePersonName(value: unknown) {
  return cleanText(value).toUpperCase();
}

function mergeBaselineTeamMembers(team: TeamMember[]) {
  const normalizedTeam = Array.isArray(team) ? team.map((member) => ({ ...member })) : [];
  const indexByName = new Map<string, number>();
  const baselineByName = new Map<string, TeamMember>();

  normalizedTeam.forEach((member, idx) => {
    indexByName.set(normalizePersonName(member.name), idx);
  });

  BASELINE_TEAM_MEMBERS.forEach((baselineMember) => {
    const key = normalizePersonName(baselineMember.name);
    baselineByName.set(key, baselineMember);
    const existingIndex = indexByName.get(key);

    if (existingIndex === undefined) {
      normalizedTeam.push({ ...baselineMember });
      indexByName.set(key, normalizedTeam.length - 1);
      return;
    }

    const existingMember = normalizedTeam[existingIndex];
    if (!cleanText(existingMember.bio)) {
      existingMember.bio = baselineMember.bio;
    }
    if (!cleanText(existingMember.role)) {
      existingMember.role = baselineMember.role;
    }
    if (!cleanText(existingMember._id)) {
      existingMember._id = baselineMember._id;
    }
    if (typeof existingMember.order !== "number" || Number.isNaN(existingMember.order)) {
      existingMember.order = baselineMember.order;
    }
  });

  normalizedTeam.forEach((member) => {
    const key = normalizePersonName(member.name);
    const baseline = baselineByName.get(key);
    if (baseline) {
      member.role = baseline.role;
      if (cleanText(baseline.linkedin)) {
        member.linkedin = baseline.linkedin;
      }
      if (cleanText(baseline.github)) {
        member.github = baseline.github;
      }
      if (key === "REVANTH") {
        member.bio = "BIO-Y24";
      }
    }
  });

  return normalizedTeam;
}

function toSeedModuleText(data: LocalDataStore) {
  return `export const seedSiteData = ${JSON.stringify(data, null, 2)};\n`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function createDiscordContactPayload(entry: ContactSubmission) {
  return {
    username: "Prompt Club Concierge",
    content: "New website contact request received.",
    embeds: [
      {
        title: "Contact Form Submission",
        color: 0x0ea5e9,
        description: `**Message**\n${entry.message}`,
        timestamp: entry.createdAt,
        fields: [
          { name: "Name", value: entry.name, inline: true },
          { name: "Email", value: entry.email, inline: true },
          { name: "Subject", value: entry.subject, inline: false },
        ],
      },
    ],
  };
}

async function sendContactToDiscord(entry: ContactSubmission) {
  const webhookUrl = String(DISCORD_CONTACT_WEBHOOK_URL || "").trim();
  if (!webhookUrl) {
    throw new Error("Discord webhook is not configured");
  }

  const payload = createDiscordContactPayload(entry);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return;
    throw new Error(`Discord webhook failed (${response.status})`);
  } catch {
    // Browser CORS-safe fallback for direct webhook calls in frontend-only mode.
    try {
      const formData = new FormData();
      formData.append("payload_json", JSON.stringify(payload));
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      return;
    } catch {
      throw new Error("Failed to send to Discord webhook");
    }
  }
}

const ADMIN_USER: AuthUser = {
  _id: "admin_local",
  username: "admin",
  email: "admin@local",
  role: "admin",
};

export const api = {
  getProjects: async () => sortProjects(readStore().projects),
  createProject: async (payload: Partial<Project>) =>
    withStore((store) => {
      const createdAt = nowIso();
      const created: Project = {
        _id: createId("project"),
        title: cleanText(payload.title),
        description: cleanText(payload.description),
        image: cleanText(payload.image),
        link: cleanText(payload.link),
        repoUrl: cleanText(payload.repoUrl),
        tags: parseTags(payload.tags),
        status: (payload.status as Project["status"]) || "Planning",
        createdAt,
        updatedAt: createdAt,
      };
      if (!created.title || !created.description) {
        throw new Error("Project title and description are required");
      }
      store.projects.push(created);
      return deepClone(created);
    }),
  updateProject: async (id: string, payload: Partial<Project>) =>
    withStore((store) => {
      const target = store.projects.find((project) => project._id === id);
      if (!target) throw new Error("Project not found");

      target.title = cleanText(payload.title ?? target.title);
      target.description = cleanText(payload.description ?? target.description);
      target.image = cleanText(payload.image ?? target.image);
      target.link = cleanText(payload.link ?? target.link);
      target.repoUrl = cleanText(payload.repoUrl ?? target.repoUrl);
      target.tags = parseTags(payload.tags ?? target.tags);
      target.status = (payload.status as Project["status"]) || target.status;
      target.updatedAt = nowIso();
      return deepClone(target);
    }),
  deleteProject: async (id: string) =>
    withStore((store) => {
      store.projects = store.projects.filter((project) => project._id !== id);
    }),

  getTeam: async () => sortTeam(readStore().team),
  createTeamMember: async (payload: Partial<TeamMember>) =>
    withStore((store) => {
      const createdAt = nowIso();
      const created: TeamMember = {
        _id: createId("team"),
        name: cleanText(payload.name),
        role: cleanText(payload.role),
        bio: cleanText(payload.bio),
        image: cleanText(payload.image),
        linkedin: cleanText(payload.linkedin),
        github: cleanText(payload.github),
        email: cleanText(payload.email),
        order: Number(payload.order || 0),
        createdAt,
        updatedAt: createdAt,
      };
      if (!created.name || !created.role) {
        throw new Error("Team member name and role are required");
      }
      store.team.push(created);
      return deepClone(created);
    }),
  updateTeamMember: async (id: string, payload: Partial<TeamMember>) =>
    withStore((store) => {
      const target = store.team.find((member) => member._id === id);
      if (!target) throw new Error("Team member not found");

      target.name = cleanText(payload.name ?? target.name);
      target.role = cleanText(payload.role ?? target.role);
      target.bio = cleanText(payload.bio ?? target.bio);
      target.image = cleanText(payload.image ?? target.image);
      target.linkedin = cleanText(payload.linkedin ?? target.linkedin);
      target.github = cleanText(payload.github ?? target.github);
      target.email = cleanText(payload.email ?? target.email);
      target.order = Number(payload.order ?? target.order ?? 0);
      target.updatedAt = nowIso();
      return deepClone(target);
    }),
  deleteTeamMember: async (id: string) =>
    withStore((store) => {
      store.team = store.team.filter((member) => member._id !== id);
    }),

  getPlans: async () => sortPlans(readStore().plans),
  createPlan: async (payload: Partial<Plan>) =>
    withStore((store) => {
      const createdAt = nowIso();
      const created: Plan = {
        _id: createId("plan"),
        title: cleanText(payload.title),
        type: cleanText(payload.type),
        attendees: Number(payload.attendees || 0),
        description: cleanText(payload.description),
        category: payload.category === "recurring" ? "recurring" : "upcoming",
        order: Number(payload.order || 0),
        createdAt,
        updatedAt: createdAt,
      };
      if (!created.title || !created.type || !created.description) {
        throw new Error("Plan title, type, and description are required");
      }
      store.plans.push(created);
      return deepClone(created);
    }),
  updatePlan: async (id: string, payload: Partial<Plan>) =>
    withStore((store) => {
      const target = store.plans.find((plan) => plan._id === id);
      if (!target) throw new Error("Plan not found");

      target.title = cleanText(payload.title ?? target.title);
      target.type = cleanText(payload.type ?? target.type);
      target.attendees = Number(payload.attendees ?? target.attendees ?? 0);
      target.description = cleanText(payload.description ?? target.description);
      target.category = payload.category === "recurring" ? "recurring" : target.category;
      if (payload.category === "upcoming") target.category = "upcoming";
      target.order = Number(payload.order ?? target.order ?? 0);
      target.updatedAt = nowIso();
      return deepClone(target);
    }),
  deletePlan: async (id: string) =>
    withStore((store) => {
      store.plans = store.plans.filter((plan) => plan._id !== id);
    }),

  getHomeContent: async () => deepClone(readStore().home),
  updateHomeContent: async (payload: HomeContent) =>
    withStore((store) => {
      store.home = {
        heroBadge: cleanText(payload.heroBadge),
        heroDescription: cleanText(payload.heroDescription),
        stats: Array.isArray(payload.stats)
          ? payload.stats.map((s) => ({ label: cleanText(s.label), value: cleanText(s.value) }))
          : [],
        features: Array.isArray(payload.features)
          ? payload.features.map((f) => ({
              icon: cleanText(f.icon),
              title: cleanText(f.title),
              desc: cleanText(f.desc),
              link: cleanText(f.link),
              cta: cleanText(f.cta),
            }))
          : [],
      };
      return deepClone(store.home);
    }),

  submitContact: async (payload: { name: string; email: string; subject: string; message: string }) => {
    const created: ContactSubmission = {
      _id: createId("contact"),
      name: cleanText(payload.name),
      email: cleanText(payload.email),
      subject: cleanText(payload.subject),
      message: cleanText(payload.message),
      createdAt: nowIso(),
    };
    if (!created.name || !created.email || !created.subject || !created.message) {
      throw new Error("All contact fields are required");
    }

    await sendContactToDiscord(created);
    withStore((store) => {
      store.contacts.push(created);
    });
    return { ok: true };
  },

  getDataSnapshot: async () => deepClone(readStore()),
  resetToSeedData: async () => {
    const seed = getSeedStore();
    writeStore(seed);
    return deepClone(seed);
  },
  getSeedModuleText: async () => toSeedModuleText(readStore()),
  copySeedModuleToClipboard: async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      throw new Error("Clipboard is not available in this browser");
    }
    await navigator.clipboard.writeText(toSeedModuleText(readStore()));
    return { ok: true };
  },
  downloadDataJson: async () => {
    if (typeof document === "undefined") return { ok: false };
    const snapshot = readStore();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pec-data-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    return { ok: true };
  },
  saveSeedModuleToFile: async () => {
    const w = window as Window & { showSaveFilePicker?: (options: unknown) => Promise<any> };
    if (!w.showSaveFilePicker) {
      throw new Error("File save picker is not supported. Use Copy Seed Code instead.");
    }

    const handle = await w.showSaveFilePicker({
      suggestedName: "siteData.ts",
      types: [
        {
          description: "TypeScript",
          accept: { "text/typescript": [".ts"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(toSeedModuleText(readStore()));
    await writable.close();
    return { ok: true };
  },
  onDataChange: (listener: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(STORAGE_EVENT, listener);
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener(STORAGE_EVENT, listener);
      window.removeEventListener("storage", listener);
    };
  },

  // Compatibility methods for legacy pages/routes
  adminLogin: async () => ({ token: "local_admin", username: "admin" }),
  verifyAdmin: async () => ({ ok: true }),
  signup: async () => {
    throw new Error("Signup is disabled in frontend-only mode");
  },
  login: async () => {
    throw new Error("Login is disabled in frontend-only mode");
  },
  googleLogin: async () => {
    throw new Error("Google login is disabled in frontend-only mode");
  },
  me: async () => ({ user: ADMIN_USER }),
  logout: async () => ({ ok: true }),
  updateProfile: async () => ({ user: ADMIN_USER }),

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const dataUrl = await fileToDataUrl(file);
    return { url: dataUrl };
  },

  getChatServers: async () => [],
  createChatServer: async () => ({ _id: createId("server"), name: "Local Server", isMember: true }),
  joinChatServer: async () => ({ ok: true }),
  getChatMessages: async () => [],
  getChatServerMembers: async () => [],
  sendChatMessage: async (_serverId: string, content: string) => ({
    _id: createId("msg"),
    serverId: "local",
    content,
    createdAt: nowIso(),
    user: ADMIN_USER,
  }),
  sendChatReplyMessage: async (_serverId: string, content: string) => ({
    _id: createId("msg"),
    serverId: "local",
    content,
    createdAt: nowIso(),
    user: ADMIN_USER,
  }),
  editChatMessage: async (_serverId: string, messageId: string, content: string) => ({
    _id: messageId,
    serverId: "local",
    content,
    createdAt: nowIso(),
    editedAt: nowIso(),
    user: ADMIN_USER,
  }),
  deleteChatMessage: async () => ({ ok: true }),
  toggleChatMessageReaction: async () => ({ _id: createId("msg"), serverId: "local", reactions: [] }),
};
