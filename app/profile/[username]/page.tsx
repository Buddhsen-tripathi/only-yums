import { notFound } from "next/navigation";
import { supabaseAdminClient } from "@/lib/supabase";
import { fetchProfileData } from "@/lib/profile-data";
import { UserStats } from "@/components/profile/UserStats";
import { FeedGrid } from "@/components/feed/FeedGrid";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = supabaseAdminClient();
  const { username } = await params;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (userError || !user) {
    notFound();
  }

  const { user: profileUser, votes, posts, followers, following } = await fetchProfileData(supabase, user.id);

  if (!profileUser) {
    notFound();
  }

  return (
    <div className="section-container space-y-12">
      <UserStats
        displayName={profileUser.display_name}
        votesCount={votes.length}
        postsCount={posts.length}
        followersCount={followers}
        followingCount={following}
      />

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Posts</h2>
          <p className="text-sm text-muted-foreground">{profileUser.display_name}&apos;s food photos and recommendations.</p>
        </div>
        <FeedGrid initialPosts={posts} />
      </section>
    </div>
  );
}
