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
