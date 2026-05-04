"use client";

import { useParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CoursePage from "@/components/CoursePage";
import { MODULES } from "@/lib/modules";

export default function LearnModulePage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const moduleData = MODULES.find((m) => m.id === moduleId);

  if (!moduleData) {
    return (
      <div className="duo-shell duo-page-offset flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-4xl">🔍</p>
          <h1 className="text-xl font-extrabold text-[#2c5015]">
            Course not found
          </h1>
          <p className="text-sm text-[#4d6b3a]">
            The course <strong>{moduleId}</strong> does not exist.
          </p>
          <a href="/learn" className="duo-btn-primary px-6 py-2.5 text-sm">
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  return <CoursePage module={moduleData} />;
}
