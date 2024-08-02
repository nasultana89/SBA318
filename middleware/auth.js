function auth(req,res,next){
const token = req.headers['authorization']
if (token ==='mysecrettoken'){
    next();
}else{
    res.status(403).send('Forbidden');
}
}

module.exports = auth;