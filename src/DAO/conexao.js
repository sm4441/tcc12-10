const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config(); // ✅ garante que as variáveis do .env estão carregadas

async function conexao() {
  try {
    const pool = mysql.createPool({
      host: process.env.HOST_DATABASE,
      port: process.env.PORTA_BD,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATA_BASE,const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config(); // ✅ garante que as variáveis do .env estão carregadas

async function conexao() {
  try {
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
    console.log("✅ Pool de conexões MySQL criado com sucesso!");
    return pool;
  } catch (erro) {
    console.error("❌ Erro ao criar pool de conexões:", erro);
  }
}

async function closeConexao(pool) {
  if (pool) {
    console.log("🧩 Fechando o pool de conexões com o banco de dados...");
    await pool.end();
  } else {
    console.log("ℹ️ Nenhum pool de conexão ativo.");
  }
}

async function testarConexao() {
  try {
    const pool = await conexao();
    const conn = await pool.getConnection();
    await conn.ping();
    console.log("✅ Conexão com o MySQL bem-sucedida!");
    conn.release();
  } catch (erro) {
    console.error("❌ Falha ao conectar com o MySQL:", erro);
  }
}

module.exports = { conexao, closeConexao, testarConexao };

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log("✅ Pool de conexões MySQL criado com sucesso!");
    return pool;
  } catch (erro) {
    console.error("❌ Erro ao criar pool de conexões:", erro);
  }
}

async function closeConexao(pool) {
  if (pool) {
    console.log("🧩 Fechando o pool de conexões com o banco de dados...");
    await pool.end();
  } else {
    console.log("ℹ️ Nenhum pool de conexão ativo.");
  }
}

async function testarConexao() {
  try {
    const pool = await conexao();
    const conn = await pool.getConnection();
    await conn.ping();
    console.log("✅ Conexão com o MySQL bem-sucedida!");
    conn.release();
  } catch (erro) {
    console.error("❌ Falha ao conectar com o MySQL:", erro);
  }
}

module.exports = { conexao, closeConexao, testarConexao };
