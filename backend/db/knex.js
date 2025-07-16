const knex = require('knex')({
    client: 'sqlite3',
    connection:{
        filename: './db/blog.sqlite'
    },
    useNullAsDefault: true,
})

module.exports = knex;
