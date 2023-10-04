const dbClient = require("../utils/db")
const sha1 = require('sha1')

export async function authenticate(req, res, next){
    const auth_header = req.headers.authorization
    if (!auth_header){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const auth_token = auth_header.split(' ')[1]
    if (!auth_token){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = Buffer.from(auth_token, 'base64').toString()
    console.log(token)
    const sep = token.indexOf(':')
    const email = token.substring(0, sep)
    const password = token.substring(sep + 1)
    const user = await (await dbClient.usersCollection()).findOne({email})
    if (!user || sha1(password) !== user.password){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    req.user = user
    console.log(user)
    next()
}