"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import classes from "./blogSection.module.css";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";
import Image from "next/image";
import Link from "next/link";
import ButtonLink from "@core/ui/Button/ButtonLink";

function BlogSection({ posts }) {
  const [slidesToScroll, setSlidesToScroll] = useState(3);

  useEffect(() => {
    const updateSlidesToScroll = () => {
      if (window.innerWidth < 600) {
        setSlidesToScroll(1);
      } else if (window.innerWidth < 1000) {
        setSlidesToScroll(2);
      } else {
        setSlidesToScroll(3);
      }
    };

    updateSlidesToScroll(); 
    window.addEventListener("resize", updateSlidesToScroll);

    return () => {
      window.removeEventListener("resize", updateSlidesToScroll);
    };
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({align: "start", slidesToScroll: slidesToScroll});
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={classes.carrousel_wrapper}>
      <h2>Blog section</h2>
      <div className={classes.embla} ref={emblaRef}>
        <div className={classes.embla__container}>
          {posts.map((post, i) => {
            return (
              <div className={classes.embla__slide} key={i}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={classes.image_container}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={600}
                    priority
                    className={classes.carrousel_image}
                  />
                </Link>
                <h3>{post.title}</h3>
              </div>
            );
          })}
          <div className={`${classes.embla__slide} ${classes.all_posts}`}>
            <ButtonLink url="/blog" buttonContent="Read more posts..." buttonStyle={classes.all_posts_button} />
          </div>
        </div>
      </div>
      <div className={classes.buttons}>
        <BasicButton
          isIconOnly={true}
          startContent={<Icon name="ChevronLeft" />}
          isDisabled={prevBtnDisabled}
          onAction={onPrevButtonClick}
          buttonStyle={classes.button}
        />
        <BasicButton
          isIconOnly={true}
          startContent={<Icon name="ChevronRight" />}
          isDisabled={nextBtnDisabled}
          onAction={onNextButtonClick}
          buttonStyle={classes.button}
        />
      </div>
    </div>
  );
}

export default BlogSection;
