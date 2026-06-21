import { PortfolioData } from './types';

export const initialPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Navaneethakrishnan M K",
    title: "Data Analyst",
    email: "naveenkrishnamoorthi2004@gmail.com",
    phone: "7812850966",
    location: "Salem, Tamilnadu, India",
    github: "https://github.com/naveen-11122004",
    linkedin: "https://www.linkedin.com/in/navaneethakrishnan-krishnamoorthi-5a6094264",
    about: "Motivated Computer Technology student seeking an entry-level opportunity to apply programming, data analytics, and problem-solving skills while gaining practical experience. Enthusiastic about turning complex datasets into visual dashboards and engineering robust web applications to support business intelligence.",
    bio: "Passionate about data modeling, business insight, and clean web engineering. I translate raw analytics into interactive digital systems."
  },
  skills: [
    { name: "Power BI", level: 90, category: "Data Analytics" },
    { name: "Tableau", level: 85, category: "Data Analytics" },
    { name: "Python", level: 82, category: "Languages & Tools" },
    { name: "SQL", level: 85, category: "Database" },
    { name: "MongoDB", level: 75, category: "Database" },
    { name: "HTML & CSS", level: 88, category: "Frontend" },
    { name: "Flutter", level: 80, category: "Mobile Dev" },
    { name: "Firebase & Firestore", level: 82, category: "Backend" },
    { name: "TensorFlow & ML", level: 75, category: "AI & ML" }
  ],
  experience: [
    {
      company: "Vault of Codes",
      role: "Web Development Intern (Virtual)",
      startDate: "Jun 2023",
      endDate: "Jul 2023",
      description: [
        "Focused on modern web design principles, developing highly responsive and user-friendly web pages.",
        "Created interactive front-end layouts using semantic HTML, CSS styling paradigms, and JavaScript.",
        "Gained deep hands-on experience following front-end development best practices, cross-browser compatibility, and modular styling grids."
      ],
      technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    }
  ],
  projects: [
    {
      title: "Power BI Dashboards for Data-Driven Insights",
      description: "A comprehensive project delivering high-impact data analytics and business intelligence reports. Features custom-designed interactive visualization dashboards that extract and model corporate records into actionable operational graphs.",
      tags: ["Power BI", "Data Modeling", "DAX", "Data Visualization"],
      role: "Data Analyst Solo Developer",
      highlights: [
        "Built robust custom data models connecting disjointed operational sources.",
        "Engineered powerful DAX expressions for advanced time-intelligence and year-over-year growth analytics.",
        "Synthesized visually balanced dashboards delivering clear transactional indicators to end users."
      ]
    },
    {
      title: "Billing and Ecommerce Pluss",
      description: "A robust cross-platform mobile commerce application tailored for seamless store checkouts and product inventories, built on responsive mobile grids with synchronized cloud backends.",
      tags: ["Flutter", "Firebase", "Firestore DB", "Dart"],
      role: "Full-Stack Developer",
      highlights: [
        "Constructed fluid interfaces in Dart enabling secure product catalog browsing.",
        "Hooked up Firestore real-time listeners for instant synchronization of digital ledger and receipt status.",
        "Engineered secure, decentralized login states and user preferences cached natively in client states."
      ]
    },
    {
      title: "Hybrid Signatures of Liver Disease Classification",
      description: "An advanced biomedical computer vision system combining hybrid Deep Learning architectures to predict and classify liver disease stages from diagnostic scans.",
      tags: ["Python", "DenseNet", "YOLOv8", "Deep Learning", "TensorFlow"],
      role: "Deep Learning Engineer",
      highlights: [
        "Integrated DenseNet convolutional feature extractors to capture fine-grained medical patterns.",
        "Deployed YOLOv8 object location frameworks to detect localized diagnostic indicators.",
        "Iterated on neural parameters to maximize validation metrics and predictive accuracy."
      ]
    },
    {
      title: "Virtual Learning Environment for Remote Education",
      description: "An interactive pedagogical framework custom-built for web-based synchronous education, leveraging machine learning modules to enhance remote classrooms.",
      tags: ["PHP", "SQL", "HTML/CSS", "TensorFlow", "OpenCV"],
      role: "Full-Stack developer",
      highlights: [
        "Programmed robust backend services in PHP paired with relational SQL databases.",
        "Embedded OpenCV computer vision pipelines to analyze live participant attentitiveness.",
        "Configured custom Machine Learning classifiers to report average remote learning performance."
      ]
    }
  ],
  education: [
    {
      institution: "Kongu Engineering College",
      degree: "M.Sc. (Software Systems) - Integrated",
      fieldOfStudy: "Computer software engineering & systems",
      startDate: "2022",
      endDate: "2027 (Expected)",
      score: "CGPA: 7.2"
    },
    {
      institution: "GV Higher Secondary School",
      degree: "Higher Secondary Course (HSC)",
      fieldOfStudy: "Computer Science stream",
      startDate: "2020",
      endDate: "2022",
      score: "Percentage: 72.33%"
    },
    {
      institution: "Reliance Matric Higher Secondary School",
      degree: "Secondary School Leaving Certificate (SSLC)",
      fieldOfStudy: "General Schooling",
      startDate: "2019",
      endDate: "2020",
      score: "Percentage: 68.60%"
    }
  ],
  certifications: [
    {
      name: "Data Analytics Skill",
      issuer: "Oneroadmap",
      date: "2025"
    },
    {
      name: "Google Analytics Certification",
      issuer: "GOOGLE",
      date: "2025"
    },
    {
      name: "Power BI Workshop",
      issuer: "Office Master",
      date: "2025"
    },
    {
      name: "Data Analyst Certification",
      issuer: "Simplilearn",
      date: "2025"
    },
    {
      name: "Data Analytics Job Simulation",
      issuer: "Deloitte / Forage",
      date: "2025"
    },
    {
      name: "Data Analytics Essentials Course",
      issuer: "CISCO",
      date: "2025"
    },
    {
      name: "One Roadmap for Data Analyst",
      issuer: "Interactive Analytics",
      date: "2025"
    }
  ],
  achievements: [
    {
      title: "1st Prize in Web Development",
      issuer: "Sona Engineering College"
    },
    {
      title: "2nd Prize in Project Presentation",
      issuer: "Hackwave KEC"
    },
    {
      title: "2nd Prize in Project Presentation",
      issuer: "Ruby Day KEC"
    }
  ]
};
