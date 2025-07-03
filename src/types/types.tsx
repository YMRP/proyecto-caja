export type ButtonType = {
    type?: "button" | "submit" | "reset"; // este atributo es opcional
    text: string | React.ReactNode
     onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // función opcional con e también opcional
     id?: string
     className?: string
}

export type navElement = {
  href: string;
  value: string;
};


// types/types.ts
export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  foto_perfil?: string | null;
  activo?: boolean;
  autenticado_google?: boolean;
  fecha_creacion?: string;
  token_activacion?: string | null;
  token_expira?: string | null;
  fecha_cambio_password?: string
  password_anterior?: string
  intentos_fallidos?:number
  bloqueado?: boolean
  last_login?: string
  
  logs_sesion?: LogSesion[];
}

type LogSesion = {
  fecha_fin: string
  fecha_inicio:string
  ip_acceso:string
  id:number
};

export type HeaderPagesProps = {
  text: string
}
