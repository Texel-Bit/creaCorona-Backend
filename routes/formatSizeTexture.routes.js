const express = require('express');
const router = express.Router();
const formatSizeTextureController = require('../controllers/formatSizeTexture.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const formatSizeTextureSchema = require('../joiSchemas/formatSizeTexture.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: FormatSizeTexture
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /formatSizeTexture/getAllFormatSizeTexture:
 *   get:
 *     tags:
 *       - FormatSizeTexture
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllFormatSizeTexture', authenticateJWT, formatSizeTextureController.getAllFormatSizeTexture);

/**
 * @swagger
 * /formatSizeTexture/getAllFormatSizeTexture/{formatSizeId}:
 *   get:
 *     tags:
 *       - FormatSizeTexture
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: formatSizeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllFormatSizeTexture/:formatSizeId', authenticateJWT, formatSizeTextureController.getAllFormatSizeTextureByFormatSizeId);



/**
 * @swagger
 * /formatSizeTexture/createFormatSizeTexture:
 *   post:
 *     tags: [FormatSizeTexture]
 *     summary: Create a new FormatSizeTexture type configuration
 *     description: Create a new FormatSizeTexture type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               FormatSizeTextureName:
 *                 type: string
 *               DesignTypeFormatSize_idDesignTypeFormatSize:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: FormatSizeTexture type configuration created successfully
 *     components:
 *       schemas:
 *         FormatSizeTexture:
 *           type: object
 *           properties:
 *             FormatSizeTextureName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createFormatSizeTexture',upload.fields([{ name: 'FormatSizeTextureName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(FormatSizeTextureSchema.createFormatSizeTextureSchema),*/ validateAdmin(), formatSizeTextureController.createFormatSizeTexture);


/**
 * @swagger
 * /formatSizeTexture/updateFormatSizeTexture/{id}:
 *   put:
 *     tags:
 *       - FormatSizeTexture
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               FormatSizeTextureName:
 *                 type: string
 *               DesignTypeFormatSize_idDesignTypeFormatSize:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: FormatSizeTexture type configuration created successfully
 *     components:
 *       schemas:
 *         FormatSizeTexture:
 *           type: object
 *           properties:
 *             FormatSizeTextureName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.put('/updateFormatSizeTexture/:id', upload.fields([{ name: 'FormatSizeTextureName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(FormatSizeTextureSchema.createFormatSizeTextureSchema),*/ validateAdmin(), formatSizeTextureController.updateFormatSizeTexture);


/**
 * @swagger
 * /formatSizeTexture/setFormatSizeTextureStatus/{id}:
 *   put:
 *     tags:
 *       - FormatSizeTexture
 *     summary: Update an FormatSizeTexture type by ID
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
 *       description: FormatSizeTexture type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FormatSizeTexture type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setFormatSizeTextureStatus/:id', /*validateSchema(FormatSizeTextureSchema.setFormatSizeTextureStatusSchema),*/ validateAdmin(), formatSizeTextureController.setFormatSizeTextureStatus);

router.post('/castHtmlToPng', formatSizeTextureController.castHtmlToPng);

module.exports = router;