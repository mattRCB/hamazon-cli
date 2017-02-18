var connection = require('./connection.js');

var inquirer = require('inquirer');
var Table = require('cli-table');

selectAction();

function selectAction() {
	inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "Choose an option to continue:",
			choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
		}
	]).then(function(user_input) {
		// console.log(user_input);
		// process.stdout.write('\033c'); //clear terminal window
		switch(user_input.action) {
			case "Exit":
				process.stdout.write('\033c');
				process.exit();
			case "View Products":
				connection.query("SELECT * FROM Products", function(err, data) {
					if (err) throw err;
					var table = new Table({
						head: ['ID', 'PRODUCT', 'PRICE', 'ON HAND'],
						colWidths: [10, 30, 10, 10]
					});
					for (i=0; i<data.length; i++) {
						var row = [];
						row.push(data[i].P_Id, data[i].product, data[i].price, data[i].qty_instock);
						table.push(row);
					}
					console.log(table.toString());
					selectAction();
				});
				break;
			case "View Low Inventory":
				connection.query("SELECT * FROM Products WHERE qty_instock < 5", function(err, data) {
					if (err) throw err;
					var table = new Table({
						head: ['ID', 'PRODUCT', 'PRICE', 'ON HAND'],
						colWidths: [10, 30, 10, 10]
					});
					for (i=0; i<data.length; i++) {
						var row = [];
						row.push(data[i].P_Id, data[i].product, data[i].price, data[i].qty_instock);
						table.push(row);
					}
					console.log(table.toString());
					selectAction();
				});
				break;
			case "Add to Inventory":
				inquirer.prompt([
					{
						type: "input",
						name: "P_Id",
						message: "Enter the ID of the product to add inventory: "
					}	
				]).then(function(id) {
					// var P_Id = id;
					inquirer.prompt([
						{
							type: "input",
							name: "qty",
							message: "Enter the quantity of units to add to inventory: "
						}
					]).then(function(qty) {
						// console.log(P_Id);
						// console.log(qty);
						addInventory(id.P_Id, qty.qty);
					})
				});

				function addInventory(id, qty) {
					// console.log(id);
					// console.log(qty);
					connection.query("UPDATE Products SET qty_instock = qty_instock + ? WHERE P_Id = ?", [qty, id], function(err, data) {
						if (err) throw err;
					});
					console.log("\nAdded " + qty + " units to Product ID: " + id + "\n");
					selectAction();
				};
				break;
			case "Add New Product":
				connection.query("SELECT * FROM Departments", function(err, depts_table) {
					if (err) throw err;
					var departments_list = [];
					for (var i=0; i<depts_table.length; i++) {
						departments_list.push(depts_table[i].department);
					}
					// console.log(departments_list);
					inquirer.prompt([
						{
							type: "input",
							name: "product",
							message: "Enter the product name:"
						},
						{
							type: "input",
							name: "price",
							message: "Enter the unit price:"
						},
						{
							type: "input",
							name: "in_stock",
							message: "Enter the quantity of stock on hand:"	
						},
						{
							type: "list",
							name: "department",
							message: "Choose the department in which the product belongs:",
							choices: departments_list					
						}				
					]).then(function(answers) {
						// console.log(answers);
						// console.log(depts_table);
						connection.query("SELECT P_Id FROM Departments WHERE department = ?", [answers.department], function(err, dept_id) {
							if (err) throw err;
							// console.log(dept_id[0].P_Id);
							connection.query("INSERT INTO Products (product, department_id, price, qty_instock) VALUES (?, ?, ?, ?)", [answers.product, dept_id[0].P_Id, answers.price, answers.in_stock], function(err, data) {
								if (err) throw err;
								process.stdout.write('\033c'); //clear terminal window
								console.log("Added new product.\n");
								selectAction();
							}); // close INSERT						
						}); // close SELECT
					});	// close .then(function(answers)
				}); // close SELECT * FROM Departments
		
				break;
			default:

		} // close switch

	}); // close first prompt block
}; // close function selectAction