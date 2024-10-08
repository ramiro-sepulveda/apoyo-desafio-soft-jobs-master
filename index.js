import express from "express";
import cors from "cors";
import { infoUsuario, verificarCredenciales, registrarUsuario } from "./consultas.js";
import jsonwebtoken from "jsonwebtoken";
import { pool } from "./database/DB.js";
import { reportMiddleware, requestLogger } from "./middlewares/middleWares.js";

const app = express();
const port = 3000;

app.use(reportMiddleware);
app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}!`));

app.get("/usuarios", async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const result = await infoUsuario(Authorization);
    res.json(result.rows[0]);
  }
  catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jsonwebtoken.sign({ email }, "az_AZ");
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("Usuario creado con éxito");
  } catch (error) {
    res.status(500).send(error);
  }
});


