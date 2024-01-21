// require("dotenv").config();
// const { DataSource } = require("typeorm");
// const { SqlDatabase } = require("langchain/sql_db");
// const { PromptTemplate } = require("langchain/prompts");
// const { RunnableSequence } = require("langchain/schema/runnable");
// const { ChatOpenAI } = require("langchain/chat_models/openai");
// const { StringOutputParser } = require("langchain/schema/output_parser");

// const { databaseDetails } = require("../Utilities/databaseDetails");
// const { toCreateSqlQuery, toGenerateAnswers } = require("../Utilities/prompt");

// async function generatingAnswer(req, res) {
//   try {
//     //Getting the payload
//     const { query, tableName } = req.body;
//     //Creating connection with the database
//     const datasource = new DataSource(databaseDetails);

//     datasource
//       .initialize()
//       .then(() => {
//         console.log("Data Source has been initialized");
//       })
//       .catch((error) => {
//         console.log("Error during data source initialization", "error:", error);
//       });

//     const llm = new ChatOpenAI();
//     // This variable now holds the connection to the SQL database
//     // and can be used to perform various database operations within your LangChain application.
//     const db = await SqlDatabase.fromDataSourceParams({
//       appDataSource: datasource,
//       includesTables: [tableName], //Including the tables name that we want to use
//     });
//     console.log("Hi...");

//     //Create the first prompt template used for getting the SQL query.
//     const prompt = PromptTemplate.fromTemplate(
//       toCreateSqlQuery(await db.getTableInfo(), query)
//     );
//     // console.log("Schema-->",await db.getTableInfo())
//     // console.log("Prompt-->",prompt)

//     // RunnableSequence is a LangChain tool used to define and execute a sequence of operations in an ordered manner.
//     // This allows you to combine different functionalities like data retrieval, prompts, LLMs, and parsing into a single workflow.
//     // sqlQueryChain: This sequence retrieves table information, processes the user's question, and generates the SQL query using a prompt and LLM.
//     const sqlQueryChain = RunnableSequence.from([
//       {
//         schema: async () => db.getTableInfo(),
//         question: (input) => input.question,
//       },
//       prompt,
//       llm.bind({ stop: ["\nSQLResult:"] }), //This means the LLM will continue generating text until it encounters this specific string.
//       new StringOutputParser(),
//     ]);

//     const querySQL = await sqlQueryChain.invoke({
//       question: query,
//     });
//     console.log("querySQL-->", querySQL);

//     //Blocking the Create, Update and Delete operation on the database
//     if (
//       querySQL.includes("INSERT") ||
//       querySQL.includes("UPDATE") ||
//       querySQL.includes("DELETE") ||
//       querySQL.includes("CREATE")
//     ) {
//       console.log("Sorry, You can only do the read operations here");
//       return res
//         .status(401)
//         .send("Sorry, You can only do the read operations here");
//     }

//     //Getting the final prompt which generate the answer from the SQL query
//     const finalResponsePrompt = PromptTemplate.fromTemplate(
//       toGenerateAnswers(
//         await db.getTableInfo(),
//         query,
//         querySQL,
//         await db.run(querySQL)
//       )
//     );
//     // console.log("finalResponsePrompt-->",finalResponsePrompt)
//     //Getting the response of the query from the database
//     const databaseResponse = await db.run(querySQL);
//     console.log("Response---->", typeof databaseResponse);
//     const substringToFind = "},";
//     // Split the input string based on the substring
//     const resultArray = databaseResponse.split(substringToFind);
//     // Join the array elements with a newline after each element
//     const formattedString = resultArray.join("}\n");
//     // console.log(formattedString);

//     return res.send(JSON.stringify(formattedString, null, 2));
//     //finalChain: This sequence uses the output from sqlQueryChain (question and SQL query),retrieves table information again,
//     //executes the SQL query, and generates a natural language response using another prompt and LLM.
//     const finalChain = RunnableSequence.from([
//       {
//         question: (input) => input.question,
//         query: sqlQueryChain,
//       },
//       {
//         schema: async () => db.getTableInfo(),
//         question: (input) => input.question,
//         query: (input) => input.query,
//         response: (input) => db.run(input.query),
//       },
//       finalResponsePrompt,
//       llm,
//       new StringOutputParser(),
//     ]);
//     // console.log("Final Chain-->",finalChain);
//     const finalResponse = await finalChain.invoke({
//       question: query,
//     });

//     console.log({ finalResponse });
//     return res.status(200).send(finalResponse);
//   } catch (error) {
//     //If The table is not there in the database
//     if (error.message.includes("Include tables not found in database")) {
//       console.log(
//         "The table name is not availabe in the database please provide the correct Table name."
//       );
//       return res
//         .status(400)
//         .send(
//           "The table name is not availabe in the database please provide the correct Table name."
//         );
//     }
//     console.log("error-->", error);

//     //If the token limlit of the model is exceeded
//     if (error?.code == "context_length_exceeded") {
//       console.log("88888");
//       console.log("error-->", error?.message);
//       return res.status(400).send(error.message);
//     }

//     return res
//       .status(400)
//       .send(
//         "Your query couldn't create any SQL query. Please write ask right information according to the database table."
//       );
//   }
// }

// module.exports.generatingAnswer = generatingAnswer;
