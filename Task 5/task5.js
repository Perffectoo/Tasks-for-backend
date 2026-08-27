const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

app.use(express.json());

// MySQL Connection Pool   sybk men connection al 3adya
const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "perfecto",
    password: "12341234",
    port: 3306,
    database: "retail_store",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create Product
app.post("/addProduct", async (req, res) => {
    try {
        const {
            product_name,
            price,
            stock_quantity,
            supplier_id
        } = req.body;

        // hat2ked law product mawgod wla la
        const [products] = await pool.execute(
            "SELECT * FROM products WHERE product_name = ?",
            [product_name]
        );

        if (products.length > 0) {
            return res.status(400).json({
                message: "Product has been added already in the database"
            });
        }

        // Insert product
        const [result] = await pool.execute(
            `INSERT INTO products
            (product_name, price, stock_quantity, supplier_id)
            VALUES (?, ?, ?, ?)`,
            [product_name, price, stock_quantity, supplier_id]
        );

        return res.status(201).json({
            message: "Product has been added successfully",
            productId: result.insertId
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error inserting product",
            error: error.message
        });
    }
});

app.get("/getAllProducts",async (req,res)=>{
    try{
const[allProducts]=await pool.execute(
            "SELECT * FROM products ", 
)

        return res.status(200).json({
            allProducts
        });

    }catch (err){
return res.status(500).json({message:"Error getting all products"})
    }
})

app.get("/getProduct/:id",async (req,res)=>{
    try{
        const {id}=req.params;
const[product]=await pool.execute(
            "SELECT * FROM products WHERE id=?  ", 
    [id] );
    if(product.length===0){
            return res.status(401).json({
                message: "No product was found"
            });
    }

        return res.status(200).json({
          product
        });

    }catch (err){
return res.status(500).json({message:"Error getting all products"})
    }
})

app.patch("/updateProduct/:id", async (req, res) => {
    try {
        const {id}=req.params;
        const {
            product_name,
            price,
            stock_quantity,
            supplier_id
        } = req.body;


        const [Update] = await pool.execute(
        'UPDATE products SET product_name=?,price=?, stock_quantity=?,supplier_id=?',
            [product_name, price, stock_quantity, supplier_id]
        );
        if(Update.affectedRows===0){
            return res.status(200).json({
            message: "No product found",
        });   
        }

        return res.status(201).json({
            message: "Product has been Updated successfully",
           data:Update  
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating has error product",
            error: error.message
        });
    }
});


app.delete("/deleteProduct/:id",async(req,res)=>{
    try{
const {id}=req.params;
    const [remove]=await pool.execute(
        'DELETE FROM products WHERE id=?',[id]
    )
    if(remove.affectedRows===0){
          return res.status(401).json({
            message: "No product was found to be deleted",
        }); 
    }else{
           return res.status(201).json({
            message: "Product has been deleted",
            data: remove
        });
    }
    }catch (error) {
        return res.status(500).json({
            message: "Error deleting has error product",
            error: error.message
        });
    }
}
)



