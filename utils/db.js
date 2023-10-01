const { MongoClient } = require('mongodb');
class DBClient{
    constructor(){
        const host = process.env.DB_HOST || '127.0.0.1';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const dbURL = `mongodb://${host}:${port}`;
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
}

const dbClient = new DBClient()
// module.exports = dbClient
const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject()
                }
                else if(!dbClient.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve()
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
    console.log(dbClient.isAlive());
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
})();