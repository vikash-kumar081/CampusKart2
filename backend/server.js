const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const app = express();
const fs = require("fs");


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
    cloudinary: cloudinary,
    params: {
        folder: "campuskart",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            {
                width: 1200,
                crop: "limit",
                quality: "auto"
            }
        ]
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.get("/pending-products", (req, res) => {

    const sql = "SELECT * FROM pending_products";

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.post(
    "/add-product",
   upload.array("images", 5),
    (req, res) => {

        const product_name =
        req.body.product_name;

        const price =
        req.body.price;
     const category = req.body.category;
        const user_email =
req.body.user_email;
const contact = req.body.contact;
const description = req.body.description;
const user_name = req.body.user_name;

        const stock = 1;

const images =
req.files.length > 0
? req.files.map(
file => file.path
).join(",")
: null;

       const sql =
`INSERT INTO pending_products
(product_name, price, category,
stock, images,
user_email, user_name,
contact, description)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
            sql,
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
],
            (err) => {

                if(err){
                    console.log(err);
                    return res.status(500).json(err);
                }

                res.json({
                    message:
                    "Product Added Successfully"
                });

            }
        );

    }
);
app.get("/approve/:id", (req, res) => {

    const id = req.params.id;

    const getSql =
    "SELECT * FROM pending_products WHERE product_id = ?";

    db.query(getSql, [id], (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        if(result.length === 0){
            return res.send("Product Not Found");
        }

        const product = result[0];

  const insertSql = `
INSERT INTO products
(product_name, price, category, stock, images,
 user_email, user_name,
 contact, description)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
        db.query(
            insertSql,
            [
    product.product_name,
    product.price,
    product.category,
    product.stock,
    product.images,
    product.user_email,
     product.user_name,
    product.contact,
    product.description,
   
],
            (err) => {

                if(err){
                    return res.status(500).json(err);
                }
                const deleteSql =
                "DELETE FROM pending_products WHERE product_id = ?";
                db.query(deleteSql, [id], (err) => {
                    if(err){
                        return res.status(500).json(err);
                    }
                    res.send("Product Approved Successfully");
                });
            }
        );
    });
});
app.get("/reject/:id", (req, res) => {
    const id = req.params.id;
    const sql =
    "DELETE FROM pending_products WHERE product_id = ?";
    db.query(sql, [id], (err) => {
        if(err){
            return res.status(500).json(err);
        }
        res.send("Product Rejected Successfully");
    });
});
app.get("/my-products/:email", (req, res) => {

    const email = req.params.email;

    const sql =
    "SELECT * FROM products WHERE user_email = ?";

    db.query(sql, [email], (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.post("/login", (req, res) => {

    const { name, email } = req.body;

    const checkUser =
    "SELECT * FROM users WHERE email = ?";

    db.query(checkUser, [email], (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        if(result.length > 0){

            return res.json({
                message: "Login Success"
            });

        }

        const insertUser =
        "INSERT INTO users (name, email) VALUES (?, ?)";

        db.query(
            insertUser,
            [name, email],
            (err) => {

                if(err){
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Account Created"
                });

            }
        );

    });

});
app.post("/wishlist", (req, res) => {

    const { user_email, product_id } = req.body;

    const checkSql =
    "SELECT * FROM wishlist WHERE user_email = ? AND product_id = ?";

    db.query(
        checkSql,
        [user_email, product_id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            if(result.length > 0){

                return res.json({
                    message: "Already In Wishlist"
                });

            }

            const sql =
            "INSERT INTO wishlist (user_email, product_id) VALUES (?, ?)";

            db.query(
                sql,
                [user_email, product_id],
                (err) => {

                    if(err){
                        return res.status(500).json(err);
                    }

                    res.json({
                        message: "Added To Wishlist"
                    });

                }
            );

        }
    );

});
app.get("/wishlist/:email", (req, res) => {

    const email = req.params.email;

    const sql =
    "SELECT * FROM wishlist WHERE user_email = ?";

    db.query(sql, [email], (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.delete("/wishlist", (req, res) => {

    const { user_email, product_id } = req.body;

    const sql =
    "DELETE FROM wishlist WHERE user_email = ? AND product_id = ?";

    db.query(
        sql,
        [user_email, product_id],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Removed From Wishlist"
            });

        }
    );

});
app.post("/cart", (req, res) => {

    const { user_email, product_id } = req.body;

    const checkSql =
    "SELECT * FROM cart_items WHERE user_email = ? AND product_id = ?";

    db.query(
        checkSql,
        [user_email, product_id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            if(result.length > 0){

                return res.json({
                    message: "Already In Cart"
                });

            }

            const sql =
            "INSERT INTO cart_items (user_email, product_id) VALUES (?, ?)";

            db.query(
                sql,
                [user_email, product_id],
                (err) => {

                    if(err){
                        return res.status(500).json(err);
                    }

                    res.json({
                        message: "Added To Cart"
                    });

                }
            );

        }
    );

});
app.delete("/cart", (req, res) => {

    const { user_email, product_id } = req.body;

    const sql =
    "DELETE FROM cart_items WHERE user_email = ? AND product_id = ?";

    db.query(
        sql,
        [user_email, product_id],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Removed From Cart"
            });

        }
    );

});
app.get("/cart/:email", (req, res) => {

    const email = req.params.email;

    const sql =
    "SELECT * FROM cart_items WHERE user_email = ?";

    db.query(sql, [email], (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.put("/product/:id", (req, res) => {

    const id = req.params.id;

    const {
        price,
        contact,
        description
    } = req.body;

    const sql = `
    UPDATE products
    SET price = ?,
        contact = ?,
        description = ?
    WHERE product_id = ?
    `;

    db.query(
        sql,
        [
            price,
            contact,
            description,
            id
        ],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:
                "Product Updated Successfully"
            });

        }
    );

});
app.delete("/product/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM products WHERE product_id = ?";

    db.query(sql, [id], (err) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json({
            message: "Product Deleted Successfully"
        });

    });

});