const express = require('express');
const router = express.Router();
const bundleController = require('../controllers/bundle.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const bundleSchema = require('../joiSchemas/bundle.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bundle
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /bundle/getAllBundles:
 *   get:
 *     tags:
 *       - Bundle
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllBundles', authenticateJWT, bundleController.getAllBundles);


/**
 * @swagger
 * /bundle/createBundle:
 *   post:
 *     tags: [Bundle]
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
 *             required:
 *               - bundleBasePrice
 *             properties:
 *               bundleBasePrice:
 *                 type: number
 *               FormatSizeTexture_idFormatSizeTexture:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createBundle', validateSchema(bundleSchema.createBundleSchema), validateAdmin(), bundleController.createBundle);


/**
 * @swagger
 * /bundle/updateBundle/{id}:
 *   put:
 *     tags:
 *       - Bundle
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
 *             required:
 *               - bundleBasePrice
 *             properties:
 *               bundleBasePrice:
 *                 type: number
 *               FormatSizeTexture_idFormatSizeTexture:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateBundle/:id', validateSchema(bundleSchema.updateBundleSchema), validateAdmin(), bundleController.updateBundle);



module.exports = router;