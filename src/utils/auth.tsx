import bcrypt from 'bcryptjs'

//PARA EL HASHEDO DE CONTRASEÑA

export const hashPassword = async (password : string)=>{
    const salt =  await bcrypt.genSalt(10);
    return  await bcrypt.hash(password, salt)
}
