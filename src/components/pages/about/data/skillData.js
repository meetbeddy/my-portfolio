export const skills = [
    {
        id: "react",
        name: "React",
        level: "Expert",
        years: 4,
        color: "#61DAFB",
        description: "Building complex UI components with React's latest features and patterns",
        technologies: ["Hooks", "Context API", "Redux", "Next.js", "Performance Optimization"],
        projects: [
            { name: "E-commerce Platform", link: "#projects/ecommerce" },
            { name: "Content Management System", link: "#projects/cms" }
        ]
    },
    {
        id: "nodejs",
        name: "Node.js",
        level: "Advanced",
        years: 3,
        color: "#68A063",
        description: "Creating robust backend services with a focus on scalability and performance",
        technologies: ["Express", "RESTful APIs", "Authentication", "Microservices"],
        projects: [
            { name: "User Management API", link: "#projects/user-api" },
            { name: "Payment Processing Service", link: "#projects/payment" }
        ]
    },
    {
        id: "nestjs",
        name: "NestJS",
        level: "Proficient",
        years: 2,
        color: "#E0234E",
        description: "Building enterprise-grade applications with TypeScript-based architecture",
        technologies: ["TypeORM", "Dependency Injection", "Modules", "Guards"],
        projects: [
            { name: "Content Delivery API", link: "#projects/content-api" }
        ]
    },
    {
        id: "uiux",
        name: "UI/UX",
        level: "Intermediate",
        years: 3,
        color: "#FF7EB6",
        description: "Designing intuitive interfaces with focus on user experience and accessibility",
        technologies: ["Wireframing", "Prototyping", "User Testing", "Responsive Design"],
        projects: [
            { name: "Design System", link: "#projects/design-system" }
        ]
    },
    {
        id: "problem",
        name: "Problem Solving",
        level: "Expert",
        years: 5,
        color: "#FFC107",
        description: "Analytical approach to complex technical challenges across different domains",
        technologies: ["Algorithms", "System Design", "Debugging", "Performance Tuning"],
        projects: [
            { name: "E-commerce Search Optimization", link: "#projects/search-opt" },
            { name: "Real-time Data Processing", link: "#projects/realtime" }
        ]
    }
];

export const masteryLevels = {
    "Beginner": { value: 20, description: "Basic understanding, can work with guidance" },
    "Intermediate": { value: 40, description: "Solid foundation, works independently on standard tasks" },
    "Proficient": { value: 60, description: "Comfortable with most aspects, consistent quality delivery" },
    "Advanced": { value: 80, description: "Deep understanding, can solve complex problems, can mentor others" },
    "Expert": { value: 100, description: "Mastery level, innovative solutions, thought leadership" }
};