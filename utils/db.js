const { MongoClient } = require('mongodb');
class DBClient{
    constructor(){
        const host = process.env.DB_HOST || 'localhost'
        const port = process.env.DB_PORT || 27017
        const name = process.env.DB_DATABASE || 'files_manager'
        const url = `mongodb://${host}:${port}/${name}`
        this.mongocli = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.mongocli.connect((err) => {
            if (err) {
                console.error('Error connecting to MongoDB:', err);
            } else {
                console.log('Connected to MongoDB');
            }
        })
    }

    isAlive(){
        return this.mongocli.isConnected()
    }

    async nbUsers(){
        const userCollection = this.mongocli.db().collection('users')
        const count = await userCollection.countDocuments()
        return count
    }

    async nbFiles(){
        const filesCollection = this.mongocli.db().collection('files')
        const count = await filesCollection.countDocuments()
        return count
    }
}

const dbClient = new DBClient()
module.exports = dbClient