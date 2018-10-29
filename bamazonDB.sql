drop database if exists bamazonDB;
create database bamazonDB;

use bamazonDB;

create table products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Jeans", "Clothing, Shoes & Jewelry", 25.00, 50);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Electronic Toothbrush", "Beauty and Personal Care", 138.00, 35);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Swatch Watch", "Clothing, Shoes & Jewelry", 44.49, 15);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Toshiba Microwave Oven", "Home & Kitchen", 87.16, 25);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Toblerone Swiss Milk Chocolate (1 Bar)", "Candy & Chocolate", 2.09, 50);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Roget's International Thesaurus, 7th Edition (Paperback)", "Books", 20.00, 20);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Apple iPhone X, Fully Unlocked", "Cell Phones  & Accessories", 1040.00, 5);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Floor Lamp", "Tools & Home Improvement", 74.99, 8);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Alarm Clock", "Home & Kitchen", 10.69, 10);

    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Suave Professionals Shampoo", "Shampoo & Conditioner", 3.99, 12);
