const oracledb = require('oracledb');

async function run() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      host: 'BD-ACD',
      user: 'BD130824196',
      password: 'Kvven5',
      database: 'BD130824196'
    });

    console.log('Conectado ao Oracle Database');

    const sql = `INSERT INTO teste (nome, email, numero) VALUES ('joao', 'joao@gmail', 19999035345)`;


    const result = await connection.execute(sql, binds, { autoCommit: true });

    console.log('Linhas inseridas:', result.rowsAffected);

  } catch (err) {
    console.error('Erro:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar a conexão:', err);
      }
    }
  }
}

run();
