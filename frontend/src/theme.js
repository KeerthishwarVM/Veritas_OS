import { Youtube, Globe, Terminal, Camera } from 'lucide-react'

export const COLORS = { REAL: '#CCFF00', MISLEADING: '#FF5500', FAKE: '#FF2A2A', UNVERIFIED: '#8A8A8A' }
export const CLAIM_COLORS = { VERIFIED: '#CCFF00', UNPROVEN: '#FF5500', DEBUNKED: '#FF2A2A' }
export const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

export const TABS = [
  { id: 'youtube', label: 'YOUTUBE / SHORTS', Icon: Youtube },
  { id: 'web', label: 'ARTICLE & WEB LINKS', Icon: Globe },
  { id: 'text', label: 'RAW TEXT', Icon: Terminal },
  { id: 'photo', label: 'PHOTO SCAN', Icon: Camera },
]

export const PRESETS = [
  { label: 'Viral Conspiracy', text: "SHOCKING!!! Leaked documents PROVE that the government has been secretly adding mind-control chemicals to tap water for decades, and mainstream media is hiding it from YOU. Anonymous insiders say 9 out of 10 doctors have been silenced. Share this before it gets DELETED! Wake up, sheeple — they don't want you to know the truth." },
  { label: 'Health Clickbait', text: "Doctors HATE her! This one weird kitchen ingredient melts belly fat overnight and cures diabetes in just 3 days, no exercise needed. A miracle study reportedly shows 100% of people lost 20 pounds. Big Pharma is terrified of this secret — buy now before it's banned." },
  { label: 'Verified News Report', text: "The central bank held its benchmark interest rate steady on Wednesday, saying inflation had eased but remained above its 2% target. Officials said in a statement that future decisions would depend on incoming data. The decision was in line with expectations in a Reuters poll of economists, and the governor will speak to reporters later in the day." },
]

export const TEAM = [
  {
    name: 'KEERTHISHWAR VM',
    role: 'TEAM LEADER',
    bio: 'Spearheaded end-to-end full-stack architecture, system integration, and AI prompt engineering for VERITAS_OS in collaboration with the team.',
  },
  {
    name: 'JAGADEESH R',
    role: 'UI/UX LAYOUT SPECIALIST',
    bio: 'Conceptualized the Cyber-Brutalist visual direction, layout hierarchy, and interactive user interface concepts for the frontend.',
  },
  {
    name: 'LOKESHVARAN R',
    role: 'CORE FEATURES SPECIALIST',
    bio: 'Defined the core product roadmap and multi-modal verification feature set to ensure practical, real-world usability.',
  },
  {
    name: 'JEROME RICHARD',
    role: 'TEAM MANAGER',
    bio: 'Coordinated team workflows, milestone alignment, and cross-functional collaboration throughout the development lifecycle.',
  },
  {
    name: 'KAVI CHARAN D',
    role: 'CHIEF BUG HUNTER',
    bio: 'Led rigorous edge-case stress testing and quality assurance to identify and eliminate bugs prior to evaluation.',
  },
  {
    name: 'LOKESH R',
    role: 'DEMO WIZARD',
    bio: 'Orchestrated end-to-end live presentation workflows and real-world test scenarios to ensure seamless deployment demos.',
  },
];