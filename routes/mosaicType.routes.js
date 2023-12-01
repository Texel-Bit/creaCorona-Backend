const express = require('express');
const router = express.Router();
const mosaicTypeController = require('../controllers/mosaicType.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const mosaicTypeSchema = require('../joiSchemas/mosaicType.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: MosaicType
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /mosaicType/getAllMosaicTypes:
 *   get:
 *     tags:
 *       - MosaicType
 *     summary: Activate a system user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllMosaicTypes', authenticateJWT, mosaicTypeController.getAllMosaicTypes);


/**
 * @swagger
 * /mosaicType/createmosaicType:
 *   post:
 *     tags: [MosaicType]
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
 *               - MosaicTypeName
 *               - MosaicTypeValue
 *             properties:
 *               MosaicTypeName:
 *                 type: string
 *                 maxLenght: 45
 *               MosaicTypeValue:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createmosaicType', validateSchema(mosaicTypeSchema.createMosaicTypeSchema), validateAdmin(), mosaicTypeController.createMosaicType);


/**
 * @swagger
 * /mosaicType/updateMosaicType/{id}:
 *   put:
 *     tags:
 *       - MosaicType
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
 *               - MosaicTypeName
 *               - MosaicTypeValue
 *             properties:
 *               MosaicTypeName:
 *                 type: string
 *                 maxLenght: 45
 *               MosaicTypeValue:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateMosaicType/:id', validateSchema(mosaicTypeSchema.updateMosaicTypeSchema), validateAdmin(), mosaicTypeController.updateMosaicType);



module.exports = router;