// Suppliers
app.post("/addSupplier", async (req, res) => {
    try {
        const {
            supplier_name,
            contact_number
        } = req.body;

        const [suppliers] = await pool.execute(
            "SELECT * FROM suppliers WHERE supplier_name = ?",
            [supplier_name]
        );

        if (suppliers.length > 0) {
            return res.status(400).json({
                message: "Supplier already exists"
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO suppliers
            (supplier_name, contact_number)
            VALUES (?, ?)`,
            [supplier_name, contact_number]
        );

        return res.status(201).json({
            message: "Supplier has been added successfully",
            supplierId: result.insertId
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error adding supplier",
            error: error.message
        });
    }
});


app.get("/getAllSuppliers", async (req, res) => {
    try {
        const [allSuppliers] = await pool.execute(
            "SELECT * FROM suppliers"
        );

        return res.status(200).json({
            allSuppliers
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting all suppliers",
            error: error.message
        });
    }
});

app.patch("/updateSupplier/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            supplier_name,
            contact_number
        } = req.body;

        const [Update] = await pool.execute(
            `UPDATE suppliers
             SET supplier_name = ?, contact_number = ?
             WHERE id = ?`,
            [supplier_name, contact_number, id]
        );

        if (Update.affectedRows === 0) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        const [supplier] = await pool.execute(
            "SELECT * FROM suppliers WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            message: "Supplier has been updated successfully",
            data: supplier[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating supplier",
            error: error.message
        });
    }
});

app.delete("/deleteSupplier/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [remove] = await pool.execute(
            "DELETE FROM suppliers WHERE id = ?",
            [id]
        );

        if (remove.affectedRows === 0) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        return res.status(200).json({
            message: "Supplier has been deleted",
            data: remove
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting supplier",
            error: error.message
        });
    }
});


//Sales

app.post("/addSale", async (req, res) => {
    try {

        const {
            product_id,
            quantity_sold
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO sales
            (product_id, quantity_sold)
            VALUES (?, ?)`,
            [product_id, quantity_sold]
        );

        return res.status(201).json({
            message: "Sale has been recorded successfully",
            saleId: result.insertId
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error recording sale",
            error: error.message
        });
    }
});

app.get("/getAllSales", async (req, res) => {
    try {

        const [allSales] = await pool.execute(
            "SELECT * FROM sales"
        );

        return res.status(200).json({
            allSales
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting all sales",
            error: error.message
        });
    }
});

app.get("/getSalesByProduct/:product_id", async (req, res) => {
    try {

        const { product_id } = req.params;

        const [sales] = await pool.execute(
            "SELECT * FROM sales WHERE product_id = ?",
            [product_id]
        );

        if (sales.length === 0) {
            return res.status(404).json({
                message: "No sales found for this product"
            });
        }

        return res.status(200).json({
            sales
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting sales",
            error: error.message
        });
    }
});




// 5. DATABASE MODIFICATIONS


// 5.1 Add Category column
app.post("/addCategory", async (req, res) => {
    try {

        await pool.execute(
            "ALTER TABLE products ADD COLUMN category VARCHAR(100)"
        );

        return res.status(200).json({
            message: "Category column added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error adding category",
            error: error.message
        });
    }
});


// 5.2 Remove Category column
app.delete("/removeCategory", async (req, res) => {
    try {

        await pool.execute(
            "ALTER TABLE products DROP COLUMN category"
        );

        return res.status(200).json({
            message: "Category column removed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error removing category",
            error: error.message
        });
    }
});


// 5.3 Change ContactNumber to VARCHAR(15)
app.put("/changeContactNumber", async (req, res) => {
    try {

        await pool.execute(
            "ALTER TABLE suppliers MODIFY contact_number VARCHAR(15) NOT NULL"
        );

        return res.status(200).json({
            message: "Contact number changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error changing contact number",
            error: error.message
        });
    }
});


// 5.4 Add NOT NULL constraint to ProductName
app.put("/productNameNotNull", async (req, res) => {
    try {

        await pool.execute(
            "ALTER TABLE products MODIFY product_name VARCHAR(255) NOT NULL"
        );

        return res.status(200).json({
            message: "Product name is NOT NULL"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error adding NOT NULL constraint",
            error: error.message
        });
    }
});



// 6. INSERT REQUIRED DATA


app.post("/insertRequiredData", async (req, res) => {
    try {

        // Add FreshFoods
        const [supplierResult] = await pool.execute(
            `INSERT INTO suppliers
            (supplier_name, contact_number)
            VALUES (?, ?)`,
            ["FreshFoods", "01001234567"]
        );

        const supplierId = supplierResult.insertId;


        // Add Milk
        const [milkResult] = await pool.execute(
            `INSERT INTO products
            (product_name, price, stock_quantity, supplier_id)
            VALUES (?, ?, ?, ?)`,
            ["Milk", 15.00, 50, supplierId]
        );

        const milkId = milkResult.insertId;


        // Add Bread
        await pool.execute(
            `INSERT INTO products
            (product_name, price, stock_quantity, supplier_id)
            VALUES (?, ?, ?, ?)`,
            ["Bread", 10.00, 30, supplierId]
        );


        // Add Eggs
        await pool.execute(
            `INSERT INTO products
            (product_name, price, stock_quantity, supplier_id)
            VALUES (?, ?, ?, ?)`,
            ["Eggs", 20.00, 40, supplierId]
        );


        // Add sale of 2 Milk
        await pool.execute(
            `INSERT INTO sales
            (product_id, quantity_sold, created_at)
            VALUES (?, ?, ?)`,
            [milkId, 2, "2025-05-20"]
        );


        return res.status(201).json({
            message: "Required data inserted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error inserting required data",
            error: error.message
        });
    }
});



// 7. UPDATE BREAD PRICE


app.put("/updateBreadPrice", async (req, res) => {
    try {

        const [result] = await pool.execute(
            `UPDATE products
             SET price = ?
             WHERE product_name = ?`,
            [25.00, "Bread"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Bread not found"
            });
        }

        return res.status(200).json({
            message: "Bread price updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating Bread",
            error: error.message
        });
    }
});



// 8. DELETE EGGS


app.delete("/deleteEggs", async (req, res) => {
    try {

        const [result] = await pool.execute(
            `DELETE FROM products
             WHERE product_name = ?`,
            ["Eggs"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Eggs not found"
            });
        }

        return res.status(200).json({
            message: "Eggs deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting Eggs",
            error: error.message
        });
    }
});



