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
            // add to setup.js or migration script
table.string('reset_token').nullable();
table.datetime('reset_token_expiry').nullable();

        }).then(() => {
            console.log('Users table created');
        })
    }
})