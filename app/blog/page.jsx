import classes from "./blog.module.css";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import ButtonLink from "@core/ui/Button/ButtonLink";

const blogDirectory = path.join(process.cwd(), "content/posts");

async function getAllPosts() {
  const fileNames = fs.readdirSync(blogDirectory);
  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(blogDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug: fileName.replace(/\.md$/, ""),
      title: data.title,
      summary: data.summary,
      image: data.image,
      date: new Date(data.date),
    };
  });

  posts.sort((a, b) => b.date - a.date);
  return posts;
}

export const metadata = {
  title: "GrindPal Blog - Fitness Tips & Training Strategies",
  description:
    "Explore expert fitness tips, workout guides, and the latest training strategies to optimize your performance and recovery on the GrindPal Blog.",
  keywords: [
    "fitness blog",
    "workout tips",
    "muscle growth",
    "strength training",
    "exercise guides",
    "training strategies",
  ].join(", "),
  openGraph: {
    title: "GrindPal Blog - Fitness Tips & Training Strategies",
    description:
      "Explore expert fitness tips, workout guides, and the latest training strategies to optimize your performance and recovery on the GrindPal Blog.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_API_URL}/blog`,
    images: [
      {
        url: `https://i.imgur.com/m3rOuOe.jpeg`,
        width: 1200,
        height: 630,
        alt: "GrindPal Blog Banner",
        type: "image/png",
      },
    ],
  },
};

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div className={classes.blog_wrapper}>
      <div className={classes.blog_header}>
        <p>
          Welcome to the GrindPal Blog! Here, we dive into expert fitness tips,
          effective workout strategies, and the science behind muscle growth.
          Whether you&apos;re a beginner or an advanced lifter, our articles
          will help you maximize your training and recovery. Stay informed, stay
          motivated, and keep pushing your limits!
        </p>
      </div>
      <ul className={classes.articles_list}>
        {posts.map((post) => (
          <li className={classes.one_article} key={post.slug}>
            <div className={classes.image_container}>
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={600}
                priority
                className={classes.carrousel_image}
              />
            </div>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <div className={classes.button_wrapper}>
              <ButtonLink
                url={`/blog/${post.slug}`}
                buttonContent="Read"
                buttonStyle={classes.button}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
