async function checkingReqBody(req,res,next){
    try {
        //Getting the payload 
        const {query,tableName} = req.body;

        //if query and tableName is not present in the payload
        if(!query || !tableName){
            console.log("Please provide the query or table name");
            return res.status(400).send("Please provide the query or table name"); 
        }      
        next();
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.checkingReqBody = checkingReqBody;