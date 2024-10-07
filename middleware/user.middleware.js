import jwt from 'jsonwebtoken'

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    //console.log("token is" , token);
    const word = token.split(" ");
    //console.log(word);
    const jwtToken = word[1];
    //console.log(jwtToken);
    const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (decodedValue.username) {
        req.userId = decodedValue.id
        next();
    }
    else {
        res.status(403).json({
            msg: "you are not authenticated"
        })
    }
}
export default userMiddleware;