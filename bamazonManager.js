var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');

// Create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Port, if not 3306
    port: 3306,

    // Username
    user: "root",
    // Would have to do something like process.env.PASSWORD and then
    // put in a .env to then put in a .gitignore

    // Password
    password: "root",
    database: "bamazonDB"
});

// Connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId + "\n");
    console.log(colors.yellow("B A M A Z O N  M A N A G E R\n"));
    // Display table of products in the terminal
    // displayTable();
    start();
});

// function displayTable() {
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         // Instantiate Table
//         var table = new Table({
//             head: ['PRODUCT ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'PRICE', 'NO. AVAILABLE'],
//             colWidths: [12, 60, 35, 10, 15]
//         });
//         for (var i = 0; i < res.length; i++) {
//             // Create table
//             var newRow = [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
//             table.push(newRow);
//         }
//         console.log(table.toString());
//         start();
//     })
// }

function start() {
    inquirer.prompt([
        {
            "name": "action",
            "message": colors.yellow("Welcome to your Bamazon manager console. Please select one of the following:"),
            "type": "list",
            "choices": ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (choice) {
        switch (choice.action) {
            case "View Products for Sale":
                displayTable();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add to Inventory":
                addToInv();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                console.log(colors.cyan("\nThank you for shopping with us. Please come again."))
                connection.end()
                break;
        }
    })
}

function viewLowInv() {
    inquirer.prompt([
        {
            "name": "action",
            "message": colors.yellow("Welcome to Bamazon! What would you like to do?"),
            "type": "list",
            "choices": ["Buy an item", "Exit"]
        }
    ]).then(function (choice) {
        switch (choice.action) {
            case "Buy an item":
                shop();
                break;
            case "Exit":
                console.log(colors.cyan("\nThank you for shopping with us. Please come again."))
                connection.end()
                break;
        }
    })
}

function displayTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Instantiate Table
        var table = new Table({
            head: ['PRODUCT ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'PRICE', 'NO. AVAILABLE'],
            colWidths: [12, 60, 35, 10, 15]
        });
        for (var i = 0; i < res.length; i++) {
            // Create table
            var newRow = [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
            table.push(newRow);
        }
        console.log(table.toString());
        start();
    })
}