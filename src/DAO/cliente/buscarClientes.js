
//funcionando
const {conexao} = require('../conexao.js')


async function buscarClientes(){
    const sql = `SELECT * FROM tbl_candidato;`
    
    const conn = await conexao()
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(sql);
        await conn.end()
        return rows
      } catch (err) {
        return err.message
      }
}

module.exports = {buscarClientes}