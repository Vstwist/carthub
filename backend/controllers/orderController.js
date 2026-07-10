const db = require("../config/db");

// Place Order
exports.placeOrder = (req, res) => {

    const {
        user_id,
        customer_name,
        phone,
        address,
        city,
        state,
        pincode
    } = req.body;


    // Get cart items
    const cartSql = `
        SELECT 
            cart.product_id,
            cart.quantity,
            products.price
        FROM cart
        JOIN products
        ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;


    db.query(cartSql, [user_id], (err, cartItems) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to fetch cart",
                error: err
            });
        }


        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }


        let total = 0;

        cartItems.forEach(item => {
            total += Number(item.price) * item.quantity;
        });


        // Insert order
        const orderSql = `
            INSERT INTO orders
            (
                user_id,
                total_amount,
                payment_method,
                payment_status,
                order_status,
                customer_name,
                phone,
                address,
                city,
                state,
                pincode
            )
            VALUES (?, ?, 'Cash on Delivery', 'Pending', 'Placed', ?, ?, ?, ?, ?, ?)
        `;


        db.query(
            orderSql,
            [
                user_id,
                total,
                customer_name,
                phone,
                address,
                city,
                state,
                pincode
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Order creation failed",
                        error: err
                    });
                }


                const order_id = result.insertId;


                // Insert order items

                const itemSql = `
                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        quantity,
                        price
                    )
                    VALUES ?
                `;


                const values = cartItems.map(item => [
                    order_id,
                    item.product_id,
                    item.quantity,
                    item.price
                ]);


                db.query(
                    itemSql,
                    [values],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Order items failed",
                                error: err
                            });
                        }


                        // Clear cart

                        db.query(
                            "DELETE FROM cart WHERE user_id = ?",
                            [user_id],
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: "Cart clearing failed",
                                        error: err
                                    });
                                }


                                res.json({
                                    message: "Order placed successfully",
                                    order_id,
                                    total
                                });

                            }
                        );

                    }
                );

            }
        );

    });

};