'use strict'
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')

router.get('/', async (ctx,next) => {
    ctx.body = "Hello World"
    await next()
})

router.get('/api', (ctx, next) => {
    ctx.body = {
        message: 'Welcome to the API'
    }
    next()

})

router.post('/api/posts', verifyToken, async  (ctx, next) => {
    // console.log('ctx.request.token', ctx.request.token)
    await jwt.verify(ctx.request.token, 'secretkey', (err, authData) => {
        if(err) {
            ctx.status = 403
            ctx.body = err
            console.error(err)
        }
        else {
            ctx.body = {
                message: 'Post created...',
                authData
            }
        }
    })
    await next()
})

router.post('/api/login', async (ctx, next) => {
    //TODO: Mock user
    const user = {
        id: 1,
        username: 'anu',
        email: 'anu@gmail.com'
    }
    await jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token)=> {
        ctx.body = {
            token
        }
    })
    await next()

})

// FROMAT OF TOKEN
// Authorization: Bearer <access_token>

/**
 * Verify Token
 * FROMAT OF TOKEN
 * Authorization: Bearer <access_token>
 * @param {*} ctx 
 * @param {*} next 
 * 
 */
async function verifyToken(ctx, next) {
    //TODO: Get auth header value
    const bearerHeader = ctx.headers['authorization']
    console.log("bearerHeader: ", bearerHeader)
    //TODO: Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        //TODO: Split at the space
        const bearer = bearerHeader.split(' ')
        //TODO: Get token from array
        const bearerToken = bearer[1]
        //TODO: Set the token
        ctx.request.token = bearerToken
        console.log(ctx.request.token)
    } else {
        //TODO: Fordidden
        ctx.status = 403

    }
    await next()
}


app.use(router.routes())
app.listen(3000, () => {
    console.log('server start on port 3000')
})