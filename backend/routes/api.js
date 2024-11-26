const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Project = require('../models/Project');
const Like = require('../models/Like');
const { NotFoundError, InvalidCredentialsError } = require('../utils/errors');
const checkProjectCreator = require('../middleware/checkProjectCreator');
const bcrypt = require('bcrypt');

const router = express.Router();


router.post('/RegisterUser', async (req, res) => {
    const { name, email, password, role = 'user', location } = req.body;

    const validRoles = ['project_creator', 'user'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        const newUser = await User.create({ name, email, password, role, location });
        res.status(201).json({ data: newUser, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});

router.post('/LoginUser', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        res.status(200).json({ message: 'Login successful', data: user });
    } catch (err) {
        console.error(err);
        if (err instanceof NotFoundError) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (err instanceof InvalidCredentialsError) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});


router.post('/RegisterProject', checkProjectCreator, async (req, res) => {
    const { title, description, location } = req.body;
    const { id } = req.user;

    Project.create({ title, description, user_id: id, location }, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ data: result, message: 'Project registered successfully' });
    });
});


router.get('/projects', (req, res) => {
    const searchTerm = req.query.search;
    if (searchTerm) {
        Project.search(searchTerm, (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ data: results });
        });
    } else {
        Project.findAll((err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ data: results });
        });
    }
});


router.get('/users', (req, res) => {
    User.findAll().then(results => {
        res.json(results);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'An unexpected error occurred' });
    });
});


router.post('/respond', (req, res) => {
    const { email, projectId } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword'
        }
    });

    const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Response to Project',
        text: `You have received a response for project ID: ${projectId}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

router.post('/like', (req, res) => {
    const { user_id, project_id } = req.body;
    console.log(user_id, project_id, "body", req.body)
    Like.addLike({ user_id, project_id }, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Project liked successfully' });
    });
});


router.delete('/like', (req, res) => {
    const { user_id, project_id } = req.body;
    console.log(user_id, project_id, "body", req.body)
    Like.removeLike({ user_id, project_id }, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: 'Like removed successfully' });
    });
});


router.get('/likes/:user_id', (req, res) => {
    const { user_id } = req.params;
    Like.findLikesByUser(user_id, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.get('/likes/project/:project_id', (req, res) => {
    const { project_id } = req.params;
    Like.findLikesByProject(project_id, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    User.findById(id).then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'An unexpected error occurred' });
    });
});

router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;
    User.update(id, user).then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'An unexpected error occurred' });
    });
});

module.exports = router;