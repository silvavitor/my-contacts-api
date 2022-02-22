const { Client } = require('pg');

const client = new Client({
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'mycontacts',
});

client.connect();

exports.query = async (query) => {
  const { rows } = await client.query(query)
  return rows;
}
