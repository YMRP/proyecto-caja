import React, { type ReactNode } from "react";

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
  icon?: string  | ReactNode
  onClick?: ()=> void
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
  password_sugerido?: string
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
  className?: string
}

export type AsignacionProps = {
  id: number;
  version_id: number;
  numero_version: string;
  tipo_asignacion: "control" | "revision";
  revisado: boolean;
  fecha_revision: string | null;
  documento_titulo: string;
  fecha_asignacion: string;
}

export type Documento= {
  id: number;
  nombre_documento: string;
  nombre_archivo: string;
  version: string;
  fecha_subida: string;
}

export type DocumentoFiltrado = {
  id: number;
  documento: number;
  numero_version: number;
  nombre_archivo: string;
  archivo_path: string;
  tipo_archivo: string;
  tipo_categoria: string;
  tipo_categoria_display: string;
  fecha_carga: string;
  firmado_por: string;
  autorizado_por: string;
  usuario_editor: number;
  es_ultima: boolean;
};
