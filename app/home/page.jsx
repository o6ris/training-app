import classes from "./home.module.css";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Header from "@components/Home/Header";
import Hero from "@components/Home/Hero";
import Benefits from "@components/Home/Benefits";
import Chart from "@components/Home/Chart";
import WorkoutCalendar from "@components/Home/Protected/WorkoutCalendar";
import BlogSection from "@components/BlogSection/BlogSection";
import ButtonLink from "@core/ui/Button/ButtonLink";

export const metadata = {
  title: "GrindPAL | Track your fitness progress",
  description:
    "Track your workouts at the gym and monitor your progress with GrindPAL.",
  keywords: "workout, fitness, strength training, progress tracker, gym",

  openGraph: {
    title: "GrindPAL | Track your fitness progress",
    description:
      "Track your workouts at the gym and monitor your progress with GrindPAL.",
    url: "https://grind-pal.vercel.app",
    siteName: "GrindPAL",
    // images: [
    //   {
    //     url: "/cover.jpg",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GrindPAL | Track your fitness progress",
    description:
      "Track your workouts at the gym and monitor your progress with GrindPAL.",
    // images: ["/cover.jpg"],
  },
};

const blogDirectory = path.join(process.cwd(), "content/posts");
async function getAllPosts() {
  const fileNames = fs.readdirSync(blogDirectory);

  const topPosts = [];

  fileNames.forEach((fileName) => {
    const fullPath = path.join(blogDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContent);

    const post = {
      slug: fileName.replace(/\.md$/, ""),
      title: data.title,
      summary: data.summary,
      image: data.image,
      date: new Date(data.date),
    };

    topPosts.push(post);

    topPosts.sort((a, b) => b.date - a.date);
    if (topPosts.length > 5) {
      topPosts.pop();
    }
  });

  return topPosts;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const posts = await getAllPosts();

  return (
    <main className={classes.main_wrapper}>
      <Header session={session} />
      {session ? (
        <div className={classes.sub_wrapper}>
          <WorkoutCalendar session={session} />
          <ButtonLink
            url="/workouts"
            buttonContent={"Start Workout"}
            buttonStyle={classes.cta}
          />
        </div>
      ) : (
        <>
          <Hero session={session} />
          <Benefits />
          <Chart session={session} />
        </>
      )}
      <BlogSection posts={posts} />
      <div className="flex gap-2 mt-6 justify-center items-center">
        <Link className="text-xs text-gray-700" href="/terms-of-use">Terms of use</Link>
        <span className="text-xs text-gray-700">-</span>
        <Link className="text-xs text-gray-700" href="/privacy-policy">Privacy policy</Link>
      </div>
    </main>
  );
}
