function createDataBase() {
  process.env.ORA_SDTZ = 'UTC-3'; // garante horário de Brasília

  this.getConexao = async function () {
    if (global.conexao)
      return global.conexao;

    const mysql = require('mysqldb');
    const connection = require('./connection');

    try {
      global.conexao = await mysql.getConnection(connection);
    }
    catch (err) {
      console.log(`Error: ${err}`);
      process.exit(1);
    }
    return global.conexao;
  }

  this.tabelaAlunos = async function () {
    try {
      const conexao = await this.getConexao();
      const sql = ` CREATE TABLE ALUNOS (
                      ID INT AUTO_INCREMENT PRIMARY KEY,
                      CPF_ALUNO CPF (11) UNIQUE,
                      NOME_ALUNO VARCHAR(40),
                      EMAIL_ALUNO VARCHAR(60),
                      TELEFONE_ALUNO NUMBER(12),
                      ENDERECO_ALUNO VARCHAR(50),
                      DATA_NASC_ALUNO DATE,
                      SEXO_ALUNO VARCHAR(9), CONSTRAINT SEXO_ALUNO_CHECK CHECK(
                      SEXO_ALUNO IN ('M','F','OUTROS','PREFIRO NÃO INFORMAR')),
                      DEFICIENCIA_ALUNO VARCHAR(30),
                      DATA_MATRICULA DATE);`;

      await conexao.execute(sql);
    }
    catch (err) { }
  }

  this.tabelaProfessores = async function () {
    try {
      const conexao = await this.getConexao();
      const sql = ` CREATE TABLE PROFESSOR (
                      ID INT AUTO_INCREMENT PRIMARY KEY,
                      CREF VARCHAR(9) CONSTRAINT UNIQUE,
                      CPF_PROFESSOR NUMBER (11) UNIQUE,
                      NOME_PROFESSOR VARCHAR(40),
                      EMAIL_PROFESSOR VARCHAR(60),
                      TELEFONE_PROFESSOR NUMBER(12),
                      ENDERECO_PROFESSOR VARCHAR(50),
                      DATA_NASC_PROFESSOR DATE,
                      SEXO_PROFESSOR VARCHAR(9), CONSTRAINT SEXO_PROFESSOR_CHECK CHECK(
                      SEXO_PROFESSOR IN ('M','F','OUTROS','PREFIRO NÃO INFORMAR')),
                      DEFICIENCIA_PROFESSOR VARCHAR(30),
                      DATA_ADMI_PROFESSOR DATE,
                      FORMACAO_PROFESSOR VARCHAR(20),
                      TURNO_PROFESSOR VARCHAR(20),
                      TIPO_CONTRATO_PROFESSOR VARCHAR (20)
                    );`;

      await conexao.execute(sql);
    }
    catch (err) { }
  }
}