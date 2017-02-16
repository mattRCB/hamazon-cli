CREATE TABLE Departments (
	P_Id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (P_Id),
	department varchar(30) NOT NULL,
	overhead_cost decimal(10,2)
);

CREATE TABLE Products (
	P_Id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (P_Id),
	product varchar(30) NOT NULL,
	department_id int NOT NULL,
	FOREIGN KEY (department_id) REFERENCES Departments(P_Id),
	price decimal(10,2) NOT NULL,
	qyt_instock int NOT NULL
);

CREATE TABLE Sales (
	P_Id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (P_Id),
	product_id int NOT NULL,
	FOREIGN KEY (product_id) REFERENCES Products(P_Id),
	qty_purchased int NOT NULL,
	created_at timestamp
);





















































