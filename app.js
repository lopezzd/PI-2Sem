import { createDataBase } from './src/utils/createDataBase';

function Alunos(bd) {
  this.bd = bd;

  this.inclua = async function (Aluno) {
    const conexao = await this.bd.getConexao();

    const sql = ` INSERT INTO PROFESSOR (
                    CPF_ALUNO,
                    NOME_ALUNO,
                    EMAIL_ALUNO,
                    TELEFONE_ALUNO,
                    ENDERECO_ALUNO,
                    DATA_NASC_ALUNO,
                    SEXO_ALUNO,
                    DEFICIENCIA_ALUNO,
                    DATA_MATRICULA
                  ) VALUES (
                    :0,      
                    :1,      
                    :2,     
                    :3, 
                    :4,      
                    :5
                    :6,              
                    NULL,             
                    sysdate,
                  );`;

    const dados = [ Aluno.cpf, Aluno.nome, Aluno.email, Aluno.telefone, Aluno.endereco, Aluno.datanasc, Aluno.sexo];
    console.log(sql, dados);
    await conexao.execute(sql, dados);

    const commit = 'COMMIT';
    await conexao.execute(commit);
  }

  this.recupereTodos = async function () {
    const conexao = await this.bd.getConexao();

    const sql = `SELECT Codigo,Placa,TO_CHAR(DataEntrada,'YYYY-MM-DD HH24:MI:SS') FROM Alunos`;
    ret = await conexao.execute(sql);

    return ret.rows;
  }

  this.recupereUm = async function (codigo) {
    const conexao = await this.bd.getConexao();

    const sql = "SELECT Codigo,Placa,TO_CHAR(DataEntrada, 'YYYY-MM-DD HH24:MI:SS') " +
      "FROM Alunos WHERE Codigo=:0";
    const dados = [codigo];
    ret = await conexao.execute(sql, dados);

    return ret.rows;
  }
}

function Aluno(codigo, placa, dataentrada) {
  this.codigo = codigo;
  this.placa = placa;
  this.dataentrada = dataentrada;
}

function Comunicado(codigo, mensagem, descricao) {
  this.codigo = codigo;
  this.mensagem = mensagem;
  this.descricao = descricao;
}

function middleWareGlobal(req, res, next) {
  console.time('Requisição'); // marca o início da requisição
  console.log('Método: ' + req.method + '; URL: ' + req.url); // retorna qual o método e url foi chamada

  next(); // função que chama as próximas ações

  console.log('Finalizou'); // será chamado após a requisição ser concluída

  console.timeEnd('Requisição'); // marca o fim da requisição
}

// para a rota de CREATE
async function inclusao(req, res) {
  if (!req.body.codigo || !req.body.placa) {
    const erro1 = new Comunicado('DdI', 'Dados incompletos',
      'Não foram informados todos os dados do veículo');
    return res.status(422).json(erro1);
  }

  const Aluno = new Aluno(req.body.codigo, req.body.placa, req.body.dataentrada);

  try {
    await global.Alunos.inclua(Aluno);
    const sucesso = new Comunicado('IBS', 'Inclusão bem sucedida',
      'O veículo foi incluído com sucesso');
    return res.status(201).json(sucesso);
  }
  catch (erro) {
    console.log('TESTE AQUI');
    const erro2 = new Comunicado('LJE', 'Veículo existente',
      'Já há veículo cadastrado com o código informado');
    return res.status(409).json(erro2);
  }
}

// para a primeira rota de READ (todos)
async function recuperacaoDeTodos(req, res) {
  if (req.body.codigo || req.body.placa || req.body.data) {
    const erro = new Comunicado('JSP', 'JSON sem propósito',
      'Foram disponibilizados dados em um JSON sem necessidade');
    return res.status(422).json(erro);
  }

  let rec;
  try {
    rec = await global.Alunos.recupereTodos();
  }
  catch (erro) { }

  if (rec.length == 0) {
    return res.status(200).json([]);
  }
  else {
    const ret = [];
    for (i = 0; i < rec.length; i++) ret.push(new Aluno(rec[i][0], rec[i][1], rec[i][2]));
    return res.status(200).json(ret);
  }
}

// para a segunda rota de READ (um)
async function recuperacaoDeUm(req, res) {
  if (req.body.codigo || req.body.placa || req.body.dataentrada) {
    const erro1 = new Comunicado('JSP', 'JSON sem propósito',
      'Foram disponibilizados dados em um JSON sem necessidade');
    return res.status(422).json(erro1);
  }

  const codigo = req.params.codigo;

  let ret;
  try {
    ret = await global.Alunos.recupereUm(codigo);
  }
  catch (erro) { }

  if (ret.length == 0) {
    const erro2 = new Comunicado('LNE', 'Veículo inexistente',
      'Não há veículo cadastrado com o código informado');
    return res.status(404).json(erro2);
  }
  else {
    ret = ret[0];
    ret = new Aluno(ret[0], ret[1], ret[2]);
    return res.status(200).json(ret);
  }
}

async function ativacaoDoServidor() {
  const bd = new createDataBase();
  await bd.estrutureSe();
  global.Alunos = new Alunos(bd);

  const express = require('express');
  const app = express();
  const cors = require('cors')

  app.use(express.json());   // faz com que o express consiga processar JSON
  app.use(cors()) //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
  app.use(middleWareGlobal); // app.use cria o middleware global

  app.post('/Alunos', inclusao);
  app.get('/Alunos', recuperacaoDeTodos);
  app.get('/Alunos/:codigo', recuperacaoDeUm);

  console.log('Servidor ativo na porta 3000...');
  app.listen(3000);
}

ativacaoDoServidor();

