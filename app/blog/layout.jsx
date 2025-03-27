import classes from "./blog.module.css";

async function BlogLayout({ children }) {
  return <div className={classes.layout}>{children}</div>;
}

export default BlogLayout;
