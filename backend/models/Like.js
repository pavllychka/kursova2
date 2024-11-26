const db = require('../config/db');

const Like = {
    addLike: ({ user_id, project_id }, callback) => {
        console.log(user_id, project_id)
        const sql = 'INSERT INTO likes (user_id, project_id) VALUES (?, ?)';
        db.query(sql, [user_id, project_id], callback);
    },
    removeLike: ({ user_id, project_id }, callback) => {
        const sql = 'DELETE FROM likes WHERE user_id = ? AND project_id = ?';
        db.query(sql, [user_id, project_id], callback);
    },
    findLikesByProject: (project_id, callback) => {
        const sql = `
            SELECT users.id, users.name, users.email
            FROM likes
            JOIN users ON likes.user_id = users.id
            WHERE likes.project_id = ?
        `;
        db.query(sql, [project_id], callback);
    },
    findLikesByUser: (user_id, callback) => {
        const sql = `
            SELECT projects.id, projects.title, projects.description
            FROM likes
            JOIN projects ON likes.project_id = projects.id
            WHERE likes.user_id = ?
        `;
        db.query(sql, [user_id], callback);
    }
};

module.exports = Like;