// 9. TOTAL QUANTITY SOLD FOR EACH PRODUCT


app.get("/totalQuantitySold", async (req, res) => {
    try {

        const [result] = await pool.execute(`
            SELECT
                product_id,
                SUM(quantity_sold) AS total_quantity_sold
            FROM sales
            GROUP BY product_id
        `);

        return res.status(200).json({
            result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting total quantity sold",
            error: error.message
        });
    }
});



// 10. PRODUCT WITH HIGHEST STOCK


app.get("/highestStockProduct", async (req, res) => {
    try {

        const [result] = await pool.execute(`
            SELECT *
            FROM products
            ORDER BY stock_quantity DESC
            LIMIT 1
        `);

        return res.status(200).json({
            product: result[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting highest stock product",
            error: error.message
        });
    }
});



// 11. SUPPLIERS STARTING WITH F


app.get("/suppliersStartingWithF", async (req, res) => {
    try {

        const [suppliers] = await pool.execute(`
            SELECT *
            FROM suppliers
            WHERE supplier_name LIKE 'F%'
        `);

        return res.status(200).json({
            suppliers
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting suppliers",
            error: error.message
        });
    }
});



// 12. PRODUCTS THAT HAVE NEVER BEEN SOLD


app.get("/neverSoldProducts", async (req, res) => {
    try {

        const [products] = await pool.execute(`
            SELECT p.*
            FROM products p
            LEFT JOIN sales s
                ON p.id = s.product_id
            WHERE s.product_id IS NULL
        `);

        return res.status(200).json({
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting never sold products",
            error: error.message
        });
    }
});



// 13. SALES REPORT USING JOIN


app.get("/salesReport", async (req, res) => {
    try {

        const [sales] = await pool.execute(`
            SELECT
                p.product_name,
                s.quantity_sold,
                s.created_at
            FROM sales s
            JOIN products p
                ON s.product_id = p.id
        `);

        return res.status(200).json({
            sales
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error getting sales report",
            error: error.message
        });
    }
});



// 14. CREATE store_manager USER


app.post("/createStoreManager", async (req, res) => {
    try {

        await pool.execute(`
            CREATE USER 'store_manager'@'localhost'
            IDENTIFIED BY 'StoreManager123!'
        `);

        await pool.execute(`
            GRANT SELECT, INSERT, UPDATE
            ON retail_store.*
            TO 'store_manager'@'localhost'
        `);

        return res.status(201).json({
            message: "store_manager created and permissions granted"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating store_manager",
            error: error.message
        });
    }
});



// 15. REVOKE UPDATE


app.put("/revokeUpdate", async (req, res) => {
    try {

        await pool.execute(`
            REVOKE UPDATE
            ON retail_store.*
            FROM 'store_manager'@'localhost'
        `);

        return res.status(200).json({
            message: "UPDATE permission revoked successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error revoking UPDATE permission",
            error: error.message
        });
    }
});



// 16. GRANT DELETE ONLY ON SALES


app.put("/grantSalesDelete", async (req, res) => {
    try {

        await pool.execute(`
            GRANT DELETE
            ON retail_store.sales
            TO 'store_manager'@'localhost'
        `);

        return res.status(200).json({
            message: "DELETE permission granted on Sales table"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error granting DELETE permission",
            error: error.message
        });
    }
});




// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})