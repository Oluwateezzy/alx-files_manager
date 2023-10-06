const Bull = require('bull')
const thumb = require('image-thumbnail')
const dbClient = require('./utils/db')
const mongoDBCore = require('mongodb/lib/core');
const fs = require('fs')


const fileQueue = new Bull('fileQueue', {
    redis: {
        host: 'localhost',
        port: 6379
    }
})
fileQueue.process(async (job) => {
    const {field, userId} = job.data
    if (!field) throw new Error('Missing fileId')
    if (!userId) throw new Error('Missing userId')

    const file = await (await dbClient.filesCollection()).findOne({
        _id: new mongoDBCore.BSON.ObjectId(field),
        userId: new mongoDBCore.BSON.ObjectId(userId)
    })
    if (!file) throw new Error('File not found')
    const sizes = [500, 250, 100]
    const thumbPromises = sizes.map(async (size) => {
        const thumbnail = await thumb(file.localPath, {width: size})
        const fileNameThumb = `${file.localPath}_${size}`
        await fs.promises.writeFile(thumbnail, fileNameThumb)
    })
    await Promise,all(thumbPromises)
})