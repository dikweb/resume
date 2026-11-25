"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Bot,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  profile,
  jobs,
  projects,
  agentProjects,
  type Project,
} from "./resumeData";
import { JobBody, ProjectCard } from "./section-ui";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function LeftPanel() {
  return (
    <aside className="h-fit rounded-2xl border border-border/60 bg-card shadow-sm px-6 py-6 flex flex-col gap-5 text-sm">
      <div className="flex flex-col items-center text-center gap-1">
        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-border shadow-md mb-1">
          <Image
            src={`${mediaBasePath}/avatars/avatar.webp`}
            alt={profile.name}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {profile.role}
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
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] leading-relaxed text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function WorkTab() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={`${job.company}-${job.range}`} className="shadow-none border-border/60">
          <CardContent className="pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
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
              <span className="text-xs text-muted-foreground">{job.range}</span>
            </div>
            <JobBody job={job} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProjectTab({ list }: { list: Project[] }) {
  return (
    <div className="space-y-4">
      {list.map((proj) => (
        <ProjectCard
          key={proj.title}
          project={proj}
          className="shadow-none border-border/60"
        />
      ))}
    </div>
  );
}

const tabMeta = [
  { value: "agent", label: "Agent 项目", icon: Bot },
  { value: "work", label: "工作经历", icon: Briefcase },
  { value: "project", label: "其他项目", icon: FolderKanban },
];

export default function NewResumeLayout() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
        <LeftPanel />

        <div className="rounded-2xl border border-border/60 bg-card shadow-sm px-5 py-5 md:px-7">
          <Tabs defaultValue="agent" className="w-full">
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
              <ProjectTab list={projects} />
            </TabsContent>
            <TabsContent value="agent" className="mt-4">
              <ProjectTab list={agentProjects} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
