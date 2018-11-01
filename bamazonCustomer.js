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
    console.log(colors.yellow("W E L C O M E  T O  B A M A Z O N\n"));
    // Display table of products in the terminal
    displayTable();
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

function shop() {
    inquirer.prompt([
        {
            name: "productID",
            message: "What would you like to buy? Please enter the Product ID:",
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
            message: "How many would you like to buy?",
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
            // if (inquirerResponse.productID.toUpperCase() == 'Q') {
            // connection.end();
            //     console.log("GOODBYE!");
            //     // printUsageToStdout();
            //     // process.exit();
            //     // process.exitCode = 1;
            //     // process.on('exit', function() { process.exit(1); });
            //     // process.exit(-1);
            // }
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
                var price = res[0].price.toFixed(2);
                var orderTotal = 0;
                for (var i = 0; i < res.length; i++) {
                    // console.log("\nYou have selected product ID " + res[i].item_id + ": " + res[i].product_name);
                    // console.log("Quantity: " + inquirerResponse.quantity);
                    if (inquirerResponse.quantity > res[i].stock_quantity) {
                        console.log(colors.cyan("\nThere are not enough in stock. Please try again.\n"));
                        // console.log(colors.cyan("\nThere are only " + res[i].stock_quantity + " of those in stock. Please try again.\n"));
                        start();
                    } else {
                        connection.query("UPDATE products SET stock_quantity='" + (res[i].stock_quantity - inquirerResponse.quantity) + "' WHERE item_id='" + res[i].item_id + "'", function (err, res) {
                            console.log(colors.cyan("\nYour order was placed successfully!"));
                            console.log(colors.cyan("\nItem: " + product));
                            console.log(colors.cyan("Quantity: " + inquirerResponse.quantity));
                            console.log(colors.cyan("Your total comes to $" + (price * inquirerResponse.quantity).toFixed(2)+".\n"));
                            displayTable();
                        })
                    }
                }
            })
        })
}