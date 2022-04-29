"use strict";
const express = require("express");
const app = express();

console.log("**************************");
console.log("* Test postgresl backend *");
console.log("**************************");

const pg = require("pg");
const cfenv = require('cfenv');

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

// function main(type, error, res) {
//   if ( type == "starting") {
//     if (error) {
//       console.log("Error during startup !");
//       process.exit(1);
//     }
//   } else {
//     if (error) {
//       console.error("Error during http get !");
//       res.status(404).send('Start unsuccessful service not available');
//     } else {
//       console.log("Ok, service available");
//       res.send('This is a test app for postgres-docker');
//     }
//   }
// }

async function getWords (_, res) {
  if (!dbStaged) {
    await stageDatabase();
    dbStaged = true;
  }
  const result = await client.query('SELECT * FROM words ORDER BY word ASC');

  // console.log("SELECT OK : " + result.rows[0].word);
  // if (result.rows[0].word != "TestPostgres") {
  //   console.error("Word TestPostgres not found => Exit");
  //   return main(type, true, res);
  // }

  // main(type, false, res);
  return res.send(result.rows)
}

app.get('/', getWords);
app.listen(process.env.PORT || 5000);

module.exports = app;

