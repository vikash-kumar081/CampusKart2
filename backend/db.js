const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "sql8.freesqldatabase.com",
    user: "sql8832828",
    password: "Y6JAvvsZB2",
    database: "sql8832828",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;