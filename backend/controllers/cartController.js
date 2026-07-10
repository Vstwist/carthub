const db = require("../config/db");

// Add to Cart
exports.addToCart = (req, res) => {
    const { user_id, product_id } = req.body;

    const checkSql =
        "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";

    db.query(checkSql, [user_id, product_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        if (result.length > 0) {
            const updateSql =
                "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";

            db.query(updateSql, [user_id, product_id], (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Unable to update cart",
                        error: err
                    });
                }

                res.json({
                    message: "Quantity updated"
                });
            });
        } else {
            const insertSql =
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)";

            db.query(insertSql, [user_id, product_id], (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Unable to add to cart",
                        error: err
                    });
                }

                res.json({
                    message: "Product added to cart"
                });
            });
        }
    });
};

// Get Cart
exports.getCart = (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT
            cart.id,
            products.name,
            products.description,
            products.price,
            products.image,
            cart.quantity
        FROM cart
        JOIN products
            ON cart.product_id = products.id
        WHERE cart.user_id = ?;
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to fetch cart",
                error: err
            });
        }

        res.json(result);
    });
};
// Increase Quantity
exports.increaseQuantity = (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE id = ?",
        [id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({ message: "Quantity increased" });
        }
    );
};

// Decrease Quantity
exports.decreaseQuantity = (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE id = ? AND quantity > 1",
        [id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({ message: "Quantity decreased" });
        }
    );
};

// Remove Item
exports.removeFromCart = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM cart WHERE id = ?",
        [id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({ message: "Item removed" });
        }
    );
};