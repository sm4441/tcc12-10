const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// 🔥 CRIA UM ÚNICO POOL GLOBAL
const pool = mysql.createPool({
  host: process.env.HOST_DATABASE,
  port: process.env.PORTA_BD,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATA_BASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("✅ Pool de conexões MySQL inicializado!");

async function testarConexao() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    console.log("✅ Conexão com o MySQL funcionando!");
    conn.release();
  } catch (erro) {
    console.error("❌ Erro ao testar conexão:", erro);
  }
}


module.exports = { pool, testarConexao };
