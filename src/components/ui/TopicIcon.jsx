import {
  Turtle,
  SquareKanban,
  KeyRound,
  Gamepad2,
  Cpu,
  ChartCandlestick,
  AppWindow,
  Activity,
  ArrowLeftRight,
  AudioLines,
  Blocks,
  BrickWall,
  Cable,
  ChartScatter,
  ChevronsUp,
  Container,
  Crosshair,
  FileCode,
  Fingerprint,
  Fish,
  Flag,
  GitPullRequest,
  Globe,
  Languages,
  Layers,
  ListOrdered,
  ListTree,
  Microscope,
  MonitorCheck,
  MonitorSmartphone,
  Network,
  Package,
  Radar,
  RefreshCw,
  Scale,
  ScanSearch,
  Shapes,
  Shield,
  ShieldCheck,
  ShieldHalf,
  Siren,
  Soup,
  Swords,
  Syringe,
  TestTubeDiagonal,
  TriangleAlert,
  Waypoints,
  Webhook,
  Workflow,
} from "lucide-react";
import { ToolLogo } from "./ToolLogo/ToolLogo";
import IBM_LOGO from "../../assets/Logos/ibm.svg"; // IBM 8-bar logo (Wikimedia Commons, public domain), thickened for the dark cards

// Icon of a tool or topic chip, shared by the Certifications and Projets modals: a drawn mark, a
// line icon for topics with no product logo, else a shared tool logo (nothing when there is none).

/** Windows mark (four panes), drawn here: Simple Icons no longer ships it. */
const WindowsMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size * 0.82, height: size * 0.82 }}>
    <path fill="#00a4ef" d="M0 3.4 9.8 2v9.5H0zM11 1.8 24 0v11.5H11zM0 12.5h9.8V22L0 20.6zM11 12.5h13V24l-13-1.8z" />
  </svg>
);

/** PowerShell mark: the blue slanted window with its prompt. */
const PowerShellMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path fill="#2b6fc6" d="M5.2 3.5h17.3c.7 0 1.1.6.9 1.2L19.6 19.4c-.2.6-.8 1.1-1.4 1.1H.9c-.7 0-1.1-.6-.9-1.2L3.8 4.6c.2-.6.8-1.1 1.4-1.1z" />
    <path d="m6.6 8 5 4-6.6 4.4M11.2 16.4h4.4" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Active Directory: Microsoft's three linked nodes, in Microsoft blue. */
const ActiveDirectoryMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M12 6 5.5 17.5h13z" fill="#0078d4" fillOpacity="0.25" stroke="#3a9be8" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="5.5" r="3.2" fill="#3a9be8" />
    <circle cx="5.2" cy="17.8" r="3.2" fill="#0078d4" />
    <circle cx="18.8" cy="17.8" r="3.2" fill="#50b0f0" />
  </svg>
);

// Offensive AI topics, drawn in the flat two-colour style of TryHackMe's room badges: the AI target in
// violet, the attack in red, the defence in teal.

/** AI pentesting: a chip in the crosshair. */
const AiPentestMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="5" y="5" width="14" height="14" rx="3" fill="#7c3aed" fillOpacity="0.3" stroke="#a78bfa" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3.3" fill="none" stroke="#f43f5e" strokeWidth="1.6" />
    <path d="M12 7.4v2M12 14.6v2M7.4 12h2M14.6 12h2" stroke="#f43f5e" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.1" fill="#f43f5e" />
  </svg>
);

/** LLM pentesting: a bug inside the chat bubble. */
const LlmPentestMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M4 3.5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z" fill="#a855f7" fillOpacity="0.28" stroke="#c084fc" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8.3 8.6l1.9.9M8.1 12.6l2-.5M15.7 8.6l-1.9.9M15.9 12.6l-2-.5M10.6 6.4l-.8-1M13.4 6.4l.8-1" stroke="#f43f5e" strokeWidth="1.3" strokeLinecap="round" />
    <ellipse cx="12" cy="11" rx="2.6" ry="3.4" fill="#f43f5e" />
    <circle cx="12" cy="7.2" r="1.4" fill="#f43f5e" />
  </svg>
);

