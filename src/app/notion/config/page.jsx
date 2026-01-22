"use client";

import NotionCard from "@components/notioncard/NotionCard";
import SignInButton from "@components/button/SignInButton";
import { useAuth } from "@auth/AuthContext";

const NotionConfigPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading session...</div>;
  if (!user) {
    return (
      <div>
        <p>Please sign in to view your configuration.</p>
        <SignInButton />
      </div>
    );
  }

  return <NotionCard />;
};

export default NotionConfigPage;
