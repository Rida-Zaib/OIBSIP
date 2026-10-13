import { jsPDF } from 'jspdf';
import { PORTFOLIO_DATA } from '../data/portfolio';

/**
 * Programmatically generates and downloads the authentic, professional,
 * recruiter-grade software engineering resume for Rida Zaib as 'Rida_Zaib_CV.pdf'.
 */
export function downloadRidaZaibCV(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Header Background accent band (subtle)
  doc.setFillColor(248, 247, 252);
  doc.rect(margin, y, contentWidth, 26, 'F');
  doc.setDrawColor(124, 58, 237); // Primary purple accent
  doc.setLineWidth(0.8);
  doc.line(margin, y + 26, margin + contentWidth, y + 26);

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text('RIDA ZAIB', margin + 4, y + 8);

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(109, 40, 217); // Purple-700
  doc.text('Software Engineer | AI & Systems Developer', margin + 4, y + 14);

  // Contact details line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text(
    `Email: ${PORTFOLIO_DATA.personal.email}   |   Location: Punjab, Pakistan   |   LinkedIn: linkedin.com/in/rida-zaib`,
    margin + 4,
    y + 20
  );

  y += 32;

  // Helper for Section Titles
  const addSectionTitle = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text(title.toUpperCase(), margin, y);
    
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.5, margin + contentWidth, y + 1.5);
    
    // Purple accent tick on left
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1.2);
    doc.line(margin, y + 1.5, margin + 12, y + 1.5);

    y += 5.5;
  };

  // 1. OBJECTIVE
  addSectionTitle('Career Objective');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);
  const objectiveText =
    'Software Engineering graduate with hands-on experience building full-stack applications and applying AI to real-world problems. Seeking a Google Student Researcher position to contribute to research in machine learning and software systems while continuing academic study in Computer Science.';
  const splitObjective = doc.splitTextToSize(objectiveText, contentWidth);
  doc.text(splitObjective, margin, y);
  y += splitObjective.length * 4 + 2;

  // 2. EDUCATION
  addSectionTitle('Education');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.text('University of Gujrat', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('2022 – 2026', margin + contentWidth - 20, y);
  y += 4;

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(109, 40, 217);
  doc.text('Bachelor of Science in Software Engineering (BSSE)   |   Degree Completed', margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(
    'Core Subjects: Data Structures & Algorithms, Object-Oriented Software Engineering, Database Systems, Artificial Intelligence, Software Architecture, Web Engineering, Discrete Mathematics.',
    margin,
    y,
    { maxWidth: contentWidth }
  );
  y += 6.5;

  // 3. PROJECTS
  addSectionTitle('Technical Projects');

  const addProject = (title: string, tech: string, bullets: string[]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(title, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(109, 40, 217);
    doc.text(`[${tech}]`, margin + contentWidth - doc.getTextWidth(`[${tech}]`), y);
    y += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);

    bullets.forEach((bullet) => {
      const bulletText = `•  ${bullet}`;
      const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 3);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 3.6;
    });
    y += 1;
  };

  addProject(
    'GradExpert — Automated Academic Grading System (Final Year Project)',
    'Python, NLP, Cosine Similarity, FastAPI, React.js',
    [
      'Architected an automated AI assessment engine evaluating subjective text responses and objective answer keys.',
      'Implemented Natural Language Processing (NLP) tokenization and cosine similarity matching for conceptual scoring.',
      'Developed real-time instructor dashboards supporting customizable grading rubrics and automated batch queue processing.',
    ]
  );

  addProject(
    'Netflix Clone (Full-Stack Streaming Platform)',
    'React.js, Node.js, Express, REST APIs, Tailwind CSS',
    [
      'Engineered a responsive video streaming interface with user authentication, catalogue browsing, and media player.',
      'Integrated RESTful API endpoints for asynchronous metadata fetching, search filtering, and state management.',
    ]
  );

  addProject(
    'Hotel Management System (Desktop Architecture)',
    'Java, Swing, OOP SOLID Principles',
    [
      'Engineered an object-oriented desktop application for room reservation, real-time occupancy monitoring, and automated billing computation.',
    ]
  );

  addProject(
    'School Management System (Relational Database)',
    'Java, MySQL, 3NF Normalization',
    [
      'Designed a normalized (3NF) relational database schema managing student enrollments, faculty allocations, and academic records.',
    ]
  );

  y += 1.5;

  // 4. TECHNICAL SKILLS
  addSectionTitle('Technical Skills');
  const skillsList = [
    { label: 'Programming Languages:', val: 'Python, Java, JavaScript (ES6+), SQL, HTML5, CSS3' },
    { label: 'Web Development:', val: 'React.js, Node.js, Express.js, RESTful APIs, Tailwind CSS' },
    { label: 'Artificial Intelligence:', val: 'Machine Learning fundamentals, Natural Language Processing (NLP), Model Evaluation' },
    { label: 'Databases:', val: 'MySQL, MongoDB, Relational Database Design (3NF Normalization)' },
    { label: 'Tools & Practices:', val: 'Git & GitHub, VS Code, Object-Oriented Design (OOP), Agile/Scrum, Data Structures & Algorithms' },
    { label: 'Core Concepts:', val: 'Software Engineering Principles, System Design, Problem Solving, Research Methodology' },
  ];

  skillsList.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 24, 39);
    doc.text(s.label, margin, y);
    const labelWidth = doc.getTextWidth(s.label) + 2;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const splitVal = doc.splitTextToSize(s.val, contentWidth - labelWidth);
    doc.text(splitVal, margin + labelWidth, y);
    y += Math.max(splitVal.length * 3.5, 3.8);
  });

  y += 2;

  // 5. ADDITIONAL INFO & CAREER GOAL
  addSectionTitle('Languages, Interests & Career Goal');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);

  doc.text('Languages: English (Proficient), Urdu (Native)', margin, y);
  y += 3.8;

  doc.text('Interests: Artificial Intelligence, Machine Learning, Ethical Hacking, Cyber Security, Mobile/Web App Development', margin, y);
  y += 3.8;

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(109, 40, 217);
  doc.text(
    'Career Goal: Grow as a well-rounded engineer across AI/ML, software systems, and cyber security, and contribute to applied research.',
    margin,
    y
  );

  // Footer subtle rule
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 8, margin + contentWidth, pageHeight - 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text('Rida Zaib • Official Software Engineering Resume • University of Gujrat', margin, pageHeight - 5);
  doc.text('Generated from Portfolio', margin + contentWidth - 30, pageHeight - 5);

  // Save the document with exact required filename
  doc.save('Rida_Zaib_CV.pdf');
}
