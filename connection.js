var mysql = require('mysql');
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	port: 8082,
	database: "hamazon_db"
});
connection.connect(function(err) {
	if (err) {
		console.error("error connecting: " + err.stack);
		return;
	}
	// console.log("Connected to hamazon_db on thread " + connection.threadId + ".");
});

module.exports = connection;