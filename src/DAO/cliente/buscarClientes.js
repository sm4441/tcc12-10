
//funcionando
const {conexao} = require('../conexao')


async function buscarClientes(){
   const sql = `
    SELECT 
      c.cpf,
      c.nome_completo,
      c.telefone,
      c.email,
      e.logradouro,
      e.numero,
      e.bairro,
      e.cidade,
      e.cep
    FROM tbl_candidato AS c
    INNER JOIN tbl_endereco_do_candidato AS e
      ON c.id_endereco = e.id;
  `;
    
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