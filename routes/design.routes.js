const express = require('express');
const router = express.Router();
const colorDesignController = require('../controllers/design.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designSchema = require('../joiSchemas/design.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Design
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /design/getAllDesign:
 *   get:
 *     tags:
 *       - Design
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesign', authenticateJWT, colorDesignController.getAllDesign);


/**
 * @swagger
 * /design/getAllDesignsByDesignTypeId/{designTypeId}:
 *   get:
 *     tags:
 *       - Design
 *     parameters:
 *       - in: path
 *         name: designTypeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the DesignType.
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all designs by DesignTypeId
 *     responses:
 *       200:
 *         description: Designs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Design'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Designs not found
 */
router.get('/getAllDesignsByDesignTypeId/:designTypeId', authenticateJWT, colorDesignController.getAllDesignsByDesignTypeId);


/**
 * @swagger
 * /design/createDesign:
 *   post:
 *     tags: [Design]
 *     summary: Create a new Design type configuration
 *     description: Create a new Design type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               DesignName:
 *                 type: string
 *               DesignSellPrice:
 *                 type: number
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Design type configuration created successfully
 *     components:
 *       schemas:
 *         Design:
 *           type: object
 *           properties:
 *             DesignName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createDesign',upload.fields([{ name: 'DesignName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignSchema.createDesignSchema),*/ validateAdmin(), colorDesignController.createDesign);


/**
 * @swagger
 * /design/updateDesign/{id}:
 *   put:
 *     tags:
 *       - Design
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
 *               DesignName:
 *                 type: string
 *               DesignSellPrice:
 *                 type: number
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Design type configuration created successfully
 *     components:
 *       schemas:
 *         Design:
 *           type: object
 *           properties:
 *             DesignName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */
router.put('/updateDesign/:id', upload.fields([{ name: 'DesignName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignSchema.createDesignSchema),*/ validateAdmin(), colorDesignController.updateDesign);

/**
 * @swagger
 * /design/setDesignStatus/{id}:
 *   put:
 *     tags:
 *       - Design
 *     summary: Update an Design type by ID
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
 *       description: Design type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Design type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setDesignStatus/:id', /*validateSchema(DesignSchema.setDesignStatusSchema),*/ validateAdmin(), colorDesignController.setDesignStatus);

/**
 * @swagger
 * /design/getDesignsByEnvironmentType:
 *   post:
 *     tags: [Design]
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
 *             properties:
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *               DesignType_idDesignType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/getDesignsByEnvironmentType', colorDesignController.getDesignsByEnvironmentType);


module.exports = router;