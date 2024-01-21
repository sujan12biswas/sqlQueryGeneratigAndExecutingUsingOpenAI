const express = require('express');

const langChainSQLRoute = require('./Routes/langChainSQLRoute');


const app = express();
const port = 3005;



// Middleware to parse JSON in the request body
app.use(express.json());
// Middleware to parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));

//Creating an endPoint
app.use('/',langChainSQLRoute);





//Listening the port
app.listen(port,()=>{
    console.log(`The server is listening on port ${port}`);
})
