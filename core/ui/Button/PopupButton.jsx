import React from "react";
import classes from "./popupButton.module.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function PopupButton({
  triggerAction,
  onConfirm,
  onCancel,
  buttonStyle,
  triggerButtonContent,
  placement = "center",
  title,
  content,
  isDisabled,
  isIconOnly,
  startContent,
  closebutton = "Cancel"
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={placement}
        classNames={{
          base: classes.wrapper,
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
                  className={classes.cancel_button}
                  onPress={() => {
                    onClose();
                    onCancel && onCancel();
                  }}
                >
                  {closebutton}
                </Button>
                {onConfirm && (
                  <Button
                    className={classes.confirm_button}
                    onPress={() => {
                      onClose();
                      onConfirm();
                    }}
                  >
                    Confirm
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
