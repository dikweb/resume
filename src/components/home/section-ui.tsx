import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "./resumeData";

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
