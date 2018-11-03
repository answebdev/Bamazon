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
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['PRODUCT ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'PRICE', 'NO. AVAILABLE'],
            colWidths: [12, 60, 35, 10, 15]
        })

        for (var i = 0; i < res.length; i++) {
            var newRow = [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
            table.push(newRow);
        }
        console.log("\n" + table.toString());
        start();
    })
}

function addToInv() {
    inquirer.prompt([
        {
            name: "productID",
            message: "To add to the inventory, enter the Product ID:",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "How many items would you like to add?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (inquirerResponse) {
            // if ((inquirerResponse.productID) > 10 || (inquirerResponse.productID < 1)) {
            //     console.log(colors.cyan("\nPlease enter a valid product ID to continue.\n"));
            //     return start();
            // }
            var productID = inquirerResponse.productID;
            var quantity = inquirerResponse.quantity;
            connection.query('SELECT * FROM products WHERE item_id=?', [productID], function (err, res) {
                if (err) throw err;
                var product = res[0].product_name;
                var orderTotal = 0;
                for (var i = 0; i < res.length; i++) {
                    connection.query("UPDATE products SET stock_quantity='" + (parseInt(res[i].stock_quantity) + parseInt(inquirerResponse.quantity)) + "' WHERE item_id='" + res[i].item_id + "'", function (err, res) {
                        console.log(colors.cyan("\nYou have succesfully added to the inventory!"));
                        console.log(colors.cyan("\nItem: " + product));
                        console.log(colors.cyan("Quantity Added: " + inquirerResponse.quantity));
                        displayTable();
                    })
                }
            })
        })
}

function addProduct() {
    inquirer.prompt([
        {
            name: "productName",
            message: "Please enter the name of the product you wish to add:",
            type: "input"
        },
        {
            "name": "departmentName",
            "message": "Please select the department.",
            "type": "list",
            "choices": ["Clothing, Shoes & Jewelry", "Beauty and Personal Care",
                "Home & Kitchen", "Candy & Chocolate", "Books", "Cell Phones & Accessories",
                "Tools & Home Improvement", "Shampoo & Conditioner", "Exit"]
        },
        {
            name: "cost",
            message: "How much does this item cost?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "How many items would you like to add?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (inquirerResponse) {

            var product_name = inquirerResponse.productName;
            var department_name = inquirerResponse.departmentName;
            var price = inquirerResponse.cost;
            var stock_quantity = inquirerResponse.quantity;

            connection.query("INSERT INTO products SET ?",
                { product_name, department_name, price, stock_quantity }, function (err, res) {
                    if (err) throw err;
                    console.log("PRODUCT ID: " + res.insertId);

                    console.log(colors.cyan("\nYou have added the following item:\n"));
                    console.log(colors.cyan("PRODUCT NAME: " + product_name));
                    console.log(colors.cyan("DEPARTMENT NAME: " + department_name));
                    console.log(colors.cyan("PRICE: " + "$" + price));
                    console.log(colors.cyan("NUMBER OF ITEMS ADDED: " + stock_quantity + "\n"));

                    displayTable();
                })
        })
}