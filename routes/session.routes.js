// session.routes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');

/**
 * @swagger
 * /session/open:
 *   post:
 *     summary: Open a new session
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: The session was successfully opened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idsession:
 *                   type: integer
 *                 sessionStartDate:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.post('/open', sessionController.openSession);

/**
 * @swagger
 * /session/close/{id}:
 *   put:
 *     summary: Close an existing session
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The session ID
 *     responses:
 *       200:
 *         description: The session was successfully closed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idsession:
 *                   type: integer
 *                 sessionEndDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.put('/close/:id', sessionController.closeSession);

module.exports = router;
