const {v4} = require('uuid')
const redisClient = require("../utils/redis")

class AuthController {
    static async getConnect(req, res){
        const user = req.user
        const token = v4()
        await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60)
        res.status(200).json({token})
    }
    static async getDisconnect(req, res){
        
    }
}
module.exports = AuthController