import classes from "./home.module.css";
import ButtonLink from "@core/ui/Button/ButtonLink";

function page() {
  return (
    <main className={classes.main_wrapper}>
      <section className={classes.hero_wrapper}>
        <article className={classes.hero_content}>
          <h1>Track your Workouts.
            <br />
            See your Progress.
            <br />
            Stay Motivated.</h1>
          <i>
            A simple and effective way to track your
            performance, and stay consistent with your fitness goals.
          </i>
          <ButtonLink
            url={"/login"}
            buttonContent={"Get Started"}
            buttonStyle={classes.cta}
          />
        </article>
      </section>
      <section className={classes.benefits_wrapper}>
        <h2>Why track you Workouts?</h2>
        <div>
          <article>
            <h3>Progress is Motivation</h3>
            <p>Seeing improvement keeps you going.</p>
          </article>
          <article>
            <h3>Avoid plateaus</h3>
            <p>Identify when you stom progressing and adjut.</p>
          </article>
          <article>
            <h3>Train smarter, Not harder</h3>
            <p>Optimize workouts based on Your data.</p>
          </article>
          <article>
            <h3>Stay accountable</h3>
            <p>Keep history of your workouts forever.</p>
          </article>
        </div>
      </section>
      <section></section>
    </main>
  );
}

export default page;
