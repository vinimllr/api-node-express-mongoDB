import mongoose from "mongoose";

const livroSchema = new mongoose.Schema(
  {
    id: {type: String},
    titulo: {type: String, required: true},
    //Referenciando o modelo de autor
    //Vale lembrar que a ref precisa ser exatamente o que definimos na model, além disso
    //na hora de registrar vai funcionar "parecido" com uma fk, mandando o id do autor
    autor: {type: mongoose.Schema.Types.ObjectId, ref: 'autores', required: true},
    editora: {type: String, required: true},
    numeroPaginas: {type: Number}
  }
);

const livros= mongoose.model('livros', livroSchema);

export default livros;