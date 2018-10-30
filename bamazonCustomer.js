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
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId + "\n");
    console.log("W E L C O M E  T O  B A M A Z O N\n");
    // Run the start function after the connection is made to prompt the user
    displayTable();
    // start();
});

function displayTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            // console.log("ITEM ID" + " | " + "PRODUCT NAME" + "                                            | " + "DEPARTMENT NAME" +
            //     " | " + "PRICE" + " | " + "STOCK" + "\n" + res[i].item_id + "       | " + 
            //     res[i].product_name +
            //     " | " + res[i].department_name + " | " + res[i].price +
            //     " | " + res[i].stock_quantity + "\n");

            console.log("PRODUCT ID: " + res[i].item_id);
            console.log("PRODUCT NAME: " + res[i].product_name);
            console.log("DEPARTMENT NAME: " + res[i].department_name);
            console.log("PRICE: " + res[i].price.toFixed(2));
            console.log("NUMBER AVAILABLE IN STOCK: " + res[i].stock_quantity + "\n");
                
        }
    })
}

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