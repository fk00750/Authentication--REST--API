import RouteParamsHandler from "../../types/RouteParams.type";

const GenerateTokens: RouteParamsHandler = async (req, res, next) =>{
    try {
        res.send("Generate Tokens")
        console.log(req)
    } catch (error) {
        
    }
}

export default GenerateTokens