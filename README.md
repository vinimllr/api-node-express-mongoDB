# Node JS lidando com filtros, listas e API
## Introdução
Este README tem por objetivo evidenciar todos conceitos aprendidos durante o projeto
## Iniciando o projeto
Abra com o editor de código de sua escolha e inicie com **`npm i`**
Inicie as variáveis de ambiente de acordo com o próximo tópico e rode **`npm run dev`**
## Iniciando variáveis de ambiente com .env
- Instalamos a biblioteca
**`npm i dotenv`**
- Cria-se o arquivo **.env** inserindo a variável de ambiente 
**`DB_CONNECTION_STRING=VARIÁVELEXEMPLO`**


## ES LINT
o **Linter** é usado para tratamento de erros e para "pegar" erros mais cedo
**`npm init @estlint/config`**
> Checar sintaxe, encontrar problemas e reforçar estilos de código

Para o ESLINT alterar automaticamente o que definimos
**`npx eslint . --fix`**
E em **`CTRL + P -> Preferences: Open user settings (JSON)`**
E adicionamos 
``
"editor.codeActionOnSave": {
    "source.fixAll.eslint": true
}
``

## Tratando erros na busca por id

Atualmente nossa API está retornando apenas código 400 (recurso não localizado). Precisamos tratar isso, por exemplo se for por conta do servidor estar fora do ar.
**O back-end precisa retornar os erros de forma coerente para o Front-End**

- Verificamos se o autor é nulo, pois se não encontrar retornará nulo, e caso seja nulo precisamos informar
```js  
 static listarAutorPorId  = async (req, res) => {
    try {
      const id =  req.params.id;

            const autoresResultado = await autores.findById(id);
			//Caso não achamos mandamos 404 referente a notfound
            if (autorResultado !== null) {
                res.status(200).send(autoresResultado);
            } else {
                res.status(404).send({ message: "Id do Autor não localizado." });
            }

    } catch (erro) {
      if (erro instanceof mongoose.Error.CastError) {
        res.status(400).send({message: "Um ou mais dados fornecidos estão incorretos."});
      } else {
        res.status(500).send({message: "Erro interno de servidor."});
      }
    }
  };

```

> Por que o tratamento extra no Catch?
> Percebemos que o hexadecimal usado como objectId no mongoose aceita apenas numeros de 0 a 9 e letras de A a F, ou seja se algo estiver fora disso iria retornar um erro de servidor, não é o que queremos.
> Neste caso adicionamos um tratamento se esse erro for uma instância do Mongoose para informar que dados foram inseridos incorretamente.

## Middleweres do Express para tratamento de erros
Nosso código está ficando bem repetitivo, por isso criaremos um recurso para tratamento de erros com ajuda do Express
Adicionamos no app.js
```js  
app.use( (erro, req, res, next) => {
if (erro  instanceof  mongoose.Error.CastError) {
res.status(400).send({message: "Um ou mais dados fornecidos estão incorretos."})
} else {
res.status(500).send({message: "Erro interno de servidor."})
}
});
```
Em seguida no **catch** do controller
```js  
next(erro);
```
Essa função vai basicamente interceptar qualquer erro que for lançado em nossa aplicação.
Middleweres são caraterizados por **receber 4 parâmetros** mesmo que não utilizemos eles. É importante que utilizemos os 4 parâmetros pois assim o express vai identificar que esse middlewere é para tratamento de erros.
> O que o parâmetro **next** faz exatamente é encaminhar esse erro para nosso middlewere, então ele precisa ser recebido também nos métodos de nossos controladores.
### O que é um  Middlewere
É um termo técnico para estas funções especiais que mais especificamente passaremos para esse app.use, onde middleweres são funções para interceptar requisições para algum fim. No nosso caso é para interceptar erros e tratar da forma correta.

