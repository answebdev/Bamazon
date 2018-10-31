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
    // Run the start function after the connection is made to prompt the user
    // start();
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
            var productID = inquirerResponse.productID;
            var quantity = inquirerResponse.quantity;
            // var query = "SELECT item_ID, product_name, department_name, price, stock_quantity FROM products WHERE ?";
            connection.query('SELECT * FROM products WHERE item_id=?', [productID], function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("\nYou chose Product ID " + res[i].item_id + ": " + res[i].product_name);
                    console.log("You chose: " + inquirerResponse.quantity);
                    // var inStock = res[0].inStock;
                    // if (inStock < quantity) {
                        if (inquirerResponse.quantity > res[i].stock_quantity) {
                        console.log("Insufficient quantity! Please try again.\n");
                        start();
                    } else {

                        connection.query("UPDATE products SET stock_quantity='"+(res[i].stock_quantity-inquirerResponse.quantity)+"' WHERE product_name='"+res[i].product_name+"'",function(err,res) {
                            console.log("Item added to cart!");
                            displayTable();
                        })



                        // inStock -= quantity;
                        // console.log("IN STOCK: " + inStock);

                        // console.log("Number available: " + res[i].stock_quantity + "\n");
                        // setTimeout(start, 1000);

                        // for (var i = 0; i < res.length; i++) {
                        //     console.log("You chose: " + res[i].item_id);
                    }
                }
            })
        })
}