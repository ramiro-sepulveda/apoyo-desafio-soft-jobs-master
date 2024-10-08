import { pool } from './database/DB.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js'
import jsonwebtoken from 'jsonwebtoken';


const infoUsuario = async (Authorization) => {
  const token = Authorization.split("Bearer ")[1];
  const decoded = jsonwebtoken.verify(token, "az_AZ");
  const values = [decoded.email]
  const consulta = 'SELECT * FROM usuarios WHERE email = $1'
  const resultado = await pool.query(consulta, values)

  return resultado


}

const verificarCredenciales = async (email, password) => {
  const values = [email]
  const consulta = 'SELECT * FROM usuarios WHERE email = $1'
  const {
    rows: [usuario],
    rowCount
  } = await pool.query(consulta, values)
  const { password: passwordEncriptada } = usuario
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
  if (!passwordEsCorrecta || !rowCount) { throw { code: 401, message: 'Email o contraseña incorrecta' } }
}

const registrarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario
  const passwordEncriptada = bcrypt.hashSync(password)
  password = passwordEncriptada
  const values = [email, passwordEncriptada, rol, lenguage]
  const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)'
  await pool.query(consulta, values)
}



export { infoUsuario, verificarCredenciales, registrarUsuario }