## Personalizando mensagens de erro
- O Mongoose permite inserir na propriedade required (ou em outras propriedades de validação) um **array com o valor booleano de validação e uma mensagem personalizada**
```js  
const  autorSchema  =  new  mongoose.Schema(
{
	id: {type: String},
	nome: {
	type: String,
	required: [true, "O nome do(a) autor(a) é obrigatório."]
},
	nacionalidade: {type: String}
},
{
	versionKey: false
})
```
E em nossa validação adicionamos
```js
if (erro  instanceof  mongoose.Error.CastError) {
	res.status(400).send({message: "Um ou mais dados fornecidos estão incorretos."})
}

else  if(erro  instanceof  mongoose.Error.ValidationError){
	const  mensagensErro  =  Object.values(erro.errors)
	.map(erro  =>  erro.message)
	.join("; ")

	res.status(400).send({message: `Os seguintes erros foram encontrados: ${mensagensErro}`})
}
```
> **`Object.Values`** é um jeito do JS de iterar sobre os valores de um objeto


## Criando classe para manipular erros
- Vamos criar uma classe que herda de erros onde vamos ter como padrão uma mensagem de erro e um status de erro
```js
 class ErroBase extends Error{
 constructor(mensagem = "Erro interno do servidor", status = 500){
 super(); //Queremos manter as propriedades originais dos erros;
 this.mensagem = mensagem;
 this.erro = erro;
}
 
 }
  ```
  - Adicionamos um método de enviar resposa
 ```js
 enviarResposta(res){
 res.status(this.status).send({mensagem: this.mensagem, status: this.status})
}
 ```
 ### Utilizando o erro base
 ```js
 new ErroBase().enviarResposta(res);
 ```
 ### Evoluindo erro base com base na orientação a objetos para outros tipos de erro
 ```js
 class RequisicaoIncorreta extends ErroBase{
	 constructor(mensagem = "Um ou mais dados estão incorretos"){
		 super(mensagem, 400);
	 }
}
 ```
 
  ### Utilizando o RequisicaoIncorreta
 ```js
 new RequisicaoIncorreta().enviarResposta(res);
 ```
 ### Padronizando erros de validação
 - Neste caso a única mudança é que precisaremos do erro como parâmetro.
  ```js
class  ErroValidacao  extends  RequisicaoIncorreta{
constructor(erro){
	const  mensagensErro  =  Object.values(erro.errors)
		.map(erro  =>  erro.message)
		.join("; ")
		
	super(`Os seguintes erros foram encontrados: ${mensagensErro}`)
}
}
 ```
## STATUS 404
```js
routes(app);
//Precisa ser obrigatóriamente após o routes ser registrado
//Pois será executado apenas caso não ache rota correspondente
app.use(manipulador404);
```
> **Por que mesmo com os tratamento não cai em um erro tratado?**
>O Route do **`Express`** itera sobre todas rotas tentando ver o que está de acordo com os parâmetros enviados, não encontrando ele acaba jogando por padrão uma página HTML, mas não jogando exatamente um erro esperado, por isso precisamos de um tratamento especial.

## Validadores personalizados
```js
validate: (valor) => {
	validator: {
		return valor >= 10 && valor <= 5000
	},
   message: "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"
}

```

Lembrando que são validadores personalizados, também é possível usar os nativos como:
```javascript
    required: [true, 'User phone number required']
```

## Validação global
Não faz sentido que eu receba string vazia em qualquer campo hoje, então definiremos uma validação global.
Dentro de models criaremos o **index.js** e adicionaremos 
```js
export {livros, autores};
```
A partir daqui todas importações devem vir do index.js

criamos um arquivo **validadorGlobal.js**

```js
import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", {
  validator: (valor) => valor !== "",
  message: "Um campo em branco foi fornecido."
});
```
Perceba que a sintaxe é igual a dos validadores anteriores.

## Lidando com filtros
```csharp
static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const { editora, titulo } = req.query;
			//Aqui desestruramos a requisição
            const busca = {};

            if (editora) busca.editora = editora;

		    if (titulo) busca.titulo = { $regex: titulo, $options: "i" 					};
		    //Aqui usamos regex, basicamente para pegar um livro que
		    //Contenha aquela palavra sem distinção de maiúsculas e minúsculas
            const livrosResultado = await livros.find(busca);

// Código omitido
```
Basicamente se tivermos algum dos dois diferente de vazio ou nulo adicionamos na nossa busca.
