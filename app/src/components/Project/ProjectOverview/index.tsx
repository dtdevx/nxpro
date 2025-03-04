"use client";
import React, { useEffect, useState } from "react";
import { Project, ProjectState } from "@prisma/client";
import ProjectItem from "../ProjectItem";

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  const projectsActive = projects
    .filter((project) => project.state === ProjectState.ACTIVE)
    .sort((a, b) => a.title.localeCompare(b.title));
  const projectsPaused = projects
    .filter((project) => project.state === ProjectState.PAUSED)
    .sort((a, b) => a.title.localeCompare(b.title));
  const projectsPlanned = projects
    .filter((project) => project.state === ProjectState.PLANNED)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="mb-10">
        <div className="text-sm font-semibold text-gray-500">
          <span className="font-bold text-emerald-200">ACTIVE</span> PROJECTS
        </div>
        {!projectsActive.length && (
          <div className="my-3 text-gray-500">There are no projects yet.</div>
        )}
        <div>
          <ul>
            {projectsActive.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
      <div className="mb-10">
        <div className="text-sm font-semibold text-gray-500">
          <span className="font-bold text-amber-400">PAUSED</span> PROJECTS
        </div>
        {!projectsPaused.length && (
          <div className="my-3 text-gray-500">There are no projects yet.</div>
        )}
        <div>
          <ul>
            {projectsPaused.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-500">
          <span className="font-bold text-gray-200">PLANNED</span> PROJECTS
        </div>
        {!projectsPlanned.length && (
          <div className="my-3 text-gray-500">There are no projects yet.</div>
        )}
        <div>
          <ul>
            {projectsPlanned.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
