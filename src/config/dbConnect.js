import mongoose from "mongoose";

async function conectarDataBase(){
mongoose.connect(process.env.DB_CONNECTION_STRING);

return mongoose.connection;
}


export default conectarDataBase;