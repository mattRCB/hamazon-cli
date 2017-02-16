var express = require('express');
var mysql = require('mysql');
var inquirer = require('inquirer');

var app = express();
app.set('port', process.env.PORT || 8082);

app.listen(PORT, function(){
	console.log("hamazon-cli is serving...");
});


var connection = mysql.connection({
	host: "localhost",
	user: "root",
	password: "root",
	port: 8082,
	database: "hamazon_db"
});
connection.connect(function(err) {
	if (err) {
		console.error("error connecting: " + err.stack):
		return;
	}
	console.log("Connected to hamazon_db on thread " + connection.threadId + ".");
});

