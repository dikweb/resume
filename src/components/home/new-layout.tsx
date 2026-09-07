"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  profile,
  jobs,
  projects,
  practiceProfile,
  learningTitle,
  learningIntro,
  learningCourses,
  type ProjectModule,
} from "./resumeData";
import { HighlightSection } from "./section-ui";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function LeftPanel() {
  return (
    <aside className="h-fit rounded-2xl border border-border/60 bg-card shadow-sm px-6 py-6 flex flex-col gap-5 text-sm">
      <div className="flex flex-col items-center text-center gap-1">
        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-border shadow-md mb-1">
          <Image
            src={`${mediaBasePath}/avatars/avater.jpg`}
            alt={profile.name}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {profile.role}
          <br />
          {profile.summary}
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wider">
          联系方式
        </h3>
        <ul className="space-y-2 text-xs text-foreground/90">
          <li className="flex items-start gap-2">
            <Mail size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
            <a
              href={`mailto:${profile.email}`}
              className="break-all hover:underline"
            >
              {profile.email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Phone size={14} className="shrink-0 text-muted-foreground" />
            <a href={`tel:${profile.phone}`} className="hover:underline">
              {profile.phone}
            </a>
          </li>
          <li className="flex items-start gap-2">
            <GraduationCap
              size={14}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />
            <span>{profile.school}</span>
          </li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wider">
          专业技能
        </h3>
        <div className="space-y-2.5 text-xs">
          {profile.skills.map((s) => (
            <div key={s.name}>
              <div className="font-semibold text-foreground/90">{s.name}</div>
              <div className="text-muted-foreground leading-relaxed mt-0.5">
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ModuleBlock({ module }: { module: ProjectModule }) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-1.5 h-4 rounded-full ${module.chip}`} />
        <h4 className="text-sm font-semibold text-foreground/80">
          {module.label}
        </h4>
      </div>

      {module.parts.map((part, i) => (
        <div key={i} className={i > 0 ? "mt-3" : ""}>
          {part.head && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 ${part.headColor} rounded-sm shrink-0`}
              />
              <h5 className="text-xs font-semibold text-foreground/70">
                {part.head}
              </h5>
            </div>
          )}
          <HighlightSection items={part.items} />
        </div>
      ))}
    </div>
  );
}

function WorkTab() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.company} className="shadow-none border-border/60">
          <CardContent className="pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-foreground">
                  {job.company}
                </h3>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {job.role}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{job.range}</span>
            </div>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProjectTab() {
  return (
    <div className="space-y-4">
      {projects.map((proj) => (
        <Card key={proj.title} className="shadow-none border-border/60">
          <CardContent className="pt-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-foreground">
                  {proj.title}
                </h3>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {proj.meta}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {proj.intro}
            </p>

            {proj.modules.map((m) => (
              <ModuleBlock key={m.label} module={m} />
            ))}

            <div className="flex flex-wrap gap-2 mt-5">
              {proj.tags.map((t) => (
                <Badge
                  key={t.name}
                  variant={t.accent ? "default" : "secondary"}
                >
                  {t.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PracticeTab() {
  return (
    <div className="space-y-4">
      <Card className="shadow-none border-border/60">
        <CardContent>
          <h3 className="text-base font-semibold text-foreground">
            {practiceProfile.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {practiceProfile.intro}
            <b className="text-foreground">{practiceProfile.highlight}</b>
            {practiceProfile.outro}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-none border-border/60">
        <CardContent>
          <h3 className="text-base font-semibold text-foreground">
            {learningTitle}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {learningIntro}
          </p>
        </CardContent>
      </Card>

      {learningCourses.map((course) => (
        <Card key={course.title} className="shadow-none border-border/60">
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
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
            <ul className="mt-3 space-y-2">
              {course.points.map((p) => (
                <li key={p.title} className="text-sm leading-relaxed">
                  <span className="font-medium text-foreground/90">
                    {p.title}
                  </span>
                  <span className="block text-muted-foreground mt-0.5">
                    {p.desc}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-4">
              {course.tags.map((t) => (
                <Badge
                  key={t.name}
                  variant={t.accent ? "default" : "secondary"}
                >
                  {t.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const tabMeta = [
  { value: "work", label: "工作经历", icon: Briefcase },
  { value: "project", label: "项目经历", icon: FolderKanban },
  { value: "practice", label: "个人实践及发展方向", icon: Rocket },
];

export default function NewResumeLayout() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
        <LeftPanel />

        <div className="rounded-2xl border border-border/60 bg-card shadow-sm px-5 py-5 md:px-7">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="w-full h-auto gap-1 flex flex-wrap md:flex-nowrap">
              {tabMeta.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="flex-1 min-w-fit"
                  >
                    <Icon />
                    {t.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="work" className="mt-4">
              <WorkTab />
            </TabsContent>
            <TabsContent value="project" className="mt-4">
              <ProjectTab />
            </TabsContent>
            <TabsContent value="practice" className="mt-4">
              <PracticeTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