/** Prompt hardening: a prompt behind a shield. */
const PromptHardeningMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M12 2 4 5.2v6c0 5 3.4 9.3 8 10.8 4.6-1.5 8-5.8 8-10.8v-6z" fill="#14b8a6" fillOpacity="0.3" stroke="#2dd4bf" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m8.4 9.3 2.6 2.2-2.6 2.2M12.6 14h3.4" fill="none" stroke="#f4f4f5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// AI building blocks, in the same flat two-colour style: violet for the models, sky for the agents.

/** Generative AI: a large and a small sparkle. */
const GenAiMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M10 2.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z" fill="#c084fc" />
    <path d="M18.5 13.5c.3 2.2 1.3 3.2 3.5 3.5-2.2.3-3.2 1.3-3.5 3.5-.3-2.2-1.3-3.2-3.5-3.5 2.2-.3 3.2-1.3 3.5-3.5z" fill="#f472b6" />
  </svg>
);

/** LLM: a chat bubble full of text. */
const LlmMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M4 3.5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z" fill="#a855f7" fillOpacity="0.28" stroke="#c084fc" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6.5 8h11M6.5 11h8M6.5 14h5" stroke="#f4f4f5" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/** RAG: a document feeding a model. */
const RagMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M3.5 2.5h8l3.5 3.5v11.5a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1z" fill="#f59e0b" fillOpacity="0.28" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5.5 8h6M5.5 11h6M5.5 14h4" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="18" cy="17.5" r="4.3" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.4" />
    <path d="M18 15.2c.2 1.3.9 2 2.2 2.2-1.3.2-2 .9-2.2 2.2-.2-1.3-.9-2-2.2-2.2 1.3-.2 2-.9 2.2-2.2z" fill="#f4f4f5" />
  </svg>
);

/** AI agents: a robot head. */
const AgentMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <path d="M12 2.5v3.5" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="2.6" r="1.4" fill="#f472b6" />
    <rect x="3.5" y="6.5" width="17" height="13" rx="3.5" fill="#0ea5e9" fillOpacity="0.28" stroke="#38bdf8" strokeWidth="1.6" />
    <path d="M1.5 11.5v4M22.5 11.5v4" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="9" cy="12.5" r="1.7" fill="#f4f4f5" />
    <circle cx="15" cy="12.5" r="1.7" fill="#f4f4f5" />
    <path d="M9.5 16.3h5" stroke="#f4f4f5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Prompt engineering: a prompt window with a sparkle. */
const PromptMark = ({ size }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size }}>
    <rect x="2" y="4" width="18" height="15" rx="2.5" fill="#7c3aed" fillOpacity="0.28" stroke="#a78bfa" strokeWidth="1.6" />
    <path d="m5.8 9.2 2.8 2.3-2.8 2.3M10.5 14.5h4" fill="none" stroke="#f4f4f5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5 1.5c.3 1.7 1 2.4 2.7 2.7-1.7.3-2.4 1-2.7 2.7-.3-1.7-1-2.4-2.7-2.7 1.7-.3 2.4-1 2.7-2.7z" fill="#f472b6" />
  </svg>
);

/** IBM Watson: IBM's own mark. */
const IbmMark = ({ size }) => <img src={IBM_LOGO} alt="" style={{ height: size * 0.6, width: "auto" }} />;

