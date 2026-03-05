"use client";

import { useState, useEffect } from "react";
import { fetchPortfolioData } from "./portfolio";
import {
  student,
  gpa as staticGpa,
  activeCourses as staticActive,
  completedCourses as staticCompleted,
  practicalSkills as staticSkills,
} from "@/data/studentData";
import type { ActiveCourse, CompletedCourse, SkillCategory } from "@/data/studentData";

interface PortfolioState {
  gpaValue: number;
  presentationVideo: string;
  profilePhoto: string | null;
  active: ActiveCourse[];
  completed: CompletedCourse[];
  skills: SkillCategory[];
  loaded: boolean;
}

export function usePortfolio(studentSlug: string): PortfolioState {
  const slug = (studentSlug || "").trim() || "mata";
  const [state, setState] = useState<PortfolioState>({
    gpaValue: staticGpa.value,
    presentationVideo: student.presentationVideo,
    profilePhoto: null,
    active: staticActive,
    completed: staticCompleted,
    skills: staticSkills,
    loaded: false,
  });

  const fetch = () => {
    let cancelled = false;
    fetchPortfolioData(slug)
      .then((data) => {
        if (cancelled) return;
        setState({
          gpaValue: data.gpaValue,
          presentationVideo: data.presentationVideo,
          profilePhoto: data.profilePhoto,
          active: data.active,
          completed: data.completed,
          skills: data.skills,
          loaded: true,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          gpaValue: staticGpa.value,
          presentationVideo: student.presentationVideo,
          profilePhoto: null,
          active: staticActive,
          completed: staticCompleted,
          skills: staticSkills,
          loaded: true,
        });
      });
    return () => { cancelled = true; };
  };

  useEffect(() => {
    return fetch();
  }, [slug]);

  useEffect(() => {
    const onFocus = () => fetch();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return state;
}
