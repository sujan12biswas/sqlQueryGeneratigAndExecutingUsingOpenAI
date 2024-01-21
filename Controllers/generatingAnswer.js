require("dotenv").config();
const { DataSource } = require("typeorm");
const { SqlDatabase } = require("langchain/sql_db");
const { PromptTemplate } = require("langchain/prompts");
const { RunnableSequence } = require("langchain/schema/runnable");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { StringOutputParser } = require("langchain/schema/output_parser");

const { databaseDetails } = require("../Utilities/databaseDetails");
const { toCreateSqlQuery } = require("../Utilities/prompt");

async function generatingAnswer(req, res) {
  try {

    //Getting the payload
    const { query, tableName } = req.body;
    
    //Creating connection with the database
    const datasource = new DataSource(databaseDetails);
    //Creating the instance of the model
    const llm = new ChatOpenAI();

    // This variable now holds the connection to the SQL database
    // and can be used to perform various database operations within your LangChain application.
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      includesTables: [tableName], //Including the tables name that we want to use
    });

    //Create the first prompt template used for getting the SQL query.
    const prompt = PromptTemplate.fromTemplate(
      toCreateSqlQuery(await db.getTableInfo(), query)  //Passing schema and user query as as argument
    );

    // RunnableSequence is a LangChain tool used to define and execute a sequence of operations in an ordered manner.
    // This allows you to combine different functionalities like data retrieval, prompts, LLMs, and parsing into a single workflow.
    // sqlQueryChain: This sequence retrieves table information, processes the user's question, and generates the SQL query using a prompt and LLM.
    const sqlQueryChain = RunnableSequence.from([
      {
        schema: async () => db.getTableInfo(),
        question: (input) => input.question,
      },
      prompt,
      llm.bind({ stop: ["\nSQLResult:"] }), //This means the LLM will continue generating text until it encounters this specific string.
      new StringOutputParser(),     //The StringOutputParser() component likely extracts the SQL content following this marker for further processing.
    ]);
    //Invoking usser query into sql query chain to generate SQL query
    const querySQL = await sqlQueryChain.invoke({
      question: query,
    });
    console.log("querySQL-->", querySQL);

    //Blocking the Create, Update and Delete operation on the database
    if (
      querySQL.includes("INSERT") ||
      querySQL.includes("UPDATE") ||
      querySQL.includes("DELETE") ||
      querySQL.includes("CREATE")
    ) {
      console.log("Sorry, You can only do the read operations here");
      return res
        .status(401)
        .send("Sorry, You can only do the read operations here");
    }

    //Getting the response of the query from the database
    const databaseResponse = await db.run(querySQL);
    //Persing JSON data into array of object
    const jsonArray = JSON.parse(databaseResponse);
    console.log("jsonArray-->",typeof jsonArray,jsonArray.length);
    //Getting the length of the array
    const jsonArrayLength = jsonArray?.length;


    //Beautify the databse response
    const substringToFind = "},";
    const resultArray = databaseResponse.split(substringToFind);    // Split the input string based on the substring
    // Join the array elements with a newline after each element
    const formattedString = resultArray.join("}\n");
    // console.log(formattedString);

    return res.status(200).send({Response : formattedString , count : jsonArrayLength});
    
  } catch (error) {
    //If The table is not there in the database
    if (error.message.includes("Include tables not found in database")) {
      console.log(
        "The table name is not availabe in the database please provide the correct Table name."
      );
      return res
        .status(400)
        .send(
          "The table name is not availabe in the database please provide the correct Table name."
        );
    }
    if (error.message.includes("ER_NO_SUCH_TABLE")) {
      console.log(
        "Your query couldn't create any SQL query. Please ask a query according to the database table."
      );
      return res
      .status(400)
      .send(
        "Your query couldn't create any SQL query. Please ask a query according to the database table."
      );
    }
    console.log("error-->", error);

    //If the token limlit of the model is exceeded
    if (error?.code == "context_length_exceeded") {
      console.log("88888");
      console.log("error-->", error?.message);
      return res.status(400).send(error.message);
    }

    //Sending respose of database connection error
    return res
      .status(400)
      .send(
        "Errors occus while connecting with the database"
      );
  }
}

module.exports.generatingAnswer = generatingAnswer;
