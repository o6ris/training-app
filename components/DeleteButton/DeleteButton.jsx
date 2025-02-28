import classes from "./deleteButton.module.css"
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";

function DeleteButton({ content, onConfirm }) {
  return (
    <PopupButton
      isIconOnly={true}
      buttonStyle={classes.remove_button}
      startContent={
        <Icon name="Trash" size={16} color="#ba0505" strokeWidth={2} />
      }
      content={content}
      onConfirm={onConfirm}
    />
  );
}

export default DeleteButton;
