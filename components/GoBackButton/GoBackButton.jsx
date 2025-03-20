"use client";

import { useRouter } from "next/navigation";
import classes from "./goBackButton.module.css";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";

function GoBackButton({ url }) {
  const router = useRouter();
  return (
    <BasicButton
      onAction={() => router.push(url)}
      isIconOnly={true}
      startContent={
        <Icon name="ChevronLeft" strokeWidth={2} color="#edf1ff" />
      }
      buttonStyle={classes.goback_button}
    />
  );
}

export default GoBackButton;
