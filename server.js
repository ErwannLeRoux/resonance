const fs         = require('fs')
const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require('cors')
const path       = require('path')
const fileUpload = require('express-fileupload');


async function main() {
    let router = express.Router();
    let app = express()
    
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())
    app.set('view engine', 'ejs')
    app.use('/assets', express.static('public/assets'))
    app.use('/resources', express.static('resources'))
    app.use('/resonance', express.static('node_modules/resonance-audio'))
    app.use(fileUpload());


    router.get('/', (request, response) => {
        let directoryPath = path.join(__dirname, '\\resources\\audio')
        readDirectory(directoryPath).then((soundsList) => {
            response.render("index", {"sounds": soundsList})
        }).catch((err)=> {
            response.status(500).json({
                error: err
            })
        })
    });

    router.post('/upload', function(req, res) {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploadedSounds'
                });
            } else {
                let uploadedSounds = req.files.sounds;
                if(!(uploadedSounds instanceof Array)){
                    uploadedSounds = [req.files.sounds]
                }
                let uploadDirectoryPath = __dirname + '\\resources\\audio\\'   
                readDirectory(uploadDirectoryPath).then((soundsList) => {
                    let promises = []
                    for(let i = 0; i<uploadedSounds.length; i++){
                        let initialName = uploadedSounds[i].name.split('.')
                        let extension = initialName.pop()

                        let id = 1
                        
                        while(soundsList.includes(uploadedSounds[i].name)){
                            uploadedSounds[i].name = initialName +` - (${id}).` + extension
                            id = id + 1
                        }
                        promises.push(uploadedSounds[i].mv(uploadDirectoryPath + uploadedSounds[i].name))
                    }
                    Promise.all(promises)
                    .then(() => {
                        let soundAdded = []
                        uploadedSounds.forEach((sound) => {
                            soundAdded.push({
                                name : sound.name,
                            })
                        })
                        res.status(200).json({
                            status: 'success',
                            data : soundAdded
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            status: 'failure',
                            error: err
                        })
                    })
                })
            }
        }catch (err){
            res.status(500).json({
                status: 'failure',
                error: err
            })
        }
    })

    app.use('/', router)
    app.listen(8080)
}

function readDirectory(directoryPath){
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, function(err, soundsList){
            if(err){
                reject(err)
            }
            resolve(soundsList)
        })
    })
}

main()
