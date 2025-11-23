const { pool } = require('../conexao');

async function buscarEmpresa() {
    try {
        const sql = `SELECT * FROM tbl_empresa;`;
        const [rows] = await pool.query(sql); // pool gerencia conexão automaticamente
        return rows;
    } catch (err) {
        console.error("Erro ao buscar empresas:", err);
        return { erro: err.message };
    }
}

module.exports = { buscarEmpresa };
