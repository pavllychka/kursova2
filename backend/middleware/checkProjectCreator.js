const { NotFoundError } = require('../utils/errors');
const User = require('../models/User');

async function checkProjectCreator(req, res, next) {
    try {
        const { user_id } = req.body;
        const user = await User.findById(user_id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.role !== 'project_creator') {
            return res.status(403).json({ message: 'User is not a project creator' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err instanceof NotFoundError) {
          return res.status(404).json({ message: err.message });
        }
        console.error(err);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
}

module.exports = checkProjectCreator; 