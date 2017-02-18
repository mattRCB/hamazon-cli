var connection = require('./connection.js');

var inquirer = require('inquirer');
var Table = require('cli-table');

process.stdout.write('\033c');
selectAction();
function selectAction() {	
	inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "Select an option below to continue:",
			choices: ["View Product Sales by Department", "Create New Department", "Exit"]
		}
	]).then(function(user_input) {
		// console.log(user_input);
		process.stdout.write('\033c'); //clear terminal window
		switch (user_input.action) {
			case "Exit":
				process.exit();
			case "View Product Sales by Department":
				process.stdout.write('\033c'); //clear terminal window\
				connection.query("SELECT department_id, Departments.department, Departments.overhead_cost, product_id, Products.price, SUM(qty_purchased * price) AS total FROM Products JOIN Sales ON Products.P_Id = Sales.product_id JOIN Departments ON Departments.P_Id = Products.department_id GROUP BY department_id", function(err, data) {
					// console.log(data);

					var table = new Table({
						head: ['ID', 'DEPARTMENT', 'OVERHEAD', 'TOTAL SALES', 'NET PROFIT'],
						colWidths: [6, 20, 10, 16, 16]
					});
					for (i=0; i<data.length; i++) {
						var row = [];
						row.push(data[i].department_id, data[i].department, data[i].overhead_cost, data[i].total, (data[i].total - data[i].overhead_cost).toFixed(2));
						table.push(row);
					}
					console.log(table.toString());						
					selectAction();
				});


				break;
			case "Create New Department":
				inquirer.prompt([
					{
						type: "input",
						name: "department",
						message: "Enter a name for the new department:"
					},
					{
						type: "input",
						name: "overhead_cost",
						message: "Enter the total overhead cost:"
					}			
				]).then(function(answers) {
					connection.query("INSERT INTO Departments (department, overhead_cost) VALUES (?, ?)", [answers.department, answers.overhead_cost], function(err, data) {
							if (err) throw err;
							process.stdout.write('\033c'); //clear terminal window
							console.log("Added new department.\n");
							selectAction();

					}); // close INSERT						
				});	// close .then(function(answers)
				break;
		}; //close Switch
	}); // close prompt
}; // close selectAction()