import "dotenv/config";
import app from './src/app.js'
import manipuladorDeErros from "./src/middleweres/ManipuladorDeErros.js";

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`)
})

app.use(manipuladorDeErros);