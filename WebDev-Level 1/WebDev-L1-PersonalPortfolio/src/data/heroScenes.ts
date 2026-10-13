import developerSceneImg from '../assets/images/rida_3d_developer_hero_1790488372035.webp';
import aiSceneImg from '../assets/images/hero_sameface_aiml_1790573465175.webp';
import fullStackSceneImg from '../assets/images/hero_sameface_fullstack_1790573480299.webp';
import researchSceneImg from '../assets/images/hero_sameface_research_1790573497531.webp';

export interface HeroSceneData {
  id: 'developer' | 'ai' | 'fullstack' | 'research';
  number: string;
  theme: string;
  badgeLabel: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  ambientGlow: string;
  technologies: {
    name: string;
    icon: string;
    role: string;
    depthFactor: number;
    initialPos: string;
  }[];
  interactiveTelemetry: {
    label: string;
    value: string;
    subtext: string;
  }[];
}

export const HERO_SCENES: HeroSceneData[] = [
  {
    id: 'developer',
    number: '01 / 04',
    theme: 'Software Engineering',
    badgeLabel: 'CORE ENGINEERING FOCUS',
    title: 'Software Engineering',
    subtitle: 'System Architecture • Clean OOP • Robust Pipelines',
    description: 'Engineering modular, maintainable software systems through solid object-oriented principles, algorithmic problem solving, and structured engineering practices.',
    image: developerSceneImg,
    accentColor: '#8b5cf6',
    ambientGlow: 'from-purple-600/35 via-violet-500/30 to-indigo-600/25',
    technologies: [
      { name: 'OOP Architecture', icon: 'FileCode', role: 'Java & Python', depthFactor: 1.4, initialPos: 'top-2 -left-4 sm:-left-6' },
      { name: 'Core Frontend', icon: 'Code', role: 'React.js', depthFactor: 1.6, initialPos: 'top-4 -right-4 sm:-right-6' },
      { name: 'System Design', icon: 'Layers', role: 'Modular Software', depthFactor: 1.3, initialPos: 'bottom-6 -left-3 sm:-left-6' },
      { name: 'Data Storage', icon: 'Database', role: 'MySQL & MongoDB', depthFactor: 1.5, initialPos: 'bottom-4 -right-3 sm:-right-6' }
    ],
    interactiveTelemetry: [
      { label: 'Core Languages', value: 'Python • Java', subtext: 'OOP & Backend Foundations' },
      { label: 'Core Capstone', value: 'GradExpert Engine', subtext: 'AI Assessment System' },
      { label: 'Engineering Focus', value: 'System Design', subtext: 'Modular & Maintainable' }
    ]
  },
  {
    id: 'ai',
    number: '02 / 04',
    theme: 'AI & Machine Learning',
    badgeLabel: 'APPLIED ARTIFICIAL INTELLIGENCE',
    title: 'AI & Natural Language Processing',
    subtitle: 'Semantic Vector Spaces • Cosine Similarity • NLP Evaluation',
    description: 'Applying NLP vector analysis, contextual embeddings, and machine learning scoring algorithms to revolutionize automated academic evaluation in GradExpert.',
    image: aiSceneImg,
    accentColor: '#a855f7',
    ambientGlow: 'from-fuchsia-600/35 via-purple-500/30 to-violet-600/25',
    technologies: [
      { name: 'NLP Engine', icon: 'Brain', role: 'Semantic Vectors', depthFactor: 1.5, initialPos: 'top-2 -left-4 sm:-left-6' },
      { name: 'Cosine Similarity', icon: 'Cpu', role: 'GradExpert Engine', depthFactor: 1.7, initialPos: 'top-4 -right-4 sm:-right-6' },
      { name: 'Model Evaluation', icon: 'Sparkles', role: 'Precision & Recall', depthFactor: 1.2, initialPos: 'bottom-6 -left-3 sm:-left-6' },
      { name: 'Python Stack', icon: 'FileCode', role: 'FastAPI & PyTorch', depthFactor: 1.5, initialPos: 'bottom-4 -right-3 sm:-right-6' }
    ],
    interactiveTelemetry: [
      { label: 'NLP Grading Rigor', value: '94.8% Match', subtext: 'Cosine Similarity Metric' },
      { label: 'Evaluation Speed', value: '~118 ms', subtext: 'Automated Pipeline' },
      { label: 'Batch Processing', value: '100% Deterministic', subtext: 'Objective & Subjective' }
    ]
  },
  {
    id: 'fullstack',
    number: '03 / 04',
    theme: 'Full-Stack Development',
    badgeLabel: 'FULL-STACK APPLICATION ARCHITECTURE',
    title: 'Full-Stack Web Architecture',
    subtitle: 'Frontend ➔ RESTful API ➔ Backend ➔ Normalized DB',
    description: 'Crafting responsive, high-performance web applications with React.js, Node.js microservices, and 3NF relational database systems for seamless digital experiences.',
    image: fullStackSceneImg,
    accentColor: '#06b6d4',
    ambientGlow: 'from-cyan-600/35 via-blue-500/30 to-purple-600/25',
    technologies: [
      { name: 'Interactive UI', icon: 'Code', role: 'React & Tailwind', depthFactor: 1.5, initialPos: 'top-2 -left-4 sm:-left-6' },
      { name: 'Backend Gateway', icon: 'Layers', role: 'Node.js & Express', depthFactor: 1.6, initialPos: 'top-4 -right-4 sm:-right-6' },
      { name: 'API Contracts', icon: 'Globe', role: 'RESTful Architecture', depthFactor: 1.3, initialPos: 'bottom-6 -left-3 sm:-left-6' },
      { name: 'Relational DB', icon: 'Database', role: 'MySQL 3NF Modeling', depthFactor: 1.5, initialPos: 'bottom-4 -right-3 sm:-right-6' }
    ],
    interactiveTelemetry: [
      { label: 'Featured System', value: 'Netflix Streaming', subtext: 'Auth & Catalogue API' },
      { label: 'Database Normalization', value: '3NF Standard', subtext: 'Relational Integrity' },
      { label: 'Web Engine', value: 'Client-Server REST', subtext: 'State & Event Sync' }
    ]
  },
  {
    id: 'research',
    number: '04 / 04',
    theme: 'Research & Future Direction',
    badgeLabel: 'APPLIED RESEARCH & CAREER DIRECTION',
    title: 'Research & System Security',
    subtitle: 'Machine Learning • Secure Systems • Applied Computing',
    description: 'Aspiring to contribute to high-impact applied research at labs like Google, investigating the intersection of machine learning systems, defensive security, and scalable software.',
    image: researchSceneImg,
    accentColor: '#38bdf8',
    ambientGlow: 'from-sky-600/35 via-indigo-500/30 to-purple-600/25',
    technologies: [
      { name: 'Research Inquiries', icon: 'Sparkles', role: 'Google Student Role', depthFactor: 1.5, initialPos: 'top-2 -left-4 sm:-left-6' },
      { name: 'System Security', icon: 'ShieldCheck', role: 'RBAC & Defensive OOP', depthFactor: 1.7, initialPos: 'top-4 -right-4 sm:-right-6' },
      { name: 'Neural Networks', icon: 'Brain', role: 'Loss Optimization', depthFactor: 1.3, initialPos: 'bottom-6 -left-3 sm:-left-6' },
      { name: 'Future Horizon', icon: 'Compass', role: 'Applied Computing', depthFactor: 1.5, initialPos: 'bottom-4 -right-3 sm:-right-6' }
    ],
    interactiveTelemetry: [
      { label: 'Target Position', value: 'Student Researcher', subtext: 'Google Applied Labs' },
      { label: 'Growth Vector', value: 'AI/ML + Systems', subtext: 'Multidisciplinary Vision' },
      { label: 'Ethical Computing', value: 'Defensive Security', subtext: 'Integrity by Design' }
    ]
  }
];
