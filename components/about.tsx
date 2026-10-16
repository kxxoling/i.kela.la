"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        I'm a skilled Full-stack web developer with a passion for building innovative and user-friendly applications from scratch.
      </p>
      <p>
        My expertise extends across the entire software development life cycle, from implementing intuitive user interfaces to optimizing back-end functionality for seamless performance.
      </p>
      <p>
        I'm deeply committed to staying up-to-date with the latest advancements in technology, and I thrive on the challenge of exploring new and emerging tools and techniques.
      </p>
      <p>
        As a result, I'm always eager to take on new roles and responsibilities that push me to learn and grow as a developer.
      </p>
      <p>        
        I'm excited to leverage my skills and experience to create cutting-edge solutions that exceed expectations and deliver outstanding results.
      </p>
    </motion.section>
  );
}
