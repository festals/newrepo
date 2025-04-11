const pool = require("../database/")

async function addComment(
    comment_name,
    comment_description, 
    account_id){
    try {
      const sql = "INSERT INTO comment (comment_name, comment_description, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [
        comment_name,
        comment_description,  
        account_id])
        } catch (error) {
      return error.message
    }
}

module.exports = {addComment };


  