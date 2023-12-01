// session.controller.js
const sessionModel = require('../models/session.model');

exports.openSession = async (req, res) => {
    try {
        const newSession = await sessionModel.createSession();
        res.json(newSession);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.closeSession = async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id);
        const updatedSession = await sessionModel.closeSession(sessionId);
        res.json(updatedSession);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
