// app/blog/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const blogDirectory = path.join(process.cwd(), 'content/posts');

async function getPostData(slug) {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return { ...data, content: contentHtml };
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPostData(slug);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags.join(),
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
      authors: [baseUrl],
      images: [
        {
          url: `${baseUrl}${post.image}`,
          width: 1024,
          height: 576,
          alt: post.title,
          type: 'image/png',
        },
      ],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = params;
  const post = await getPostData(slug);

  return (
    <div>
      <div className="markdown_content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
