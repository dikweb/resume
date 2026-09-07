import { ClassicResume } from "@/components/home/index";

export const metadata = {
  title: "丁凯 · 简历（打印版）",
};

export default function PdfPage() {
  return (
    <div className="pdf-root min-h-svh">
      <ClassicResume />
    </div>
  );
}
