require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

const rootPath = path.join(__dirname, "..");

app.use(express.static(rootPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(rootPath, "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "campuskart",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image",

        quality: "auto:best",
        fetch_format: "auto"
    })
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

// =========================
// PRODUCTS
// =========================

app.get("/products", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM products ORDER BY product_id DESC"
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

app.get("/pending-products", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM pending_products ORDER BY product_id DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});
// =========================
// ADD PRODUCT
// =========================
app.post(
    "/add-product",

    upload.array("images", 5),

    async (req, res) => {

        try {
            const {
                product_name,
                price,
                category,
                user_email,
                contact,
                description,
                user_name
            } = req.body;

            const stock = 1;
            const images =
    req.files.length > 0
        ? req.files.map(file => file.path).join(",")
        : null;
            

            await db.query(
                `INSERT INTO pending_products
                (
                    product_name,
                    price,
                    category,
                    stock,
                    images,
                    user_email,
                    user_name,
                    contact,
                    description
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                [
                    product_name,
                    price,
                    category,
                    stock,
                    images,
                    user_email,
                    user_name,
                    contact,
                    description
                ]
            );

            res.json({
                message: "Product Added Successfully"
            });
        } catch (err) {
    res.status(500).json({
        message: err.message
    });
}
    }
);
// =========================
// APPROVE PRODUCT
// =========================

app.get("/approve/:id", async (req, res) => {

    const id = req.params.id;

    try {

        const result = await db.query(
            "SELECT * FROM pending_products WHERE product_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Product Not Found");
        }

        const product = result.rows[0];

        await db.query(
            `INSERT INTO products
            (
                product_name,
                price,
                category,
                stock,
                images,
                user_email,
                user_name,
                contact,
                description
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                product.product_name,
                product.price,
                product.category,
                product.stock,
                product.images,
                product.user_email,
                product.user_name,
                product.contact,
                product.description
            ]
        );

        await db.query(
            "DELETE FROM pending_products WHERE product_id = $1",
            [id]
        );
        res.send("Product Approved Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

// =========================
// REJECT PRODUCT
// =========================

app.get("/reject/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "DELETE FROM pending_products WHERE product_id = $1",
            [id]
        );
        res.send("Product Rejected Successfully");

    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

// =========================
// MY PRODUCTS
// =========================
app.get("/my-products/:email", async (req, res) => {

    try {
        const result = await db.query(
            "SELECT * FROM products WHERE user_email = $1 ORDER BY product_id DESC",
            [req.params.email]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }

});
// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {

    try {

        const { name, email } = req.body;

        const user = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length > 0) {
            return res.json({
                message: "Login Success"
            });
        }

        await db.query(
            "INSERT INTO users (name, email) VALUES ($1, $2)",
            [name, email]
        );

        res.json({
            message: "Account Created"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json(err.message);

    }

});

// =========================
// WISHLIST
// =========================

app.post("/wishlist", async (req, res) => {

    try {

        const { user_email, product_id } = req.body;

        const check = await db.query(
            "SELECT * FROM wishlist WHERE user_email = $1 AND product_id = $2",
            [user_email, product_id]
        );

        if (check.rows.length > 0) {
            return res.json({
                message: "Already In Wishlist"
            });
        }

        await db.query(
            "INSERT INTO wishlist (user_email, product_id) VALUES ($1, $2)",
            [user_email, product_id]
        );

        res.json({
            message: "Added To Wishlist"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json(err.message);

    }

});

app.get("/wishlist/:email", async (req, res) => {

    try {

        const result = await db.query(
            "SELECT * FROM wishlist WHERE user_email = $1",
            [req.params.email]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }

});
app.delete("/wishlist", async (req, res) => {
    try {
        const { user_email, product_id } = req.body;
        await db.query(
            "DELETE FROM wishlist WHERE user_email = $1 AND product_id = $2",
            [user_email, product_id]
        );
        res.json({
            message: "Removed From Wishlist"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

// =========================
// CART
// =========================

app.post("/cart", async (req, res) => {
    try {
        const { user_email, product_id } = req.body;
        const check = await db.query(
            "SELECT * FROM cart WHERE user_email = $1 AND product_id = $2",
            [user_email, product_id]
        );

        if (check.rows.length > 0) {
            return res.json({
                message: "Already In Cart"
            });
        }

        await db.query(
            "INSERT INTO cart (user_email, product_id) VALUES ($1, $2)",
            [user_email, product_id]
        );
        res.json({
            message: "Added To Cart"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

app.get("/cart/:email", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM cart WHERE user_email = $1",
            [req.params.email]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

app.delete("/cart", async (req, res) => {
    try {
        const { user_email, product_id } = req.body;
        await db.query(
            "DELETE FROM cart WHERE user_email = $1 AND product_id = $2",
            [user_email, product_id]
        );
        res.json({
            message: "Removed From Cart"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});
// =========================
// UPDATE PRODUCT
// =========================

app.put("/product/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const {
            price,
            contact,
            description
        } = req.body;

        await db.query(
            `UPDATE products
             SET price = $1,
                 contact = $2,
                 description = $3
             WHERE product_id = $4`,
            [
                price,
                contact,
                description,
                id
            ]
        );

        res.json({
            message: "Product Updated Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json(err.message);

    }

});

// =========================
// DELETE PRODUCT
// =========================

app.delete("/product/:id", async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(
            "DELETE FROM products WHERE product_id = $1",
            [id]
        );

        res.json({
            message: "Product Deleted Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});