import { getServerSession } from "next-auth";

async function SavedSessions() {
  const session = await getServerSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const workoutsResponse = await fetch(
    `${baseUrl}/api/sessions?email=${session?.user.email}`,
    {
      method: "GET",
    }
  );
  const workouts = await workoutsResponse.json();
  return <div>SavedSessions</div>;
}

export default SavedSessions;
