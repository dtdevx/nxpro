"use client";
import Link from "next/link";
import React from "react";

interface ButtonProps {
  label: string;
  size?: "xs" | "sm" | "md" | "lg";
  style?:
    | "primary"
    | "secondary"
    | "secondary-dimmed"
    | "secondary-highlight"
    | "danger";
  onClick?: () => void;
  link?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  label,
  size = "md",
  style = "secondary",
  link = "",
  onClick = () => {},
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  if (!label) return null;

  const classNames = ["rounded font-semibold transition-colors"];

  switch (size) {
    case "xs":
      classNames.push("text-xs px-2 py-1");
      break;
    case "sm":
      classNames.push("text-sm px-3 py-1.5");
      break;
    case "md":
      classNames.push("text-base px-3 py-1.5");
      break;
    case "lg":
      classNames.push("text-lg px-4 py-2");
      break;
  }

  switch (style) {
    case "primary":
      classNames.push(
        "bg-emerald-600 text-emerald-50 hover:bg-emerald-700 hover:text-emerald-100",
      );
      break;
    case "secondary":
      classNames.push(
        "border border-gray-100 text-gray-50 hover:border-gray-400 hover:text-gray-300",
      );
      break;
    case "secondary-dimmed":
      classNames.push("border border-gray-400 text-gray-400");
      break;
    case "secondary-highlight":
      classNames.push(
        "border border-gray-100 text-gray-50 hover:border-emerald-400 hover:text-emerald-300",
      );
      break;
    case "danger":
      classNames.push(
        "border border-rose-500 text-rose-500 hover:border-rose-700 hover:text-rose-700",
      );
      break;
  }

  return (
    <>
      {link ? (
        <Link
          className={`${classNames.join(" ")} ${className} ${disabled ? "cursor-not-allowed" : className.includes("cursor") ? "" : "cursor-pointer"}`}
          href={link}
        >
          {label}
        </Link>
      ) : (
        <button
          type={type}
          disabled={disabled}
          className={`${classNames.join(" ")} ${className} ${disabled ? "cursor-not-allowed" : className.includes("cursor") ? "" : "cursor-pointer"}`}
          onClick={onClick}
        >
          {label}
        </button>
      )}
    </>
  );
}
