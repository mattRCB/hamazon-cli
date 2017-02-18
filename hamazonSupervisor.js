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
		process.stdout.write('\033c'); //clear terminal window\
		switch (user_input.action) {
			case "Exit":
				process.exit();
			case "View Product Sales by Department":

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