// index.js

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// This should already be declared in your API file

// ADD THIS
const cors = require("cors");
app.use(cors());
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.use(express.json());
app.use(bodyParser.json());

// let users = [];

const secretKey = "your-secret-key";

// Signup route
app.post("/signup", (req, res) => {
  let { email, password, role } = req.body;
  if (!role) {
    role = "user";
  }

  db.query(`select * from users where email = "${email}"`, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      return res.status(400).send("user already exist");
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Save user to "database"
    db.query(
      `Insert into users (email, password, role) Values ("${email}", "${hashedPassword}", "${role}")`,
      (err, result) => {
        // Generate a JWT token
        if (err) {
          return res.status(500).send(err);
        }
        console.log(result);
        const token = jwt.sign(
          { id: result.insertedId, role: role },
          secretKey,
          {
            expiresIn: "1h",
          }
        );

        res.status(201).json({ message: "User created successfully", token });
      }
    );
  });
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(`select * from users where email = "${email}"`, (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    if (result.length == 0) {
      return res.status(400).send("user name not found");
    }
    const isValidPassword = bcrypt.compareSync(password, result[0].password);
    if (!isValidPassword) return res.status(401).send("Invalid password");

    // Create a JWT token
    const token = jwt.sign(
      { id: result[0].id, role: result[0].role },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Bearer header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // console.log(token);
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    // Token is valid and not expired
    req.user = decoded; // Attach user info to request object
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/areacode", verifyToken, (req, res) => {
  db.query(
    "SELECT Area, AreaName, COUNT(DR_NO) as crime_num FROM Cases c NATURAL JOIN Area a GROUP BY Area ORDER BY crime_num DESC LIMIT 5;",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    }
  );
});

app.get("/cases/:AreaCode", verifyToken, (req, res) => {
  const { AreaCode } = req.params;

  db.query(
    "SELECT ca.DR_NO, ca.DateReported, ca.Location, cr.CrmCdDesc FROM cases ca join crime cr on ca.CrmCd = cr.CrmCd WHERE ca.Area=" +
      AreaCode +
      " ORDER BY DR_NO DESC LIMIT 5;",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    }
  );
});

function insertCase(caseData, callback) {
  const query = `
      INSERT INTO cases (DR_NO, DateReported, DateOccurred, TimeOccurred, CrmCd, VictAge, VictSex, VictDescent, StatusCd, WeaponUsedCd, Area, PremisCd, Location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const values = [
    caseData.DR_NO,
    caseData.DateReported,
    caseData.DateOccurred,
    caseData.TimeOccurred,
    caseData.CrmCd,
    caseData.VictAge,
    caseData.VictSex,
    caseData.VictDescent,
    caseData.StatusCd,
    caseData.WeaponUsedCd,
    caseData.Area,
    caseData.PremisCd,
    caseData.Location,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// Route to insert a new case
app.post("/cases", verifyToken, (req, res) => {
  const caseData = req.body;

  insertCase(caseData, (error, response) => {
    if (error) {
      res.json({ success: false, response: error });
    } else {
      res.json({ success: true, response });
    }
  });
});

function deleteCase(DR_NO, callback) {
  const query = "DELETE FROM cases WHERE DR_NO = ?";
  db.query(query, [DR_NO], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// Route to delete a case
app.delete("/cases/:DR_NO", verifyToken, (req, res) => {
  const DR_NO = req.params.DR_NO;

  deleteCase(DR_NO, (error, response) => {
    if (error) {
      res.json({ success: false, response: error });
    } else {
      res.json({ success: true, response });
    }
  });
});

function getCase(DR_NO, callback) {
  const query = "select * FROM cases WHERE DR_NO = ?";
  db.query(query, [DR_NO], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}
// Route to get a case
app.get("/case/:DR_NO", verifyToken, (req, res) => {
  const DR_NO = req.params.DR_NO;

  getCase(DR_NO, (error, response) => {
    if (error) {
      res.json({ success: false, response: error });
    } else {
      res.json({ success: true, response: response[0] });
    }
  });
});

// Helper function to update a case in the database
function updateCase(caseData, DR_NO, callback) {
  const query = `
      UPDATE cases
      SET DateReported = ?, DateOccurred = ?, TimeOccurred = ?, CrmCd = ?, VictAge = ?, VictSex = ?, VictDescent = ?, StatusCd = ?, WeaponUsedCd = ?, Area = ?, PremisCd = ?, Location = ?
      WHERE DR_NO = ?
    `;
  const values = [
    caseData.DateReported,
    caseData.DateOccurred,
    caseData.TimeOccurred,
    caseData.CrmCd,
    caseData.VictAge,
    caseData.VictSex,
    caseData.VictDescent,
    caseData.StatusCd,
    caseData.WeaponUsedCd,
    caseData.Area,
    caseData.PremisCd,
    caseData.Location,
    DR_NO,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// Route to update a case
app.put("/cases/:DR_NO", verifyToken, (req, res) => {
  const DR_NO = req.params.DR_NO;
  const caseData = req.body;

  updateCase(caseData, DR_NO, (error, response) => {
    if (error) {
      res.json({ success: false, response: error });
    } else {
      res.json({ success: true, response });
    }
  });
});

app.get("/crime", verifyToken, (req, res) => {
  db.query("SELECT * from crime", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});
app.get("/premis", verifyToken, (req, res) => {
  db.query("SELECT * from premis", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});
app.get("/area", verifyToken, (req, res) => {
  db.query("SELECT * from area", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});
app.get("/status", verifyToken, (req, res) => {
  db.query("SELECT * from status", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});
app.get("/weapon", verifyToken, (req, res) => {
  db.query("SELECT * from weapon", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});
// app.post("/api/users", (req, res) => {
//   const newUser = req.body;
//   db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.status(201).json({ id: result.insertId, ...newUser });
//   });
// });

function getChartData(year, callback) {
  const query = `SELECT 
    MONTH(STR_TO_DATE(SUBSTRING_INDEX(DateOccurred, ' ', 1), '%m/%d/%Y')) AS Month,
    COUNT(*) AS Count
FROM 
    cases
WHERE 
    YEAR(STR_TO_DATE(SUBSTRING_INDEX(DateOccurred, ' ', 1), '%m/%d/%Y')) = ?
GROUP BY 
    MONTH(STR_TO_DATE(SUBSTRING_INDEX(DateOccurred, ' ', 1), '%m/%d/%Y'))
ORDER BY 
    Month;`;
  db.query(query, [year], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}
// Route to update a case
app.get("/chartdata/:year", verifyToken, (req, res) => {
  const year = req.params.year;
  getChartData(year, (error, response) => {
    if (error) {
      res.json({ success: false, response: error });
    } else {
      res.json({ success: true, response });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
