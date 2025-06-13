export type ButtonType = {
    type?: "button" | "submit" | "reset"; // este atributo es opcional
    text: string
     onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // función opcional con e también opcional
     id?: string
}

// export type FieldsGroup = {
//     text : string
//     type:"email" | "text" | "password" | string
//     placeholder?:string
//     id:string
//     className:string
    
// }