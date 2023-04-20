const jwt = require('jsonwebtoken');

const authorize = async (req,res,next) => {

    const authHeader = req.headers.authorization;


    if (!authHeader){
        return res.status(401).json({msg : "No authorization token present"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const tokenInfo = jwt.verify(token,process.env.SECRET_KEY);

        const {userID,userName} = tokenInfo;

        req.user = {userID,userName};
        next();
    }
    catch (error){
        return res.status(401).json({msg : 'Unauthorized access'});
    }
}

module.exports = authorize;