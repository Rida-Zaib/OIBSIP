export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  detailedDescription?: string;
  highlights: string[];
  tags: string[];
  links: {
    github: string;
    live: string;
  };
  mockupType: 'gradexpert' | 'netflix' | 'hotel' | 'school';
  badge?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  iconName: string;
  skills: {
    name: string;
    badge?: string;
    description: string;
  }[];
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Rida Zaib",
    greeting: "Hi, I'm",
    role: "Software Engineer",
    subtitle: "AI/ML • Full-Stack Development • Software Systems",
    bio: "Software Engineering graduate with hands-on experience building full-stack applications and applying AI to real-world problems. Exploring machine learning, NLP, system design, and cybersecurity.",
    email: "ridazaibb04@gmail.com",
    location: "Punjab, Pakistan",
    nationality: "Pakistani",
    age: 22,
    linkedin: "https://www.linkedin.com/in/rida-zaib",
    github: "https://github.com/Rida-Zaib", // <-- apna GitHub profile link yahan daalo
    careerGoal: "Grow as a well-rounded engineer across AI/ML, software systems, and cyber security, and contribute to applied research.",
    aspiration: "Seeking opportunities such as Google Student Researcher to innovate at the intersection of AI models and scalable software architectures.",
    availability: "Available for Software Engineering & Research Roles"
  },
  
  education: {
    institution: "University of Gujrat",
    degree: "Bachelor of Science in Software Engineering (BSSE)",
    period: "2022 – 2026",
    status: "Degree Completed",
    highlights: [
      "Rigorous Software Engineering curriculum at University of Gujrat",
      "Focused on Data Structures, OOP, Software System Architecture, and AI",
      "Capstoning with GradExpert — an automated AI/NLP grading system",
      "Active participant in technical problem-solving & software engineering practices"
    ],
    coreSubjects: [
      "Object-Oriented Programming",
      "Data Structures & Algorithms",
      "Database Systems & Design",
      "Software Engineering Principles",
      "Artificial Intelligence Fundamentals",
      "Operating Systems & Architecture"
    ]
  },

  skillsCategories: [
    {
      title: "Programming Languages",
      description: "Core languages used for backend logic, algorithmic problem solving, and scripts",
      iconName: "Code2",
      skills: [
        { name: "Python", badge: "AI / Backend", description: "AI/ML algorithms, NLP models, and backend processing engines" },
        { name: "Java", badge: "Core OOP", description: "Desktop applications, OOP architecture, and system foundations" },
        { name: "JavaScript", badge: "Full-Stack", description: "Modern ES6+, asynchronous programming, and web interfaces" }
      ]
    },
    {
      title: "Web Development",
      description: "Frontend & backend modern web stack technologies",
      iconName: "Globe",
      skills: [
        { name: "React.js", badge: "Frontend", description: "Component-driven reactive UIs, state management, and SPA architecture" },
        { name: "Node.js", badge: "Runtime", description: "Server-side JavaScript environment and asynchronous API services" },
        { name: "HTML5", badge: "Markup", description: "Semantic, accessible modern web document structuring" },
        { name: "CSS3", badge: "Styling", description: "Modern responsive layouts, Flexbox/Grid, and smooth animations" },
        { name: "RESTful APIs", badge: "Integration", description: "Clean API contract design, JSON serialization, and HTTP protocols" }
      ]
    },
    {
      title: "Artificial Intelligence",
      description: "Applied intelligent algorithms and language understanding",
      iconName: "Cpu",
      skills: [
        { name: "Machine Learning fundamentals", badge: "Core AI", description: "Supervised & unsupervised learning models, regression, and classification" },
        { name: "Natural Language Processing", badge: "NLP Engine", description: "Text preprocessing, semantic similarity analysis, and automated grading" },
        { name: "Model Evaluation", badge: "Metrics", description: "Precision, recall, F1-scores, loss optimization, and performance benchmarking" }
      ]
    },
    {
      title: "Databases",
      description: "Structured relational and document storage paradigms",
      iconName: "Database",
      skills: [
        { name: "MySQL", badge: "RDBMS", description: "Relational schema design, normalization, joins, and indexing" },
        { name: "MongoDB", badge: "NoSQL", description: "Flexible document-based storage for fast schema iteration" },
        { name: "Relational Database Design", badge: "Architecture", description: "Entity-relationship modeling, integrity constraints, and query optimization" }
      ]
    },
    {
      title: "Tools & Practices",
      description: "Developer workflows, version control, and engineering standards",
      iconName: "Wrench",
      skills: [
        { name: "Git & GitHub", badge: "VCS", description: "Version control, branching workflows, pull requests, and collaboration" },
        { name: "VS Code", badge: "IDE", description: "Configured debugging environments, linters, and productive tooling" },
        { name: "Object-Oriented Design", badge: "Patterns", description: "Solid principles, encapsulation, inheritance, and clean polymorphism" },
        { name: "Agile / Scrum", badge: "Methodology", description: "Iterative sprints, task estimation, user stories, and continuous delivery" },
        { name: "Data Structures & Algorithms", badge: "CS Core", description: "Trees, graphs, dynamic programming, sorting, and algorithmic efficiency" }
      ]
    },
    {
      title: "Core Concepts",
      description: "Foundational software engineering methodologies",
      iconName: "Brain",
      skills: [
        { name: "Software Engineering Principles", badge: "Design", description: "Architectural cohesion, loose coupling, and maintainability" },
        { name: "System Design", badge: "Architecture", description: "Modular service separation, flow modeling, and reliable data contracts" },
        { name: "Problem Solving", badge: "Analytical", description: "Structured analytical debugging and edge-case resolution" },
        { name: "Research Methodology", badge: "Academic", description: "Literature review, experimental validation, and quantitative testing" }
      ]
    }
  ] as SkillCategory[],

  featuredProject: {
    id: "gradexpert",
    title: "GradExpert — Automated AI Grading Platform",
    subtitle: "Final Year Capstone Project",
    badge: "Capstone Spotlight",
    category: "AI & Web Application",
    description: "Designed and built an AI-powered platform that automatically grades student assignments and quizzes, significantly reducing manual grading effort for instructors.",
    detailedDescription: "GradExpert bridges the gap in academic evaluation by utilizing Natural Language Processing (NLP) to analyze both objective multiple-choice questions and subjective open-ended responses. Powered by a Python NLP engine and an intuitive web dashboard, instructors can create rubric-driven assessments, batch-process student submissions, inspect semantic similarity scores, and deliver rapid constructive feedback.",
    capabilities: [
      "Evaluates objective questions (MCQs, true/false) and subjective short/long answers",
      "Employs NLP semantic analysis to assess contextual understanding rather than exact keyword matches",
      "Custom Python grading engine with automated feedback generation",
      "Interactive web-based portal with dual access for instructors and students",
      "Rubric matching & customizable scoring parameters"
    ],
    tags: ["Python", "AI", "NLP", "Web Application", "Machine Learning", "FastAPI / Flask"],
    links: {
      github: "#", // Placeholder as per resume guidelines
      live: "#"
    },
    mockupType: "gradexpert" as const
  },

  projects: [
    {
      id: "netflix-clone",
      title: "Netflix Clone",
      category: "Full-Stack Web App",
      description: "Developed a full-stack video-streaming web application replicating core Netflix features, including browsing, search, and user authentication.",
      detailedDescription: "A responsive entertainment platform recreating modern streaming UI paradigms. Includes dynamic catalogue browsing with categorized movie carousels, instant keyword search, movie trailers, responsive backdrop visuals, and secure user session management.",
      highlights: [
        "Dynamic movie discovery categorized by genre and popularity",
        "Debounced live search functionality with instant thumbnail previews",
        "Full user authentication and responsive viewing across desktop and mobile",
        "Clean component architecture built with React and Node.js"
      ],
      tags: ["React", "HTML", "CSS", "Node.js", "REST APIs"],
      links: {
        github: "#",
        live: "#"
      },
      mockupType: "netflix" as const
    },
    {
      id: "hotel-management",
      title: "Hotel Management System",
      category: "Desktop Application (Java)",
      description: "Built a desktop application in Java (OOP) to manage room bookings, guest records, billing, and staff operations.",
      detailedDescription: "An end-to-end hotel administration system engineered with robust Object-Oriented Programming (OOP) principles. Supports real-time room inventory management, reservation lifecycles, automated invoice generation, guest check-in/check-out workflows, and staff scheduling.",
      highlights: [
        "Modular OOP architecture with clear separation of business logic and UI",
        "Automated room availability checking and instant billing calculation",
        "Persistent guest history and transaction record tracking",
        "Role-based administrative controls for hotel staff"
      ],
      tags: ["Java", "OOP", "Software Architecture", "Desktop UI"],
      links: {
        github: "#",
        live: "#"
      },
      mockupType: "hotel" as const
    },
    {
      id: "school-management",
      title: "School Management System",
      category: "Database & Enterprise System",
      description: "Developed a system to manage student records, attendance, grades, and class scheduling for administrative staff.",
      detailedDescription: "A comprehensive academic management system designed to streamline institutional administration. Leveraged Java OOP coupled with a normalized relational database backend to track student enrollments, teacher assignments, attendance metrics, report card generation, and timetable scheduling.",
      highlights: [
        "Normalized relational database backend ensuring data integrity and zero redundancy",
        "Comprehensive student profile and grading report generation",
        "Attendance tracking with automated monthly statistical summaries",
        "Conflict-free class scheduling and course allocation engine"
      ],
      tags: ["Java", "OOP", "Relational Database", "MySQL", "System Design"],
      links: {
        github: "#",
        live: "#"
      },
      mockupType: "school" as const
    }
  ] as ProjectItem[],

  researchInterests: [
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      description: "Exploring foundational ML models, automated evaluation systems, and neural architectures for solving real-world decision tasks.",
      status: "Active Exploration & Capstone",
      tags: ["Supervised Learning", "Classification", "Model Evaluation"]
    },
    {
      id: "nlp",
      name: "Natural Language Processing",
      description: "Analyzing text semantics, syntactic structures, and contextual answer evaluation in automated educational grading pipelines.",
      status: "Applied in GradExpert",
      tags: ["Semantic Similarity", "Text Mining", "Automated Assessment"]
    },
    {
      id: "software-systems",
      name: "Software Systems & Architecture",
      description: "Designing modular, testable, and scalable software architectures using solid OOP principles and reliable data contracts.",
      status: "Core Engineering Discipline",
      tags: ["System Design", "OOP Principles", "Microservices Concepts"]
    },
    {
      id: "cyber-security",
      name: "Cyber Security",
      description: "Investigating secure coding practices, authentication flows, data protection, and resilience in networked software applications.",
      status: "Growing Interest",
      tags: ["Secure Coding", "Auth Protocols", "Data Privacy"]
    },
    {
      id: "web-dev",
      name: "Web & Mobile Development",
      description: "Engineering performant, accessible, and reactive user interfaces that communicate seamlessly with distributed backend services.",
      status: "Production Ready",
      tags: ["React.js", "Node.js", "Full-Stack APIs"]
    }
  ]
};
