"use client";

import Profile from "@components/profile/Profile";
import SignInButton from "@components/button/SignInButton";
import { useAuth } from "@auth/AuthContext";

const MyProfile = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading session...</div>;
  if (!user) {
    return (
      <div>
        <p>Please sign in to view your profile.</p>
        <SignInButton />
      </div>
    );
  }

  return (
    <div>
      <Profile session={{ user, isNewUser: false }} />
    </div>
  );
};

export default MyProfile;
