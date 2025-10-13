const mysql = require("mysql2/promise");
const { config } = require("dotenv");

config();

/**
 * Cria e retorna um pool de conexões com o MySQL.
 * @returns {Promise<import('mysql2/promise').Pool>} O pool de conexões.
 */
async function conexao() {
    const pool = mysql.createPool({
        host: process.env.HOST_DATABASE,
        port: process.env.PORTA_BD,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATA_BASE,
        waitForConnections: true, // Adicionado: comportamento padrão
        connectionLimit: 10,      // Adicionado: Limite de conexões no pool
        queueLimit: 0             // Adicionado: Fila ilimitada
    });

    return pool;
}

/**
 * Fecha o pool de conexões do banco de dados.
 * @param {import('mysql2/promise').Pool} pool O pool de conexões a ser fechado.
 */
async function closeConexao(pool) {
    if (pool) {
        console.log("Fechando a conexão com o banco de dados.");
        await pool.end();
        console.log("Conexão com o banco de dados fechada.");
    } else {
        console.log("Pool de conexões não fornecido ou já fechado.");
    }
}

/**
 * Testa a conexão com o MySQL: cria, verifica, e fecha o pool.
 */
async function testarConexao() {
    let pool;
    let conn;
    try {
        // 1. Cria o pool
        pool = await conexao();
        // 2. Pega uma conexão e a testa
        conn = await pool.getConnection();
        await conn.ping();
        console.log("✅ Conexão com o MySQL bem-sucedida!");
        // 3. Devolve a conexão ao pool
        conn.release(); 
    } catch (erro) {
        console.error("❌ Falha ao conectar com o MySQL:", erro.message);
    } finally {
        // 4. Garante que o pool seja fechado, liberando recursos
        if (conn) {
            // Se houver erro ANTES de pegar a conexão, 'conn' será undefined, então a liberação só ocorre se tiver sido pego.
            // Embora 'conn.release()' esteja no 'try', é um bom hábito ter um 'finally' para a libação, mas neste caso,
            // como o objetivo final é fechar o pool (pool.end()), 'conn.release()' antes do 'pool.end()' é suficiente.
        }
        
        // **CORREÇÃO CRÍTICA**: Fecha o pool após o teste.
        if (pool) {
            await pool.end();
        }
    }
}

module.exports = { conexao, closeConexao, testarConexao };