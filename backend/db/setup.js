const db = require('./knex');


db.schema.hasTable('users').then(exists => {
    if (!exists) {
        return db.schema.createTable('users', table => {
            table.increments('id').primary();
            table.string('name');
            table.string('email').unique();
            table.string('password');
            table.boolean('is_verified').defaultTo(false);
            table.string('google_id');
            table.string('verification_token');
            table.string('role').defaultTo('user');
        }).then(() => {
            console.log('Users table created');
        })
    }
})