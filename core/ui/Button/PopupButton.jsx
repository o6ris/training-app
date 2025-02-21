import { useState, useEffect } from "react";
import classes from "./popupButton.module.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function PopupButton({
  triggerAction,
  onConfirm,
  onCancel,
  buttonStyle,
  triggerButtonContent,
  placement = "center",
  size = "md",
  title,
  content,
  isDisabled,
  isIconOnly,
  startContent,
  closebutton = "Cancel",
  confirmButton = "Confirm",
  confirmButtonStyle,
  autoOpen,
  isTransparent,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState("inside");

  useEffect(() => {
    if (autoOpen === true) {
      setTimeout(() => {
        onOpenChange(true);
      }, [1500]);
    }
  }, [autoOpen]);

  return (
    <>
      <Button
        className={buttonStyle}
        onPress={() => {
          onOpen();
          triggerAction && triggerAction();
        }}
        isDisabled={isDisabled}
        isIconOnly={isIconOnly}
        startContent={startContent}
      >
        {triggerButtonContent}
      </Button>
      <Modal
        backdrop="blur"
        size={size}
        scrollBehavior={scrollBehavior}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={placement}
        classNames={{
          base: `${
            isTransparent ? classes.wrapper_transparent : classes.wrapper
          }`,
          header: classes.header,
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={`${classes.text} ${classes.title}`}>
                {title}
              </ModalHeader>
              <ModalBody>
                <p className={classes.text}>{content}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className={`${classes.cancel_button} ${
                    isTransparent ? classes.cancel_transparent_button : ""
                  }`}
                  onPress={() => {
                    onClose();
                    onCancel && onCancel();
                  }}
                >
                  {closebutton}
                </Button>
                {onConfirm && (
                  <Button
                    className={`${confirmButtonStyle} ${classes.confirm_button}`}
                    onPress={() => {
                      onClose();
                      onConfirm();
                    }}
                  >
                    {confirmButton}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
