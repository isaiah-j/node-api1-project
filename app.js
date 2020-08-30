const express = require('express')
const { v4: uuidv4 } = require('uuid');


const app = express()

app.use(express.json())


let users = [{ id: 1, name: 'Daniel' }, { id: 2, name: 'Isaiah' }, { id: 3, name: 'Cameron' }]


app.get('/api/users', async (req, res) => {
    try {
        res.status(200).json({
            status: 200,
            results: users.length,
            payload: {
                users
            }
        })

    } catch (error) {
        res.status(404).json({
            status: 404,
            errorMessage: "The users information could not be retrieved"
        })

    }
})



app.post('/api/users', async (req, res) => {
    const { name, bio } = req.body

    if (!name || !bio) {
        res.status(400).json({
            status: 400,
            errorMessage: "Please provide a name and bio"
        })
    }

    try {
        let user = {
            id: Date.now(),
            name: req.body.name,
            bio: req.body.bio
        }
        users.push(user)
        res.status(201).json({
            status: 201,
            payload: {
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            errorMessage: "There was an error while saving the user to the database"
        })
    }
})

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    let user = users.find(user => user.id == id)

    if (!user) {
        res.status(404).json({
            errorMessage: `Could not find user with id of ${id}`
        })
    }

    try {
        res.status(200).json({
            payload: {
                user
            }
        })
    } catch (error) {
        res.status(500).json({
            errorMessage: "Unable to retrieve user from the database"
        })
    }
})


app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    let user = users.find(user => user.id == id)

    if (!user) {
        res.status(404).json({
            errorMessage: `Couldn't find user with id of ${id}`
        })
    }

    try {
        users.forEach((user, idx) => {
            if (user.id == id) {
                users.splice(idx, 1)
                return
            }

        })
        res.status(200).json({
            payload: {
                user
            }
        })
    } catch (error) {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        })

    }
})

app.patch('/api/users/:id', (req, res) => {
    const { id } = req.params

    const { name, bio } = req.body

    if (!name || !bio) {
        res.status(400).json({
            status: 400,
            errorMessage: "Please provide a name and bio"
        })
    }

    let user = users.find(user => user.id == id)

    if (!user) {
        res.status(404).json({
            errorMessage: `Couldn't find user with id of ${id}`
        })
    }

    try {
        let updatedUser
        users = users.map(user => {
            if (user.id == id) {
                updatedUser = {
                    id: user.id,
                    name: req.body.name,
                    bio: req.body.bio
                }
                return updatedUser
            }
            return user
        })

        res.status(200).json({
            status: 200,
            payload: {
                user: updatedUser
            }
        })

    } catch (error) {
        res.status(500).json({
            errorMessage: 'Unable to update user'
        })
    }
})


module.exports = app