const path = require('path');

exports.getNotificationsByUserId = async (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
};