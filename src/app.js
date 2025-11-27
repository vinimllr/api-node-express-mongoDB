import express from "express";
import db from "./config/dbConnect.js"
import routes from "./routes/index.js"
import manipuladorDeErros from "./middleweres/ManipuladorDeErros.js";
import manipulador404 from "./middleweres/Manipulador404.js";

const connection = await db();

connection.on("error", console.log.bind(console, 'Erro de conexão'))
connection.once("open", () => {
  console.log('conexão com o banco feita com sucesso')
})

const app = express();
app.use(express.json())
routes(app);
app.use(manipulador404);

app.use(manipuladorDeErros);


export default app