import classes from "./deleteButton.module.css"
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";

function DeleteButton({ content, onConfirm, confirmButton = "Delete" }) {
  return (
    <PopupButton
      isIconOnly={true}
      buttonStyle={classes.remove_button}
      startContent={
        <Icon name="Trash" size={16} color="#edf1ff" strokeWidth={2} />
      }
      content={content}
      onConfirm={onConfirm}
      confirmButton={confirmButton}
      confirmButtonStyle={classes.remove_button}
    />
  );
}

export default DeleteButton;
