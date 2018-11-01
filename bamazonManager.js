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
            if ((inquirerResponse.productID) > 10 || (inquirerResponse.productID < 1)) {
                console.log(colors.cyan("\nPlease enter a valid product ID to continue.\n"));
                return start();
            }
            var productID = inquirerResponse.productID;
            var quantity = inquirerResponse.quantity;
            // var query = "SELECT item_ID, product_name, department_name, price, stock_quantity FROM products WHERE ?";
            connection.query('SELECT * FROM products WHERE item_id=?', [productID], function (err, res) {
                if (err) throw err;
                var product = res[0].product_name;
                var orderTotal = 0;
                for (var i = 0; i < res.length; i++) {
                    connection.query("UPDATE products SET stock_quantity='" + (parseInt(res[i].stock_quantity) + parseInt(inquirerResponse.quantity)) + "' WHERE item_id='" + res[i].item_id + "'", function (err, res) {
                        console.log(colors.cyan("\nYou have succesfully added to the inventory!"));
                        console.log(colors.cyan("\nItem: " + product));
                        console.log(colors.cyan("Quantity: " + inquirerResponse.quantity));
                        displayTable();
                        // start();
                    })
                    // }
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
            // validate: function (value) {
            //     if (isNaN(value) === false) {
            //         return true;
            //     }
            //     return false;
            // }
        },
        {
            "name": "departmentName",
            "message": colors.yellow("Please select the department."),
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
            // if ((inquirerResponse.productID) > 10 || (inquirerResponse.productID < 1)) {
            //     console.log(colors.cyan("\nPlease enter a valid product ID to continue.\n"));
            //     return start();
            // }
            // var productID = inquirerResponse.productID;
            // var quantity = inquirerResponse.quantity;
            // var query = "SELECT item_ID, product_name, department_name, price, stock_quantity FROM products WHERE ?";
            // connection.query('INSERT INTO products SET ?', newProductInfo, function (err, res) {
            var newProductInfo = {
                product_name: inquirerResponse.product_name,
                department_name: inquirerResponse.department_name,
                price: inquirerResponse.price,
                stock_quantity: inquirerResponse.stock_quantity
            }
            connection.query('INSERT INTO products SET ?', newProductInfo, function (err, res) {
                if (err) throw err;
                // var product = res[0].product_name;
                // var orderTotal = 0;
                // for (var i = 0; i < res.length; i++) {

                console.log("You have added the following item:\n");
                console.log("PRODUCT NAME: " + inquirerResponse.product_name);
                console.log("DEPARTMENT NAME: " + inquirerResponse.department_name); 
                console.log("PRICE: " + inquirerResponse.price);
                console.log("NUMBER OF ITEMS ADDED " + inquirerResponse.stock_quantity + "\n");

                // connection.query("UPDATE products SET stock_quantity='" + (parseInt(res[i].stock_quantity) + parseInt(inquirerResponse.quantity)) + "' WHERE item_id='" + res[i].item_id + "'", function (err, res) {
                //     console.log(colors.cyan("\nYou have succesfully added to the inventory!"));
                //     console.log(colors.cyan("\nItem: " + product));
                //     console.log(colors.cyan("Quantity: " + inquirerResponse.quantity));

                displayTable();
                // start();
            })
            // }
            // }
        })
}
