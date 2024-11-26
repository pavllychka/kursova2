const db = require('../config/db');
const { getCityAndCountry } = require('../utils/coords');

const Project = {
    create: async ({ title, description, user_id, location }, callback) => {
        const cityAndCountry = await getCityAndCountry(location.x, location.y);
        const sql = 'INSERT INTO projects (title, description, user_id, location, location_display) VALUES (?, ?, ?, POINT(?, ?), ?)';
        db.query(sql, [title, description, user_id, location.x, location.y, cityAndCountry], (err, result) => {
            if (err) return callback(err);
            callback(null, {
                id: result.insertId,
                title,
                description,
                location,
                locationDisplay: cityAndCountry
            });
        });
    },
    findAll: (callback) => {
        const sql = `
        SELECT 
            p.id AS project_id,
            p.title,
            p.description,
            p.location,
            p.location_display,
            -- Creator Information
            JSON_OBJECT(
                'id', creator.id,
                'name', creator.name,
                'email', creator.email,
                'location', creator.location
            ) AS creator,
            -- Likes and Users Who Liked
            (IF(count(l.project_id) = 0, 
                JSON_ARRAY(), 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', liker.id,
                        'name', liker.name,
                        'email', liker.email,
                        'location', liker.location
                    )
                )
            )) AS likes
        FROM projects p
        JOIN users creator ON p.user_id = creator.id
        LEFT JOIN likes l ON p.id = l.project_id
        LEFT JOIN users liker ON l.user_id = liker.id
        GROUP BY p.id;
        `;
        db.query(sql, (err, results) => {
            if (err) return callback(err);
            console.log("Results", results);
            const projects = results.map(dto);
            callback(null, projects);
        });
    },
    search: (searchTerm, callback) => {
        const sql = `
            SELECT 
                p.id AS project_id,
                p.title,
                p.description,
                p.location,
                p.location_display,
                -- Creator Information
                JSON_OBJECT(
                    'id', creator.id,
                    'name', creator.name,
                    'email', creator.email,
                    'location', creator.location
                ) AS creator,
                -- Likes and Users Who Liked
                (IF(count(l.project_id) = 0, 
                    JSON_ARRAY(), 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', liker.id,
                            'name', liker.name,
                            'email', liker.email,
                            'location', liker.location
                        )
                    )
                )) AS likes
            FROM projects p
            JOIN users creator ON p.user_id = creator.id
            LEFT JOIN likes l ON p.id = l.project_id
            LEFT JOIN users liker ON l.user_id = liker.id
            WHERE p.title LIKE ? OR p.description LIKE ?
            GROUP BY p.id;
        `;
        const searchPattern = `%${searchTerm}%`;
        db.query(sql, [searchPattern, searchPattern], (err, results) => {
            if (err) return callback(err);

            const projects = results.map(dto);

            callback(null, projects);
        });
    }
};

const dto = (project) => ({
    ...project,
    id: project.project_id,
    locationDisplay: project.location_display,
    user: project.creator
})

module.exports = Project;