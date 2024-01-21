# API for fetching data from SQL database using LangChain OpenAI (NodeJS)


The Project is for getting responses from SQL database using natural language query. User will give the query and the table name from where data will be fetched. Then user will get the response as the data which is fatched from the database.

## Steps -
- Server is created using Express framework and It's running on port 3005 locally
- In **Routes** folder we are created a route '/find_data'
- In **Middlewares** folder, we are getting the user query and table name provided by the user and validating those.
- In **Controllers** folder, firstly we are creating the **SQL query** using LangChain and user query then getting the response and count of the response object from the database according to the SQL query.
- The response will be shown to the the user. We gave validation for user only can do **READ operations**, means user can do CREATE, DELETE and UPDATE operations and handled all the errors.

## How to run the code
- To run the code take a git pull of the code or download the zip file. 
- Then in terminal do **npm i** , it will install all the depandences those will required to run the project.
- Then in **.env** file, you have to give your OpenAI credentials and In **databaseDetails.js** of **Utilities** folder you have to give your SQL database credentials.
- Then do **node index.js** in terminal to run the code. 
- Now using API URL: http://localhost:3005/find_data take a post request where in JSON body give { query : your_query , tableName : your_database_table_name }
- In response you will get the data that is fetch from the database and count of the response object.