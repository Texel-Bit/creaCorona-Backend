const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotation.controller');
const { authenticateJWT, validateAdmin, authenticateOptionalJWT } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Quotation
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /quotation/getAllQuotation:
 *   get:
 *     tags:
 *       - Quotation
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllQuotation', authenticateJWT, quotationController.getAllQuotation);


/**
 * @swagger
 * /quotation/updateQuotationStatus/{id}:
 *   put:
 *     tags:
 *       - Quotation
 *     summary: Update an environment type by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: environment type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quotationStatus_idquotationStatus:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateQuotationStatus/:id', validateAdmin(), quotationController.updateQuotationStatus);

/**
 * @swagger
 * /quotation/createQuotation:
 *   post:
 *     tags: [Quotation]
 *     summary: Create a new environment type configuration
 *     description: Create a new environment type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               customerLastname:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               customerPhoneNumber:
 *                 type: string
 *               simulationImage:
 *                 type: string
 *               desingPatternImage:
 *                 type: string
 *               FormatSizeTexture_idFormatSizeTexture:
 *                 type: integer
 *               DesignTypeFormatSize_idDesignTypeFormatSize:
 *                 type: integer
 *               quotationWidth:
 *                 type: number
 *               quotationHeight:
 *                 type: number
 *               quatitionArea:
 *                 type: number
 * 
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createQuotation', /*validateSchema(QuotationSchema.createQuotationSchema)*/ authenticateOptionalJWT, quotationController.createQuotation);


/**
 * @swagger
 * /quotation/createQuotation:
 *   post:
 *     tags: [Quotation]
 *     summary: Create a new environment type configuration
 *     description: Create a new environment type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               customerLastname:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               customerPhoneNumber:
 *                 type: string
 *               simulationImage:
 *                 type: string
 *               desingPatternImage:
 *                 type: string
 *               FormatSizeTexture_idFormatSizeTexture:
 *                 type: integer
 *               DesignTypeFormatSize_idDesignTypeFormatSize:
 *                 type: integer
 *               quotationWidth:
 *                 type: number
 *               quotationHeight:
 *                 type: number
 *               quatitionArea:
 *                 type: number
 * 
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/simulateQuotation', /*validateSchema(QuotationSchema.createQuotationSchema)*/ authenticateOptionalJWT, quotationController.simulateQuotation);




module.exports = router;