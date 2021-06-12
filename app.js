// @ts-check
const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const app = express()
const validator = require('validator').default;
const cors = require('cors')
const { createToken, verifyToken, createPasswordHash, comparePassword } = require('./auth-service')
const path = require('path')

const port = process.env.PORT || 3000

const sequelize = new Sequelize('xgzi1skwph8r0m1r', 'fcro6mxjlpctfyiq	', 'm5swpf29c63798d4', {
    host: 'd3y0lbg7abxmbuoi.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    dialect: 'mysql'
});

class Application extends Model { }
class Admin extends Model { }

function stringType() {
    return {
        type: DataTypes.STRING,
        allowNull: false
    }
}

Application.init({
    fio: stringType(),
    phone: stringType(),
    country: stringType(),
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    modelName: 'Application',
    sequelize
})

Admin.init({
    name: stringType(),
    password: stringType(),
}, {
    modelName: 'Admin',
    sequelize
})

start()

async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Successful db connection');
        startApp()
    } catch (error) {
        console.error(error)
    }
}

function startApp() {
    app.use(cors())
    app.use(express.json())

    // app.get('/', function (req, res) {
    //     res.send('Hello from express')
    // })

    app.post('/api/admin', async function (req, res) {
        const passwordHash = createPasswordHash(req.body.password)
        const newAdmin = await Admin.create({
            name: req.body.name,
            password: passwordHash
        })
        res.send(newAdmin)
    })

    app.post('/api/login', async function (req, res) {
        const userFromDB = await Admin.findOne({ where: { name: req.body.name } })
                // @ts-ignore
        if (comparePassword(req.body.password, userFromDB.password)) {
            const token = createToken(userFromDB)
            res.send({
                token
            })
        } else {
            res.status(403).send({
                message: 'Wrong password'
            })
        }
    })

    app.get('/api/application', verifyToken, async function (req, res) {
        const orders = await Application.findAll()
        res.send(orders)
    })

    app.post('/api/application', async function (req, res) {
        const applicationInfo = req.body
        let validationError = []
        if (!validator.isMobilePhone(applicationInfo.phone.replace(/\D/g, ''), ['ru-RU']))
            validationError.push('Wrong phone number')
        if (!validator.isLength(applicationInfo.fio, { min: 4, max: 80 }))
            validationError.push('Wrong fio')
        if (!validator.isIn(applicationInfo.country, ['Russia', 'Ukraine', 'Belarus']))
            validationError.push('Wrong country')
        if (!validator.isLength(applicationInfo.address, { min: 0, max: 2000 }))
            validationError.push('Wrong address')

        if (validationError.length) {
            res.status(400).send({ messages: validationError })
        } else {
            const applicationFromDB = await Application.create(applicationInfo)
            res.send(applicationFromDB)
        }
    })

    app.use(express.static(path.join(__dirname, 'public')))

    app.listen(port, function () {
        console.log('Server started at http://localhost:' + port);
    })
}