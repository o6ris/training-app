"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import classes from "./blogSection.module.css";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";

function BlogSection({ posts }) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  console.log("posts", posts)

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
    <div>
      <div className={classes.embla} ref={emblaRef}>
        <div className={classes.embla__container}>
          <div className={classes.embla__slide}>Slide 1</div>
          <div className={classes.embla__slide}>Slide 2</div>
          <div className={classes.embla__slide}>Slide 3</div>
        </div>
      </div>
      <div className="embla__buttons">
        <BasicButton
          isIconOnly={true}
          startContent={<Icon name="ChevronLeft" />}
          isDisabled={prevBtnDisabled}
          onAction={onPrevButtonClick}
        />
        <BasicButton
          isIconOnly={true}
          startContent={<Icon name="ChevronRight" />}
          isDisabled={nextBtnDisabled}
          onAction={onNextButtonClick}
        />
      </div>
    </div>
  );
}

export default BlogSection;
