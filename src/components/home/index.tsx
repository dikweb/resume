"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  profile,
  jobs,
  projects,
  agentProjects,
  practiceProfile,
  learningTitle,
  learningIntro,
  learningCourses,
  type Course,
} from "./resumeData";
import { ProjectCard } from "./section-ui";
import NewResumeLayout from "./new-layout";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function LearningCard({ course }: { course: Course }) {
  return (
    <Card className="shadow-none border-border/60 hover:border-border transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-foreground">
            {course.title}
          </h3>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            系统学习 · 动手实践
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {course.position}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
          {course.points.map((point) => (
            <li key={point.title}>
              <b className="font-semibold text-foreground/80">{point.title}：</b>
              {point.desc}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          {course.tags.map((tag) => (
            <Badge key={tag.name} variant={tag.accent ? "default" : "secondary"}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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
              src={`${mediaBasePath}/avatars/avater.jpg`}
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
          {profile.role} · {profile.summary}
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
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {s.detail}
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
                key={job.company}
                className={
                  idx > 0 ? "pt-6 mt-6 border-t border-border/50" : "pt-2"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">
                        {job.company}
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        {job.role}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {job.range}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                      {job.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Project Experience ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          项目经历
        </h2>

        <div className="space-y-4">
          {projects.map((proj) => (
            <ProjectCard key={proj.title} project={proj} />
          ))}
        </div>
      </section>

      {/* ── 个人实践及发展方向 ── */}
      <section className="mb-12">
        <Card className="shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4">
            <h3 className="text-base font-semibold text-foreground">
              {practiceProfile.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {practiceProfile.intro}
              <b className="font-semibold text-foreground/80">
                {practiceProfile.highlight}
              </b>
              {practiceProfile.outro}
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4 shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4">
            <h3 className="text-base font-semibold text-foreground">
              {learningTitle}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {learningIntro}
            </p>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-4">
          {learningCourses.map((course) => (
            <LearningCard key={course.title} course={course} />
          ))}
        </div>
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
    </div>
  );
}
