const express = require('express');
const router = express.Router();
const colorDesignColorTypeController = require('../controllers/designColorType.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designColorTypeSchema = require('../joiSchemas/designColorType.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: DesignColorType
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designColorType/getAllDesignColorType:
 *   get:
 *     tags:
 *       - DesignColorType
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignColorType', authenticateJWT, colorDesignColorTypeController.getAllDesignColorType);

/**
 * @swagger
 * /designColorType/getAllDesignColorTypehasDesignType:
 *   get:
 *     tags:
 *       - DesignColorType
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignColorTypehasDesignType', authenticateJWT, colorDesignColorTypeController.getAllDesignColorTypehasDesignType);


/**
 * @swagger
 * /designColorType/createDesignColorTypehasDesignType:
 *   post:
 *     tags: [DesignColorType]
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
 *               - EnvironmentType_idEnvironmentType
 *             properties:
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createDesignColorTypehasDesignType', validateSchema(designColorTypeSchema.createDesignColorTypehasDesignTypeSchema), validateAdmin(), colorDesignColorTypeController.createDesignColorTypehasDesignType);

/**
 * @swagger
 * /designColorType/deleteDesignColorTypehasDesignType:
 *   delete:
 *     tags: [DesignColorType]
 *     summary: get all design color bundle by filters configuration
 *     description: get all design color bundle by filters configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - EnvironmentType_idEnvironmentType
 *               - DesignType_idDesignType 
 *               - DesignColorType_idDesignColorType 
 *             properties:
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */
router.delete('/deleteDesignColorTypehasDesignType', authenticateJWT, colorDesignColorTypeController.deleteDesignColorTypehasDesignType);

/**
 * @swagger
 * /designColorType/getDesignColorTypeByDesignType/{id}:
 *   get:
 *     tags:
 *       - DesignColorType
 *     summary: Get an user inventory configuration by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: user inventory configuration fetched successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getDesignColorTypeByDesignType/:id', authenticateJWT, colorDesignColorTypeController.getDesignColorTypeByDesignType);


module.exports = router;