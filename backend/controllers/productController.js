const db = require("../config/db");

// Add Product
exports.addProduct = (req, res) => {
    const { name, description, price } = req.body;

    const image = req.file ? req.file.filename : null;

    const sql =
        "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, description, price, image], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Product adding failed",
                error: err,
            });
        }

        res.json({
            message: "Product added successfully",
            productId: result.insertId,
        });
    });
};

// Get All Products
exports.getProducts = (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to fetch products",
                error: err,
            });
        }

        res.json(result);
    });
};

// Get Single Product
exports.getProductById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to fetch product",
                error: err,
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(result[0]);
    });
};

// Update Product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
        UPDATE products
        SET name = ?, description = ?, price = ?, image = ?
        WHERE id = ?
    `;

    db.query(sql, [name, description, price, image, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Product update failed",
                error: err,
            });
        }

        res.json({
            message: "Product updated successfully",
        });
    });
};

// Delete Product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Product deletion failed",
                error: err,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json({
            message: "Product deleted successfully",
        });
    });
};