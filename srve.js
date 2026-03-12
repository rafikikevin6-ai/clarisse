const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Database connection */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kigali_innovation_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Connected to MySQL Database");
    }
});


// ================= INSERT CLIENT =================

app.post("/clients", (req, res) => {

    const { names, sex, address, phone, email } = req.body;

    const sql = "INSERT INTO clients (names, sex, address, phone, email) VALUES (?,?,?,?,?)";

    db.query(sql, [names, sex, address, phone, email], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error inserting client",
                error: err
            });
        }

        res.status(201).json({
            message: "Client created successfully",
            clientId: result.insertId
        });

    });

});


// ================= SELECT ALL CLIENTS =================

app.get("/clients", (req, res) => {

    const sql = "SELECT * FROM clients";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error retrieving clients"
            });
        }

        res.status(200).json(results);

    });

});


// ================= SELECT CLIENT BY ID =================

app.get("/clients/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM clients WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error retrieving client"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json(result[0]);

    });

});


// ================= UPDATE CLIENT =================

app.put("/clients/:id", (req, res) => {

    const id = req.params.id;

    const { names, sex, address, phone, email } = req.body;

    const sql = `
    UPDATE clients
    SET names=?, sex=?, address=?, phone=?, email=?
    WHERE id=?`;

    db.query(sql, [names, sex, address, phone, email, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error updating client"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            message: "Client updated successfully"
        });

    });

});


// ================= DELETE CLIENT =================

app.delete("/clients/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM clients WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error deleting client"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            message: "Client deleted successfully"
        });

    });

});




app.listen(3000, () => {
    console.log("Server running on port 3000");
});