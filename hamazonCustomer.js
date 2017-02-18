var connection = require('./connection.js');

var inquirer = require('inquirer');
var Table = require('cli-table');

process.stdout.write('\033c'); //clear terminal window
displayProdTable();
function displayProdTable() {
	connection.query("SELECT P_Id, product, price FROM Products", function(err, data) {
		if (err) throw err;

		var table = new Table({
			head: ['ID', 'PRODUCT', 'PRICE'],
			colWidths: [10, 30, 15]
		});

		for (i=0; i<data.length; i++) {
			var row = [];
			// console.log(data.P_Id);
			row.push(data[i].P_Id, data[i].product, data[i].price);
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

		var qty_instock = data[0].qty_instock;
		// console.log(qty.qty);
		// console.log(data[0].qty_instock <= qty.qty);
		if (data[0].qty_instock <= qty.qty) {
			process.stdout.write('\033c'); //clear terminal window
			console.log('\nInsufficient stock on hand to complete your order.\nPlease try again.\n');
			displayProdTable();
		} else {
			placeOrder(id, qty, qty_instock);
		};
	});
};

function placeOrder(id, qty, qty_instock) {
	// console.log("id: " + id.P_Id);
	// console.log("qty: " + qty.qty);
	// console.log("instock: " + qty_instock)
	connection.query("UPDATE Products SET qty_instock = ? WHERE P_Id = ?", [(qty_instock - qty.qty), id.P_Id], function(err, data) {
		if (err) throw err;
	});

	connection.query("INSERT INTO sales (product_id, qty_purchased) VALUES (?, ?)", [id.P_Id, qty.qty], function(err, data) {
		if (err) throw err;
	});

	connection.query("SELECT * FROM Products WHERE P_Id = ?", [id.P_Id], function(err, data) {
		if (err) throw err;

		// console.log(data);
		process.stdout.write('\033c'); //clear terminal window		
		console.log("The total comes to $" + (parseFloat(qty.qty)*parseFloat(data[0].price)).toFixed(2) + " for your purchase of " + qty.qty + " " + data[0].product + " at $" + data[0].price + " per unit. \n");

		inquirer.prompt([
			{
				type: "list",
				name: "action",
				message: "To continue, please select an option below:",
				choices: ["Place another order", "Exit"]
			}
		]).then(function(user_input) {
			// console.log(user_input);
			process.stdout.write('\033c'); //clear terminal window\
			if (user_input.action == "Exit") {
				process.exit();
			} else {
				displayProdTable();
			};
		});
	});
	
};