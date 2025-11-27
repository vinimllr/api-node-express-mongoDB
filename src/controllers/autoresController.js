import NaoEncontrado from "../erros/Pagina404.js";
import autores from "../models/Autor.js";
//Importante: estamos usando uma instância do mongoose no comparativo, devemos então importar
//evitando referenceError

class AutorController {

  static listarAutores = async (req, res,next) => {
    try {
      const autoresResultado = await autores.find();
      res.status(200).json(autoresResultado);

    } catch (erro) {
      next(erro);
    }
  }

  static listarAutorPorId = async (req, res,next) => {

    try {
      const id = req.params.id;

      const autorResultado = await autores.findById(id);
      console.log(autorResultado)
      if (autorResultado != null) {
        res.status(200).send(autorResultado);
      } else {
       next(new NaoEncontrado(`Id do Autor não localizado.`))
      }
    } catch (erro) {
      next(erro);
    }
  }


  static cadastrarAutor = async (req, res, next) => {
    try {
      let autor = new autores(req.body);

      const autorResultado = await autor.save();

      res.status(201).send(autorResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  }


  static atualizarAutor = async (req, res, next) => {
    try {
      const id = req.params.id;

      //notação do mongoDB que significa que iremos usar o que vier no body para substituir o resultados
      //Sem o $set o mongoose entende que vamos substituir todos campos, sobrescrevando possivelmente campos
      //que não estão sendo usadoss
      await autores.findByIdAndUpdate(id, { $set: req.body });

      res.status(200).send({ message: "Autor atualizado com sucesso" });
    } catch (erro) {
      next(erro);
    }
  }

  static excluirAutor = async (req, res,next) => {
    try {
      const id = req.params.id;

      await autores.findByIdAndDelete(id);

      res.status(200).send({ message: "Autor removido com sucesso" });
    } catch (erro) {
      next(erro);
    }
  }


}

export default AutorController