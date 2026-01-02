import MarkdownFetch from "@components/markdown/MarkdownFetch";

export const metadata = {
  title: "Privacy Policy — NOTICA",
  description: "Privacy Policy for NOTICA",
};

// use static generation for FAQ page
export const revalidate = false; // or：export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div>
      <MarkdownFetch
        src="/markdown/PRIVACY.md"
        errorText="Failed to load privacy policy."
      />
    </div>
  );
}
