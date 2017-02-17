// var express = require('express');
var mysql = require('mysql');
var inquirer = require('inquirer');

var Table = require('cli-table');

// var app = express();
// var PORT = process.env.PORT || 6600;

// app.listen(PORT, function(){
// 	console.log("hamazonCustomer.js is serving...");
// });


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
	console.log("Connected to hamazon_db on thread " + connection.threadId + ".");
});

displayProdTable();
function displayProdTable() {
	connection.query("SELECT P_Id AS 'ID', product AS 'PRODUCT', price AS 'PRICE' FROM Products", function(err, data) {
		if (err) throw err;

		var table = new Table({
			head: ['ID', 'PRODUCT', 'PRICE'],
			colWidths: [10, 30, 15]
		});

		for (i=0; i<data.length; i++) {
			var row = [];
			// console.log(data.P_Id);
			row.push(data[i].ID, data[i].PRODUCT, data[i].PRICE);
			table.push(row);		
		}
		console.log(table.toString());
		askId();
	});
};

function askId() {
	inquirer.prompt([
		{
			type: "input",
			name: "P_Id",
			message: "Enter the ID of the product to purchase: "
		}	
	]).then(function(id) {
		// var P_Id = id;
		inquirer.prompt([
			{
				type: "input",
				name: "qty",
				message: "Enter the quantity of units to purchase: "
			}
		]).then(function(qty) {
			// console.log(P_Id);
			// console.log(qty);
			checkInventory(id, qty);
		})
	});
};


function checkInventory(id, qty) {
	// console.log(id);
	// console.log(qty);
	connection.query("SELECT qty_instock FROM Products WHERE P_Id = ?", [id.P_Id], function(err, data) {
		if (err) throw err;

		// console.log(data[0].qty_instock);
		// console.log(qty.qty);
		// console.log(data[0].qty_instock <= qty.qty);
		if (data[0].qty_instock <= qty.qty) {
			process.stdout.write('\033c');
			console.log('\nInsufficient stock on hand to complete your order.\nPlease try again.\n');
			displayProdTable();
		} else {
			placeOrder(id, qty);
		};
	});
};

function placeOrder(id, qty) {
	
}


// connection.end();



















