import express from 'express'
import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import cors from 'cors'
import morgan from 'morgan'
const prisma = new PrismaClient()

const app = express()

// cors
app.use(cors())
// logging
app.use(morgan('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (req, res) => {
    res.json({
        message: "Hi Welcome  😎..."
    })
})

app.get('/all-user', asyncHandler(async (req, res) => {
    res.json(await prisma.user.findMany())
}))

app.get('/user/:id', asyncHandler(async (req, res) => {
    res.json(await prisma.user.findUnique({
        where: {
            id: req.params.id
        },
        include: {
            UserPreference: true,
            FavoritePost: true,
            WrittenPost: true
        }
    }))
}))

app.post('/create-user', asyncHandler(async (req, res) => {
    req.body.dob = new Date(req.body.dob)
    const { emailUpdate, ...newUser } = req.body
    res.json(await prisma.user.create({
        data: {
            ...newUser,
            FavoritePost: {
                create: {
                    content: "new content",
                    rating: 0,
                    title: "title",
                    athorId: "99a7ffa3-c25d-4563-a171-789027805b06",
                    categories: {
                        create: [{
                            name: "category 1"
                        }, {
                            name: "category 2"
                        }]
                    },
                }
            },
            UserPreference: emailUpdate ? {
                create: {
                    emailUpdates: true,

                }
            } : undefined
        },

    }))
}))

app.post('/delete-user', asyncHandler(async (req, res) => {
    res.json(await prisma.user.delete({
        where: {
            id: req.body.userId
        }
    }))
}))

app.get('/all-categories', asyncHandler(async (req, res) => {
    res.json(await prisma.category.findMany({
        // include: {
        //     // posts: true
        // }
    }))
}))



prisma.post.update({
    where: {
        id: "8a53688d-8aae-4e60-abf8-b37fc399f965"
    },
    data: {
        categories: {
            // delete: {
            //     id: "ab4e5223-0201-4c03-8aea-a7876e54c0ca"
            // }
            delete: {
                id: "e2bbd304-dd02-4374-b16a-c851e17b1441"
            }
        }
    }
})
    .then(console.log)
    .catch(console.log)
app.post('/create-category', asyncHandler(async (req, res) => {
    res.json(await prisma.category.create({
        data: {
            name: "category - " + Date.now()
        }
    }))
}))

app.post('/create-post', asyncHandler(async (req, res) => {
    const PostCount = await prisma.post.count() + 1
    res.json(await prisma.post.create({
        data: {
            content: "content " + PostCount,
            rating: 0,
            title: 'Title ' + PostCount,
            athorId: "99a7ffa3-c25d-4563-a171-789027805b06",
            categories: {
                create: [
                    { name: "Category post " + PostCount },
                    { name: "Category post2 " + PostCount },
                ]
            }
        }
    }))
}))

app.get('/all-posts', asyncHandler(async (req, res) => {
    res.json(await prisma.post.findMany({
        include: {
            categories: true
        }
    }))
}))

app.listen(4300, () => {
    console.log('server is up on port 4300')
})
