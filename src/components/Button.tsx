import type { ButtonType } from "../types/types";
import "../assets/styles/Button.css";

function Button({ type = "button", text, onClick, id, className }: ButtonType) {
  return (
    <button type={type} onClick={onClick} id={id} className={className}>
      {text}
    </button>
  );
}
export default Button;
