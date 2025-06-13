import type { ButtonType } from "../types/types";
import "../assets/styles/Button.css";

function Button({ type = "button", text, onClick, id }: ButtonType) {
  return (
    <button type={type} onClick={onClick} id={id}>
      {text}
    </button>
  );
}
export default Button;
