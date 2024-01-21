module.exports = {
    //This prompt will help to generate 
  toCreateSqlQuery:  function (schema,question){
        return  ` Understand the user prompt properly and generate only best SQL query according to the user query no other thing except that, If ';' is not present in the generated SQL query the put ';' at the end of every SQL query.
        ------------
        SCHEMA: ${schema}
        ------------
        QUESTION: ${question}
        ------------
        SQL QUERY:`}


};
        //Generate an proper SQL query based on the user question in natural language.

    // From the answers of the SQL query this propt will generate the answer in Natural Language
//   toGenerateAnswers: function (schema,question,query,response){ 
//     return `Based on the table schema below, question, SQL query, and SQL response I want the full result of the following SQL query, just like I would get if I ran it directly in the database. 

//     Example Input 1:
//         emp_name
//         --------
//         Employee1
//         Employee2
//         Employee3
//     Example Output 1:
//         The employees who joined 7th july 2022 are :
//             Employee1, 
//             Employee2, 
//             Employee3
            

//     ------------
//     SCHEMA: ${schema}
//     ------------
//     QUESTION: ${question}
//     ------------
//     SQL QUERY: ${query}
//     ------------
//     SQL RESPONSE: ${response}
//     ------------
//     NATURAL LANGUAGE RESPONSE:
//     `}

    //Based on the table schema below, question, SQL query, and SQL response, write the answers which contains only all the relevant infornations and do not write 'many more' or 'so on' provide all the elements fetched from the database.
  /* Example Input 1:
        emp_name
        --------
        Employee1
        Employee2
        Employee3
    Example Output 1:
        The employees who joined 7th july 2022 are :
            Employee1, Employee2, Employee3 */


/*`Just answer in one word 'wrong' if the attribute mentioned in the user query is not present in database table otherwise answer will be the sql query. The attribute names can be case insensitive.

Schema--> ${schema}
QUESTION: ${question}` */
