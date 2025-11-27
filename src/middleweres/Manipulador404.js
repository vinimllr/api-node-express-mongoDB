import NaoEncontrado from "../erros/Pagina404.js";

export function manipulador404(req, res, next){
    const erro404 = new NaoEncontrado();
    next(erro404)
}

export default manipulador404;