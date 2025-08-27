/**
 * TODO: Configure Knex here.
 * You may use SQLite (default) or point to MySQL.
 * Example for SQLite:
 * const knex = require('knex')({ client: 'sqlite3', connection: { filename: 'data/lms.sqlite3' }, useNullAsDefault: true });
 * module.exports = knex;
 */

 const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './data/lms.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: '../migrations'
    },
    seeds: {
      directory: '../seeds'
    }
  });
  
  // Create data directory if it doesn't exist
  const fs = require('fs');
  const path = require('path');
  
  const dataDir = path.join(__dirname, '../../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

module.exports = knex; // placeholder
