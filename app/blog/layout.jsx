import classes from "./blog.module.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Header from "@components/Home/Header";

async function BlogLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <div className={classes.layout}>
      <Header session={session} />
      {children}
    </div>
  );
}

export default BlogLayout;
