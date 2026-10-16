import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import einImg from "@/public/ein.jpg";
import beiyeImg from "@/public/beiye.png";
import yashiImg from "@/public/yashi.jpeg";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "GitHub",
    hash: "#github",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Beijing Information Science & Technology University (BISTU)",
    location: "Beijing, China",
    description:
      "Having completed a 4-year undergraduate education in Information Management and Information Systems at BISTU, starting in 2008.",
    icon: React.createElement(LuGraduationCap),
    date: "2008 - 2012",
  },
  {
    title: "Back-End Developer",
    location: "Beijing, China",
    description:
      "Worked at multiple startups as Back-End Developer & Full-Stack Developer, mainly focused on Python web development. Have experience with web frameworks like Django, Tornado, Flask, and databases like Redis, MySQL, Postgres, MongoDB, Elasticsearch, etc.",
    icon: React.createElement(CgWorkAlt),
    date: "2013 - 2017",
  },
  {
    title: "Full-Stack Developer",
    location: "Beijing, China",
    description:
      "Due to the difficulty of recruiting qualified front-end engineers in China, I gradually began to work on full-stack development, and developed many projects using Vue.js, react, and Next.js.",
    icon: React.createElement(FaReact),
    date: "2017 - present",
  },
] as const;

export const projectsData = [
  {
    title: "贝叶智能视频生成平台",
    description:
      "I worked as a full-stack developer on this startup project for 1 year. It's a complex project combined with Node.js video generator, React dashboard, Python web server and AI system.",
    tags: ["React", "react-query", "Prisma", "ffmpeg"],
    imageUrl: beiyeImg,
  },
  {
    title: "雅识信息管理后台&小程序",
    description:
      "Central content management, audit platform, and mobile client webview and WeChat applets, as well as the production and management of event pages.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "react-query"],
    imageUrl: yashiImg,
  },
  {
    title: "爱因互动管理后台",
    description:
      "Saas system of chat bot and partner dashboard with the ability of private deployment.",
    tags: ["React", "Django", "Elasticsearch", "MySQL"],
    imageUrl: einImg,
  },
] as const;

export const skillsData = [
  "TypeScript",
  "React",
  "Next.js",
  "Git",
  "TailwindCSS",
  "Prisma",
  "Redis",
  "PostgreSQL",
  "Python",
  "Django",
  "Flask",
] as const;
