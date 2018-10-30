var mysql = require("mysql");
var inquirer = require("inquirer");
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
    console.log(colors.yellow("W E L C O M E  T O  B A M A Z O N"));
    // Display table of products in the terminal
    displayTable();
    // Run the start function after the connection is made to prompt the user
    // start();
});

function displayTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\nPRODUCT ID: " + res[i].item_id);
            console.log("PRODUCT NAME: " + res[i].product_name);
            console.log("DEPARTMENT NAME: " + res[i].department_name);
            console.log("PRICE: " + "$" + res[i].price.toFixed(2));
            console.log("NUMBER AVAILABLE IN STOCK: " + res[i].stock_quantity + "\n");
        }
        start();
    })
}

function start() {
    inquirer.prompt(
        {
            name: "productID",
            message: "What would you like to buy? Please enter the Product ID.",
            type: "ID"
        },
        {
            name: "quantity",
            message: "How many would you like to buy?",
            type: "quantity"
        }
    )
        // .then(function (inquirerResponse) {
        //     if (inquirerResponse.confirm) {
        //         console.log("\nYou've entered: " + inquirerResponse.name);
        //         console.log("\nYou've ordered: " + inquirerResponse.quantity);
        //     }
        //     else {
        //         console.log("\nTry again.");
        //     }
        // });

        // .then(function (inquirerResponse) {
        //     var correct = false;
        //     for (var i = 0; i < inquirerResponse.length; i++) {
        //         if (res[i].item_id === inquirerResponse.productID) {
        //             correct = true;
        //             var IDNumber = inquirerResponse.productID;
        //             console.log("You chose: " + IDNumber);
        //             // var id=i;
        //         }
        //     }
        // })

        
}