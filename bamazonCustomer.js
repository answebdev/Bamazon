var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("Connected as ID: " + connection.threadId);
    // if (err) throw err;
    // Run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer.prompt(
        {
            name: "productID",
            message: "What is the ID of the product you would like to buy?",
            type: "ID"
        },
        {
            name: "quantity",
            message: "How many would you like to buy?",
            type: "quantity"
        }
    )
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                console.log("\nYou've entered: " + inquirerResponse.name);
                console.log("\nYou've ordered: " + inquirerResponse.quantity);
            }
            else {
                console.log("\nTry again.");
            }
        });
}