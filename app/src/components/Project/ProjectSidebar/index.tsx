"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProjects } from "@/context/ProjectContext";
import { ProjectState } from "@prisma/client";
import { Project } from "@/interfaces/project.interface";
import Button from "@/components/Button";

export default function ProjectSidebar() {
  const { projects } = useProjects();
  const pathname = usePathname();
  const router = useRouter();

  const [sort, setSort] = useState<string>("asc");

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [filter, setFilter] = useState({
    [ProjectState.PLANNED]: true,
    [ProjectState.ACTIVE]: true,
    [ProjectState.PAUSED]: true,
    [ProjectState.DONE]: false,
  });

  const updateFilter = (state: ProjectState) => {
    setFilter({ ...filter, [state]: !filter[state] });
  };

  const isFiltered = (state: ProjectState | null) => {
    if (!state) {
      return true;
    }
    if (!filter[state]) {
      return false;
    }
    return true;
  };

  const toggleSort = () => {
    setSort(sort === "asc" ? "desc" : "asc");
  };

  const sortProjects = (a: Project, b: Project) => {
    if (sort === "asc") {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  };

  useEffect(() => {
    const savedFilter = localStorage.getItem("projectFilter");
    const savedSort = localStorage.getItem("projectSort");

    if (savedFilter) {
      setFilter(JSON.parse(savedFilter));
    }

    if (savedSort) {
      setSort(savedSort);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectFilter", JSON.stringify(filter));
    localStorage.setItem("projectSort", sort);
  }, [filter, sort]);

  return (
    <div className="mb-16 sm:mb-0">
      <div className="mb-3 flex items-center">
        <div className="grow-1 text-lg text-gray-400">Projects</div>
        <Button
          label="Add"
          size="xs"
          style="secondary-highlight"
          onClick={() => router.push("/projects/new")}
        />
      </div>

      <div className="my-5 rounded border border-gray-300 px-2 py-1 text-sm">
        <div
          className="flex cursor-pointer items-center text-gray-300"
          onClick={() => setShowSettings(!showSettings)}
        >
          <div>Filter & Sort</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-auto size-4"
          >
            {!showSettings ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            )}
          </svg>
        </div>
        {showSettings && (
          <div className="mt-3">
            <div className="mb-2">
              <div className="mb-1 text-xs text-gray-600 uppercase">Filter</div>
              <ul className="text-gray-300">
                {Object.keys(ProjectState).map((state) => (
                  <li
                    key={state}
                    className="flex cursor-pointer items-center text-gray-300 hover:text-white"
                    onClick={() => updateFilter(state as ProjectState)}
                  >
                    <div className="text-xs">{state}</div>
                    <div className="ml-auto">
                      {filter[state as ProjectState].valueOf()
                        ? "visible"
                        : "hidden"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-1 text-xs text-gray-600 uppercase">Sort</div>
            <div
              className="mb-2 flex cursor-pointer text-xs text-gray-300 hover:text-white"
              onClick={toggleSort}
            >
              <div className="uppercase">Order</div>
              <div className="ml-auto">{sort}</div>
            </div>
          </div>
        )}
      </div>
      <ul className="mt-3">
        {projects
          .filter((project) => isFiltered(project.state))
          .sort(sortProjects)
          .map((project) => {
            const activeClassNames =
              pathname === `/projects/${project.id}`
                ? " text-gray-50 border-l-emerald-400"
                : " text-gray-300";
            return (
              <li key={project.id}>
                <Link
                  rel="stylesheet"
                  href={`/projects/${project.id}`}
                  className={"my-3 block"}
                >
                  <div
                    className={`hover:text-gray border-l-2 border-gray-800 py-1 pl-3 hover:border-l-emerald-400 hover:text-gray-50 ${activeClassNames}`}
                  >
                    {project.title}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
