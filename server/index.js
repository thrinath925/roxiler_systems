const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require('cors');


let db = new sqlite3.Database('Ecom.db');
const app = express();
app.use(cors());





app.get("/dbapi", async (request, response) => {
  let msg;
  let data;
  try {
    const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

  
    // Create a products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        title TEXT,
        price REAL,
        description TEXT,
        category TEXT,
        image TEXT,
        sold BOOLEAN,
        dateOfSale TEXT
      )
    `, function (err) {
      if (err) {
        console.error('Error creating table:', err.message);
        msg = err.message
      } else {
        console.log('Table created successfully');
        msg = "Table created successfully"
      }
    });
  
  data.map(product => {
    const query = `
            INSERT INTO products (id, title, price, description, category, image, sold, dateOfSale)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    db.run(query, [
      product.id,
      product.title,
      product.price,
      product.description,
      product.category,
      product.image,
      product.sold,
      product.dateOfSale
    ]);
  });

  response.send(`${msg}`)
});

app.listen(3000, () => {
  console.log("Server Running at http://localhost:3000/");
});

db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});

const dbPath = path.join(__dirname, "Ecom.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();



app.get("/product-transactions/:month", async (request, response) => {

  const { search = "", offset = 0} = request.query;
  const { month = "March" } = request.params;
  const temp = 0
  const limit = 10;
  let dateOfSale
  if (month === "March") {
    dateOfSale = '03';
  }
  else if (month === "April") {
    dateOfSale = '04';
  }
  else if (month === "May") {
    dateOfSale = '05';
  }

  else if (month === "June") {
    dateOfSale = '06';
  }

  else if (month === "July") {
    dateOfSale = '07';
  }


  else if (month === "August") {
    dateOfSale = '08';
  }

  else if (month === "September") {
    dateOfSale = '09';
  }

  else if (month === "October") {
    dateOfSale = '10';
  }

  else if (month === "November") {
    dateOfSale = '11';
  }

  else if (month === "December") {
    dateOfSale = '12';
  }
  else if (month === "January") {
    dateOfSale = '01';
  }
  else if (month === "February") {
    dateOfSale = '02';
  }

  console.log(dateOfSale)
  const Query = `
      SELECT
        *
      FROM
       products
      WHERE
       (title LIKE '%${search}%' or description LIKE '%${search}%' or price LIKE '%${search}%')
       AND strftime('%m', dateOfSale) = '${dateOfSale}'
       LIMIT ${limit} OFFSET ${offset}
      `;

      const Query2 = `
      WITH FilteredProducts AS (
        SELECT
          *
        FROM
          products
        WHERE
          (title LIKE '%${search}%' OR description LIKE '%${search}%' OR price LIKE '%${search}%')
          AND strftime('%m', dateOfSale) = '${dateOfSale}'
      )
      
      SELECT
        COUNT(*) AS totalItems,
        SUM(price) AS TotalSale,
        SUM(CASE WHEN sold > 0 THEN 1 ELSE 0 END) AS totalSoldItems,
        SUM(CASE WHEN sold = 0 THEN 1 ELSE 0 END) AS totalNotSoldItems
      FROM
        FilteredProducts;
    `;
    
  const Query2Response = await db.all(Query2);
  console.log(Query2Response)
  const Query1Response = await db.all(Query);
  const ResponseArray = [Query1Response,Query2Response]
  response.send(ResponseArray);
});




