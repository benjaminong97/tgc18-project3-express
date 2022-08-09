// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'foo',
      password:'bar',
      database:'mice'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;