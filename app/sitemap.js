import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "content/posts");
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function getAllPosts() {
  const fileNames = fs.readdirSync(blogDirectory);
  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(blogDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContent);

    return {
      url: `${baseUrl}/blog/${fileName.replace(/\.md$/, "")}`,
      lastModified: new Date(data.date),
    };
  });

  posts.sort((a, b) => b.date - a.date);
  return posts;
}

export default function sitemap() {
  try {
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not set.");
    }

    const posts = getAllPosts();

    return [
      {
        url: `${baseUrl}`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
      },
      ...posts,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return []; 
  }
}
