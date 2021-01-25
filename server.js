
const fs         = require('fs')
const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require('cors')
const path       = require('path')


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

    router.get('/', (request, response) => {
        response.render("index")
    });

    app.use('/', router)
    app.listen(8080)
}

main()
