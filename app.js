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

    const sql = `INSERT INTO sua_tabela (coluna1, coluna2) VALUES (:valor1, :valor2)`;

    const binds = {
      valor1: 'valor_exemplo1',
      valor2: 'valor_exemplo2'
    };

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
