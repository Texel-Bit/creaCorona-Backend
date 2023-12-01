const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const gameController = require('../controllers/gameController.controller');

const router = express.Router();

/**
 * @swagger
 * /api/gameController/SendMessageById:
 *   post:
 *     tags: [GameController]
 *     summary: Create a new game sub-zone location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wsConnectionId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game sub-zone location created successfully
 */
router.post('/SendMessageById', gameController.SendMessageById);


module.exports = router;