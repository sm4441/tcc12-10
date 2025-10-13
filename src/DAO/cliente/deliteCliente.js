// ok
const {conexao} = require('../conexao.js')

async function deletarUsuario(cpf){
    
    const sql = `DELETE FROM tbl_candidato WHERE cpf = ?`
    const conn = await conexao()
    
    try {
        // Executar a consulta
        const [results] = await conn.query(sql,[cpf]);

        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

module.exports = {deletarUsuario}