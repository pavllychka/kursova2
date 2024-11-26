const db = require('../config/db');
const bcrypt = require('bcrypt');
const { NotFoundError, InvalidCredentialsError } = require('../utils/errors');
const { getCityAndCountry } = require('../utils/coords');

const User = {
    create: async ({ name, email, password, role, location }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const cityAndCountry = await getCityAndCountry(location.x, location.y);
        console.log("Detected location:", cityAndCountry);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (name, email, password, role, location, location_display) VALUES (?, ?, ?, ?, POINT(?, ?), ?)';
            db.query(sql, [name, email, hashedPassword, role, location.x, location.y, cityAndCountry], (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, name, email, role, location, locationDisplay: cityAndCountry });
            });
        });
    },
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users', (err, result) => {
                if (err) return reject(err);
                const users = result.map(dto);
                resolve(users);
            });
        });
    },
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return reject(new NotFoundError('User not found'));
                const isMatch = await bcrypt.compare(password, result[0].password);
                if (!isMatch) return reject(new InvalidCredentialsError('Invalid credentials'));
                const user = dto(result[0]);
                resolve(user);
            });
        });
    },
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return reject(new NotFoundError('User not found'));
                const user = dto(result[0]);
                resolve(user);
            });
        });
    },
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return reject(new NotFoundError('User not found'));
                const res = result[0];
                const user = dto(res);
                resolve(user);
            });
        });
    },
    update: (id, {name, location, skills, instagramLink, linkedinLink, githubLink, yearsOfExperience, phoneNumber, position}) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET name = ?, location = POINT(?, ?), skills = ?, instagram_link = ?, linkedin_link = ?, github_link = ?, years_of_experience = ?, phone_number = ?, position = ? WHERE id = ?';
            db.query(sql, [name, location.x, location.y, skills, instagramLink, linkedinLink, githubLink, yearsOfExperience, phoneNumber, position, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },
};

function dto(user) {
    return {
        ...user,
        instagramLink: user.instagram_link,
        linkedinLink: user.linkedin_link,
        githubLink: user.github_link,
        yearsOfExperience: user.years_of_experience,
        phoneNumber: user.phone_number,
        password: undefined,
        locationDisplay: user.location_display,
    };
}

module.exports = User;