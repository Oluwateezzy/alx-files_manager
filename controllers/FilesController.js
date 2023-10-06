const dbClient = require("../utils/db")
const mongoDBCore = require('mongodb/lib/core');
const fs = require('fs');
const path = require('path');
// const {
//   mkdir, writeFile, stat, existsSync, realpath,
// } = require('fs');
const { uuidV4 } = require('mongodb/lib/core/utils');
const { v4 } = require('uuid')
const { tmpdir } = require('os');
const {promisify} = require('util')
const Queue = require('bull/lib/queue')

const fileType = ["folder", "image", "file"]
const filePath = process.env.FOLDER_PATH || '/tmp/files_manager'
const fileQueue = new Queue('thumbnail generation')


class FilesController{
    static async postUpload(req, res){
        const user = req.user
        const name = req.body ? req.body.name : null;
        const type = req.body ? req.body.type : null;
        const parentId = req.body && req.body.parentId ? req.body.parentId : 0;
        const isPublic = req.body && req.body.isPublic ? req.body.isPublic : false;
        const data = req.body && req.body.data ? req.body.data : '';
        console.log(parentId, isPublic)
        if (!name){
            res.status(400).json({error: "Missing name"})
            return
        }
        if (!type || !fileType.includes(type)){
            res.status(400).json({error: "Missing type"})
            return
        }
        if (!data &&  type !== "folder"){
            res.status(400).json({error: "Missing data"})
            return
        }
        if (parentId !== 0 && parentId !== "0"){
            const file = await (await dbClient.filesCollection()).findOne({
                 _id: new mongoDBCore.BSON.ObjectId(parentId)
            })
            console.log(file)
            if (!file){
                res.status(400).json({error: "Parent not found"})
                return
            }
            if (file.type !== "folder"){
                res.status(400).json({error: "Parent is not a folder"})
                return
            }
        }
        const userId = new mongoDBCore.BSON.ObjectId(user._id)
        const path2 = path.join(tmpdir(), filePath)
        console.log(path2)
        const newFile = {
            userId,
            name,
            type,
            isPublic,
            parentId
        }
        await fs.mkdir(path2, { recursive: true}, (err) => {
            if (err) console.log('Error creating dir')
            else console.log('directory created')
        })
        if (type !== 'folder'){
            const localPath = path.join(path2, v4())
            await fs.writeFileSync(localPath, Buffer.from(data, 'base64'))
            newFile.localPath = localPath
        }
        const insertInfo = await (await dbClient.filesCollection()).insertOne(newFile)
        const field = insertInfo.insertedId.toString()
        if (type === 'image'){
            const jobName = `Image thumbnail [${userId}-${field}]`
            fileQueue.add({userId, field, name: jobName})
        }
        res.status(201).json({
            id: field,
            userId,
            name,
            type,
            isPublic,
            parentId
        })
    }

    static async getShow(req, res){
        const user = req.user
        const {id} = req.params
        console.log(id)
        const file = await (await dbClient.filesCollection()).findOne({
            _id: new mongoDBCore.BSON.ObjectId(id),
            userId: new mongoDBCore.BSON.ObjectId(user._id)
        })
        if (!file){
            return res.status(404).json({error: 'Not found'})
        }
        res.status(200).json({
            id,
            userId: user._id,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId.toString()
        })
    }
    static async getIndex(req, res){
        const user = req.user
        const {parentId, page} = req.query
        const itemPerPage = 20
        const skip = page ? parseInt(page) * itemPerPage : 0
        const matchStage = {
            userId: user._id,
            parentId: parentId || 0
        }
        const files = await (await (await dbClient.filesCollection()).aggregate([
            {$match: matchStage},
            {$sort: { _id: -1}
            },
            {$skip: skip},
            {$limit: itemPerPage},
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    userId: '$userId',
                    name: '$name',
                    type: '$type',
                    isPublic: '$isPublic',
                    parentId: {
                        $cond: { if: { $eq: ['$parentId', '0'] }, then: 0, else: '$parentId' },
                    },
                }
            }
        ])).toArray()
        res.status(200).json(files)
    }

    static async putPublish(req, res){}
    static async putUnpublish(req, res){}
}

module.exports = FilesController