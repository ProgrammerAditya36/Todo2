const jwt = require('jsonwebtoken');
const secret = require('../config');
function userMiddleware(req,res,next){
    const token = req.headers.authorization;
    const words = token.split(' ');
    const tokenValue = words[1];
    try{
        const decoded = jwt.verify(tokenValue,secret);
        if(decoded.username){
            next();
        }
        else{
            res.status(401).send('Unauthorized');
        }
    }
    catch(err){
        res.status(401).send('Unauthorized');
    }

}
module.exports = userMiddleware;