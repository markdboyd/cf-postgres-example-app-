"use strict";
const express = require("express");

console.log("**************************");
console.log("* Test PostgreSQL backend *");
console.log("**************************");

const pg = require("pg");
const cfenv = require('cfenv');

const app = express();

const appEnv = cfenv.getAppEnv();
const dbService = appEnv.services['postgres'][0];
let dbStaged = false;

if (!dbService) {
  console.error('Could not find database service named "postgres"');
  process.exit(1);
}

const client = new pg.Client(dbService.credentials.dsn);
client.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("Connection successful");
  }
});

async function stageDatabase() {
  await client.query("DROP TABLE IF EXISTS words");
  console.log("DROP TABLE OK");
  
  await client.query(
    "CREATE TABLE IF NOT EXISTS words (word varchar(256) NOT NULL, definition varchar(256) NOT NULL)"
  );
  console.log("CREATE TABLE OK");
  
  let queryText = "INSERT INTO words(word, definition) VALUES($1, $2)";
  await client.query(
    queryText, ["TestPostgres", "definition"]
  );
  console.log("INSERT OK"); 
}

async function getWords (_, res) {
  if (!dbStaged) {
    await stageDatabase();
    dbStaged = true;
  }
  const result = await client.query('SELECT * FROM words ORDER BY word ASC');

  return res.send(result.rows)
}

app.get('/', getWords);
app.listen(process.env.PORT || 5000);

module.exports = app;

