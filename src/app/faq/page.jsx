import MarkdownFetch from "@components/markdown/MarkdownFetch";

export const metadata = {
  title: "FAQ — NOTICA",
  description: "Frequently Asked Questions for NOTICA",
};

// use static generation for FAQ page
export const revalidate = false; // or：export const dynamic = "force-static";

export default function FaqPage() {
  return (
    <div>
      <MarkdownFetch
        src="/markdown/FAQ.md"
        errorText="Failed to load FAQ."
      />
    </div>
  );
}
