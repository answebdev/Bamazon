var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');

// require('events').EventEmitter.prototype._maxListeners = 100;
// require('events').EventEmitter.defaultMaxListeners = 15;

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

function start() {
    inquirer.prompt([
        {
            "name": "action",
            "message": colors.yellow("Welcome to your Bamazon manager console. Please select one of the following:"),
            "type": "list",
            "choices": ["View Products for Sale", "View Low Inventory (less than 5 items)", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (choice) {
        switch (choice.action) {
            case "View Products for Sale":
                displayTable();
                break;
            case "View Low Inventory (less than 5 items)":
                viewLowInv();
                break;
            case "Add to Inventory":
                addToInv();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                console.log(colors.cyan("\nExiting program."))
                connection.end()
                break;
        }
    })
}

function viewLowInv() {
    // console.log("Less then 5 items here");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['PRODUCT ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'PRICE', 'NO. AVAILABLE'],
            colWidths: [12, 60, 35, 10, 15]
        })

        for (var i = 0; i < res.length; i++) {
            // if (res[i].stock_quantity < 5) {
                var newRow = [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
                // var newRow = [row.item_id, row.product_name, row.department_name, "$" + row.price.toFixed(2), row.stock_quantity];
                table.push(newRow);
                // displayTable();
            }
            console.log("\n" + table.toString());
            start();
    })
}

function addToInv() {
    console.log("Add to inventory");
    start();
}

function addProduct() {
    console.log("Add product");
    start();
}