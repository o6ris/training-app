import classes from "./editButton.module.css";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";

function EditButton({ content, onConfirm, onCancel, disableConfirm }) {
  return (
    <PopupButton
      isIconOnly={true}
      buttonStyle={classes.edit_button}
      startContent={
        <Icon name="Pencil" size={16} color="#1c2647" strokeWidth={2} />
      }
      content={content}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmButton="Edit"
      disableConfirm={disableConfirm}
    />
  );
}

export default EditButton;
