require("dotenv").config({ path: "../.env" });

module.exports = {
  databaseDetails: {
    // type: 'mssql',
    // server: 'sujansqltest.database.windows.net',
    // port : 1433,
    // database: 'sqlTesting',
    // // authentication: {
    // //     type: 'azure-active-directory-default'
    // // },
    // options: {
    //     encrypt: true
    // }
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.SQL_PASSWORD,
    database: "employee_details",
  },
};






// databaseDetails: {
//   // user: "sujan12biswas",
//   password: "Sb12081999@",
//   server: "(localdb)\local",
//   database: "langChainSQL",
//   port: 1433, // Default MSSQL port
//   options: {
//     encrypt: true, // Enable encryption (recommended for security)
//   },
// },
