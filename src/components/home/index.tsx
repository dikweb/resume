"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  profile,
  jobs,
  projects,
  agentProjects,
} from "./resumeData";
import { JobBody, ProjectCard } from "./section-ui";
import NewResumeLayout from "./new-layout";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type ViewMode = "new" | "classic";

function LayoutSwitch({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const items: { key: ViewMode; label: string }[] = [
    { key: "new", label: "新版 · Tab 布局" },
    { key: "classic", label: "经典版 · 长文" },
  ];
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 rounded-l-2xl rounded-r-none bg-background/80 backdrop-blur p-1 border border-r-0 border-border/60 shadow-md">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onChange(it.key)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            view === it.key
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<ViewMode>("new");
  return (
    <div className="w-full flex flex-col items-center">
      <LayoutSwitch view={view} onChange={setView} />
      {view === "new" ? <NewResumeLayout /> : <ClassicResume />}
    </div>
  );
}

export function ClassicResume() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-10">
      {/* ── Header ── */}
      <header className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-border shadow-lg">
            <Image
              src={`${mediaBasePath}/avatars/avatar.webp`}
              alt={profile.name}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {profile.name}
        </h1>
        <p className="mt-1.5 text-base font-light">
          {profile.role}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-sm text-muted-foreground">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Mail size={14} />
            {profile.email}
          </a>
          <a
            href={`tel:${profile.phone}`}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Phone size={14} />
            {profile.phone}
          </a>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap size={14} />
            {profile.school}
          </span>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* ── 专业技能 ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          专业技能
        </h2>
        <Card className="shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {profile.skills.map((s) => (
              <div key={s.name} className="text-sm">
                <div className="font-semibold text-foreground">{s.name}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs leading-relaxed text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Work Experience ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          工作经历
        </h2>

        <Card className="shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent>
            {jobs.map((job, idx) => (
              <div
                key={`${job.company}-${job.range}`}
                className={
                  idx > 0 ? "pt-6 mt-6 border-t border-border/50" : "pt-2"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">
                        {job.company}
                      </h3>
                      {job.note && (
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {job.note}
                        </span>
                      )}
                      {!job.stages && (
                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                          {job.role}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {job.range}
                    </p>
                    <JobBody job={job} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Agent 项目 ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          Agent 项目
        </h2>

        <div className="space-y-4">
          {agentProjects.map((proj) => (
            <ProjectCard key={proj.title} project={proj} />
          ))}
        </div>
      </section>

      {/* ── Project Experience ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          其他项目
        </h2>

        <div className="space-y-4">
          {projects.map((proj) => (
            <ProjectCard key={proj.title} project={proj} />
          ))}
        </div>
      </section>
    </div>
  );
}
