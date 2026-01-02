import MarkdownFetch from "@components/markdown/MarkdownFetch";

export const metadata = {
  title: "Terms of Service — NOTICA",
  description: "Terms of Service for NOTICA",
};

// use static generation for FAQ page
export const revalidate = false; // or：export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div>
      <MarkdownFetch
        src="/markdown/TERMS.md"
        errorText="Failed to load terms of service."
      />
    </div>
  );
}
