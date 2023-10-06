const { MongoClient } = require('mongodb');
class DBClient{
    constructor(){
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const dbURL = `mongodb://${host}:${port}/${database}`;
        console.log(dbURL)
        
        this.mongocli = new MongoClient(dbURL, {
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

    async usersCollection(){
        return this.mongocli.db().collection('users')
    }

    async filesCollection(){
        return this.mongocli.db().collection('files')
    }
}

const dbClient = new DBClient()
module.exports = dbClient