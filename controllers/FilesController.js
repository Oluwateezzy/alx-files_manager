const dbClient = require("../utils/db")
const mongoDBCore = require('mongodb/lib/core');
const fs = require('fs');
const path = require('path');

const fileType = ["folder", "image", "file"]
const filePath = process.env.FOLDER_PATH || '/tmp/files_manager'

class FilesController{
    static async postUpload(req, res){
        const user = req.user
        const {name, type, parentId, isPublic, data} = req.body
        console.log(name, type, parentId, isPublic, data)
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
        // if (parentId !== 0 && parentId !== "0"){
        //     const file = await (await dbClient.filesCollection()).findOne({
        //          _id: new mongoDBCore.BSON.ObjectId(parentId)
        //     })
        //     console.log(file)
        //     if (!file){
        //         res.status(400).json({error: "Parent not found"})
        //         return
        //     }
        //     if (!fileType.includes(file.type)){
        //         res.status(400).json({error: "Parent is not a folder"})
        //         return
        //     }
        // }
        const userId = user._id.toString()
        const path2 = path.join(filePath, name)
        console.log(path2, userId)
        
        res.status(201).send()
    }
}

module.exports = FilesController