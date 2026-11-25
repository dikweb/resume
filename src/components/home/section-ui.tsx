import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job, Project } from "./resumeData";

export function HighlightSection({
  items,
}: {
  items: { title: string; summary: string }[];
}) {
  return (
    <div className="space-y-px">
      {items.map((item) => (
        <div key={item.title} className="flex gap-2 text-sm py-1.5 pl-1">
          <span className="mt-[7px] w-1 h-1 shrink-0 rounded-full bg-muted-foreground/40" />
          <div className="min-w-0">
            <span className="font-medium text-foreground/90">{item.title}</span>
            <span className="text-muted-foreground ml-1">
              —— {item.summary}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function JobBody({ job }: { job: Job }) {
  if (job.stages?.length) {
    return (
      <div className="mt-3 space-y-4">
        {job.stages.map((stage, si) => (
          <div
            key={`${stage.role}-${stage.range}`}
            className={si > 0 ? "pt-4 border-t border-border/50" : ""}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {stage.label && (
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {stage.label}
                </span>
              )}
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                {stage.role}
              </span>
              <span className="text-xs text-muted-foreground">{stage.range}</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
              {stage.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-3">
              {stage.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

export function ProjectCard({
  project,
  className = "shadow-none border-border/60",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-foreground">
            {project.title}
          </h3>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {project.meta}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {project.intro}
        </p>

        {project.modules.map((module, mi) => (
          <div
            key={module.label}
            className={mi > 0 ? "pt-5 mt-5 border-t border-border/50" : "mt-5"}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-1.5 h-4 rounded-full ${module.chip}`} />
              <h4 className="text-sm font-semibold text-foreground/80">
                {module.label}
              </h4>
            </div>
            {module.parts.map((part, pi) => (
              <div key={pi} className={pi > 0 ? "mt-4" : ""}>
                {part.head && (
                  <div className="flex items-center gap-2 mb-3">
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
        ))}

        <div className="flex flex-wrap gap-2 mt-5">
          {project.tags.map((tag) => (
            <Badge
              key={tag.name}
              variant={tag.accent ? "default" : "secondary"}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
