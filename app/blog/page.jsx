// app/blog/page.tsx

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

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
    };
  });

  return posts;
}

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
