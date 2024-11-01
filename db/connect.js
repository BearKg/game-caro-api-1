const mysql = require("mysql");
const dbconfig = require("../dbconfig");
const CustomAPIError = require("../errors/custom-api");

const conn = mysql.createConnection(dbconfig);

// conn.connect((err) => {
//   if (err) {
//     console.log(err);
//     throw new CustomAPIError("Can not connect to database!");
//   } else {
//     console.log("Connected");
//   }
// });

module.exports = conn;
