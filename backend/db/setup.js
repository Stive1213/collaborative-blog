const { default: knex } = require("knex");
const db = require("./knex");

db.schema.hasTable("users").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name");
        table.string("email").unique();
        table.string("password");
        table.boolean("is_verified").defaultTo(false);
        table.string("google_id");
        table.string("verification_token");
        table.string("role").defaultTo("user");
        table.string("reset_token").nullable();
        table.datetime("reset_token_expiry").nullable();
      })
      .then(() => {
        console.log("Users table created");
      });
  }
});

db.schema.hasTable("posts").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("posts", (table) => {
        table.increments("id").primary();
        table
          .integer("user_id")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table.string("title");
        table.text("content");
        table.string("image_path").nullable();
        table.boolean("pin").defaultTo(false);
        table.timestamp("created_at").defaultTo(db.fn.now());
      })
      .then(() => {
        console.log("posts table created");
      });
  }
});