// Topics with no product logo: a line icon with its own colour and a tinted fill, so the chips read
// like the real logos around them. Red stays for attacks; defence in blues, AI in violet, tooling in amber.
const ICON_COLORS = {
  "Privilege Escalation": [ChevronsUp, "#f43f5e"],
  "Offensive Security": [Swords, "#f43f5e"],
  CTF: [Flag, "#f43f5e"],
  "MITRE ATT&CK": [Crosshair, "#fb7185"],
  "MITRE ATLAS": [Crosshair, "#fb7185"],
  "Prompt Injection": [Syringe, "#f43f5e"],
  "AI Threat Modelling": [Waypoints, "#fb923c"],
  "AI Forensics": [Fingerprint, "#f472b6"],
  Harness: [Cable, "#f59e0b"],
  "Threat Modelling": [Waypoints, "#fb923c"],
  SSDLC: [RefreshCw, "#2dd4bf"],
  "SAST / DAST": [ScanSearch, "#a78bfa"],
  Hardening: [ShieldHalf, "#60a5fa"],
  "Network Security": [BrickWall, "#f97316"],
  "Risk Management": [TriangleAlert, "#facc15"],
  "Incident Response": [Siren, "#ef4444"],
  "CI/CD Security": [Workflow, "#60a5fa"],
  "Dependency Management": [Package, "#d97706"],
  "Container Security": [Container, "#2496ed"],
  "Infrastructure as Code": [FileCode, "#8b5cf6"],
  "CAPA / FLOSS": [Microscope, "#e879f9"],
  Networking: [Network, "#22d3ee"],
  Web: [Globe, "#60a5fa"],
  "Security Concepts": [Shield, "#818cf8"],
  "Defensive Security": [ShieldCheck, "#3b82f6"],
  "IDS/IPS": [Radar, "#22d3ee"],
  Forensics: [Fingerprint, "#f472b6"],
  SIEM: [Activity, "#fb923c"],
  EDR: [MonitorCheck, "#60a5fa"],
  "Phishing Analysis": [Fish, "#38bdf8"],
  NLP: [Languages, "#22d3ee"],
  SDLC: [RefreshCw, "#2dd4bf"],
  "Unit Testing": [TestTubeDiagonal, "#4ade80"],
  "Software Architecture": [Blocks, "#60a5fa"],
  "Design Patterns": [Shapes, "#f59e0b"],
  "Code Review": [GitPullRequest, "#a78bfa"],
  "CI/CD": [Workflow, "#60a5fa"],
  "STT / TTS": [AudioLines, "#f472b6"],
  "REST API": [Webhook, "#fb923c"],
  BeautifulSoup: [Soup, "#facc15"],
  Requests: [ArrowLeftRight, "#38bdf8"],
  DOM: [ListTree, "#fb923c"],
  Responsive: [MonitorSmartphone, "#38bdf8"],
  "Chain-of-Thought": [ListOrdered, "#c084fc"],
  "Few-shot": [Layers, "#f472b6"],
  "Machine Learning": [ChartScatter, "#38bdf8"],
  "Deep Learning": [Network, "#a78bfa"],
  "Responsible AI": [Scale, "#2dd4bf"],
  // Project stacks with no logo of their own.
  "Gestion de projet": [SquareKanban, "#f59e0b"],
  Tkinter: [AppWindow, "#38bdf8"],
  Turtle: [Turtle, "#4ade80"],
  Pygame: [Gamepad2, "#facc15"],
  LibGDX: [Gamepad2, "#f87171"],
  httpx: [ArrowLeftRight, "#38bdf8"],
  VectorBT: [ChartCandlestick, "#2dd4bf"],
  "Microsoft Entra ID": [KeyRound, "#38bdf8"],
  Groq: [Cpu, "#fb923c"],
  // k3d runs k3s clusters inside Docker containers.
  k3d: [Container, "#326ce5"],
  Netcat: [Cable, "#f43f5e"],
};

/** Drawn marks for products Simple Icons no longer ships. */
const MARKS = {
  watsonx: IbmMark,
  FAISS: ({ size }) => <ToolLogo name="FAISS" size={size} tone="#38bdf8" />,
  Shapely: ({ size }) => <ToolLogo name="Shapely" size={size} tone="#38bdf8" />,
  Windows: WindowsMark,
  PowerShell: PowerShellMark,
  "Active Directory": ActiveDirectoryMark,
  "AI Pentesting": AiPentestMark,
  "LLM Pentesting": LlmPentestMark,
  "Prompt hardening": PromptHardeningMark,
  "Generative AI": GenAiMark,
  LLM: LlmMark,
  RAG: RagMark,
  "AI Agents": AgentMark,
  "Agents & sub-agents": AgentMark,
  "Prompt Engineering": PromptMark,
  "IBM Watson": IbmMark,
  "IBM watsonx": IbmMark,
  // Granite is IBM's model family.
  Granite: IbmMark,
};

/** Thin marks and wide wordmarks drawn larger so they read at chip size. */
const CHIP_SCALE = { "Kali Linux": 1.4, SQLMap: 1.35, Splunk: 1.35, Snort: 1.25 };

const TopicIcon = ({ name }) => {
  const Mark = MARKS[name];
  if (Mark) return <Mark size={18} />;
  const [Icon, color] = ICON_COLORS[name] ?? [];
  if (Icon) return <Icon size={18} color={color} fill={color} fillOpacity={0.18} strokeWidth={2.1} aria-hidden="true" className="shrink-0" />;
  return <ToolLogo name={name} size={Math.round(18 * (CHIP_SCALE[name] ?? 1))} onlyReal />;
};

export default TopicIcon;
