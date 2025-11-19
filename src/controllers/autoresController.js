import autores from "../models/Autor.js";

class AutorController {

  static listarAutores = async(req, res) => {
    try {
      const autoresResultado = await autores.find();

      res.status(200).json(autoresResultado);
      
  } catch (erro) {
          res.status(500).json({ message: "Erro interno no servidor" });
  }
  }

  static listarAutorPorId = async (req, res) => {
    
      try {
        const id = req.params.id;
  
        const autorResultado = await autores.findById(id);
  
        res.status(200).send(autorResultado);
      } catch (erro) {
        res.status(400).send({message: `${erro.message} - Id do Autor não localizado.`});
      }
    }
  
  
    static cadastrarAutor = async (req, res) => {
      try {
        let autor = new autores(req.body);
  
        const autorResultado = await autor.save();
  
        res.status(201).send(autorResultado.toJSON());
      } catch (erro) {
        res.status(500).send({message: `${erro.message} - falha ao cadastrar Autor.`});
      }
    }
  

    static atualizarAutor = async (req, res) => {
      try {
        const id = req.params.id;
  
        //notação do mongoDB que significa que iremos usar o que vier no body para substituir o resultados
        //Sem o $set o mongoose entende que vamos substituir todos campos, sobrescrevando possivelmente campos
        //que não estão sendo usadoss
        await autores.findByIdAndUpdate(id, {$set: req.body});
  
        res.status(200).send({message: "Autor atualizado com sucesso"});
      } catch (erro) {
        res.status(500).send({message: erro.message});
      }
    }
  
    static excluirAutor = async (req, res) => {
      try {
        const id = req.params.id;
  
        await autores.findByIdAndDelete(id);
  
        res.status(200).send({message: "Autor removido com sucesso"});
      } catch (erro) {
        res.status(500).send({message: erro.message});
      }
    }
  

}

export default AutorController