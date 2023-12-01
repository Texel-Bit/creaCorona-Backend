const express = require('express');
const router = express.Router();
const quotationStatusController = require('../controllers/quotationStatus.controller');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: QuotationStatus
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /quotationStatus/getAllQuotationStatus:
 *   get:
 *     tags:
 *       - QuotationStatus
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllQuotationStatus', authenticateJWT, quotationStatusController.getAllQuotationStatus);



module.exports = router;