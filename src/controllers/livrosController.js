import NaoEncontrado from "../erros/Pagina404.js";
import livros from "../models/Livro.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find()
        //basicamente pegue o campo autor, que contém um ID, e substitua pelo documento completo do autor.
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if(livroResultados != null){
        res.status(200).send(livroResultados);
      }else{
        next(new NaoEncontrado("Livro não localizado."))
      }
    } catch (erro) {
      next(erro);
    }
  }

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro)
    }
  }

  static atualizarLivro = async (req, res,next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndUpdate(id, { $set: req.body });

      res.status(200).send({ message: "Livro atualizado com sucesso" });
    } catch (erro) {
      next(erro);
    }
  }

  static excluirLivro = async (req, res,next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndDelete(id);

      res.status(200).send({ message: "Livro removido com sucesso" });
    } catch (erro) {
      next(erro);
    }
  }

  static listarLivroPorEditora = async (req, res,next) => {
    try {
      const editora = req.query.editora;

      const livrosResultado = await livros.find({ "editora": editora });

      res.status(200).send(livrosResultado);
    } catch (erro) {
      next(erro)
    }
  }



}

export default LivroController