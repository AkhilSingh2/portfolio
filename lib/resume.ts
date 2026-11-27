/** Text taken from Akhilendra_Singh_Resume.pdf. The phone number is intentionally absent. */

export const resumeSummary =
  "Full-Stack & Frontend Engineer (~6 years experience) with deep expertise in React, Next.js, TypeScript, HTML/CSS, and cloud-native engineering on AWS. Strong background building large-scale web applications, design systems, and AI-integrated workflows alongside Python/FastAPI backends, PostgreSQL, and Kubernetes. Experienced in code quality governance, CI/CD automation, and translating product requirements into resilient, high-performance systems.";

export const resumeSkills = [
  {
    id: "frontend",
    label: "Frontend & Web UI",
    items: [
      "React",
      "Next.js",
      "Vue.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Storybook",
      "Figma Prototyping",
      "Design Systems",
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    items: [
      "Python",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "DynamoDB",
      "RESTful APIs",
      "Celery",
      "SQS",
      "NetSuite / CRM Integrations",
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    items: [
      "AWS (Amplify, EKS, RDS, S3, ECR, IAM, SQS, Cognito, Secrets Manager, Route 53, SSO, multi-account)",
      "Kubernetes (Helm)",
      "KEDA (Autoscaling)",
      "Terraform",
      "Docker",
      "GitHub Actions",
      "Bitbucket",
    ],
  },
  {
    id: "ai",
    label: "AI, Media & Quality",
    items: [
      "Gemini LLM Integration",
      "Prompt Engineering",
      "RAG Architectures",
      "FFmpeg Media Pipelines",
      "Sentry",
      "Biome",
      "SonarQube",
      "Monorepo Architecture",
      "Jira SDLC",
    ],
  },
] as const;

export const resumeRoles = [
  {
    id: "kwalee",
    title: "Frontend Web Developer (Full-Stack)",
    org: "Kwalee — Bengaluru, India",
    dates: "Feb 2024 – Present",
    bullets: [
      "Creative Suite Platform: Architected and deployed full-stack platform for AI asset cataloging, recipe composition, and rendering using React, TypeScript, Python/FastAPI, and asynchronous Celery/SQS pipelines.",
      "Polyglot Translation System: Built frontend and co-developed ingestion pipelines supporting 30+ locales; integrated Gemini LLMs to benchmark agency translations with automated chrF scoring and Slack alerts.",
      "Media Composition Engine: Engineered an FFmpeg media pipeline supporting video, GIFs, audio overrides, chroma-keying, and VP9 rendering while resolving audio sample rate, alignment, and streaming edge cases.",
      "Reliability & Data Integrity: Implemented render/recipe deduplication signatures, pre-generation approvals to control compute costs, and idempotent retries to prevent orphaned assets or duplicate records.",
      "Next.js Migration (kwalee.com): Led migration to Next.js and Strapi CMS with parallel data fetching, hydration fixes, and bundle optimization, reducing page load times by 45%.",
      "Design System & Code Quality: Built reusable UI component packages in Figma, React, and Storybook—cutting frontend cycle times by 40%—and drove thorough code reviews and quality standards.",
      "FinSight Financial Platform: Set up FinSight monorepo and built Revenue Recognition module across React and FastAPI; integrated NetSuite accounting APIs and resolved financial upsert double-counting bugs.",
      "Cloud & Autoscaling Infrastructure: Provisioned Terraform infrastructure (ECR, RDS, S3, IAM) across environments and configured Helm + KEDA autoscaling for FFmpeg/upload workers handling up to 20,000 tasks/day.",
    ],
  },
  {
    id: "groove",
    title: "Frontend Developer",
    org: "Groove Digital — Remote",
    dates: "Nov 2023 – Jan 2024",
    bullets: [
      "SEO & Web Performance: Built SEO-optimized React landing pages, driving a 40% increase in organic web traffic and a 35% lift in user engagement within 3 months.",
      "UI Stability & Iteration: Resolved high-priority client-facing UI/UX issues and streamlined feedback loops, improving application stability by 20%.",
    ],
  },
  {
    id: "unthinkable",
    title: "Associate Software Engineer",
    org: "Unthinkable Solutions — Gurugram, India",
    dates: "Jan 2021 – Nov 2023",
    bullets: [
      "CMS & Desktop App: Engineered a custom CMS and macOS desktop application (Electron.js/Vue.js), cutting publishing turnaround time by 50% and increasing author productivity by 40%.",
      "Database & Cloud Setup: Designed MongoDB schemas and provisioned AWS cloud infrastructure, improving data retrieval efficiency by 35%.",
      "Frontend Delivery & Code Reviews: Drove multiple Vue.js frontend delivery tracks and peer code reviews, achieving a 95% on-time milestone rate and lifting client satisfaction ratings by 30%.",
    ],
  },
] as const;

export const resumeEducation = {
  degree: "Bachelor of Technology (B.Tech) – Computer Science Engineering",
  school: "Galgotias University, Greater Noida, UP",
  dates: "Apr 2021",
};

export const resumePlace = "Bengaluru, India";
