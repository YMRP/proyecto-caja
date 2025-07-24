import type { ButtonType } from "../types/types";

function Button({ type = "button", text, onClick, id }: ButtonType) {
  return (
    <button type={type} onClick={onClick} id={id} className='bg-green-600 p-2 text-white cursor-pointer rounded-2xl hover:bg-green-700 duration-200'>
      {text}
    </button>
  );
}
export default Button;
