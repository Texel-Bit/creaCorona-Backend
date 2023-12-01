const express = require('express');
const router = express.Router();
const colorDesignColorsController = require('../controllers/designColors.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designColorsSchema = require('../joiSchemas/designColors.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: DesignColors
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designColors/getAllDesignColors:
 *   get:
 *     tags:
 *       - DesignColors
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignColors', colorDesignColorsController.getAllDesignColors);


/**
 * @swagger
 * /designColors/getAllDesignColorsByDesignTypeId/{designTypeId}:
 *   get:
 *     tags:
 *       - DesignColors
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all design colors by DesignTypeId
 *     parameters:
 *       - name: designTypeId
 *         in: path
 *         required: true
 *         description: ID of the design type
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Design colors retrieved successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignColorsByDesignTypeId/:designTypeId', colorDesignColorsController.getAllDesignColorsByDesignTypeId);


/**
 * @swagger
 * /designColors/createDesignColors:
 *   post:
 *     tags: [DesignColors]
 *     summary: Create a new DesignColors type configuration
 *     description: Create a new DesignColors type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               DesignColorName:
 *                 type: string
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DesignColors type configuration created successfully
 *     components:
 *       schemas:
 *         DesignColors:
 *           type: object
 *           properties:
 *             DesignColorsName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createDesignColors',upload.fields([{ name: 'DesignColorsName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignColorsSchema.createDesignColorsSchema),*/ validateAdmin(), colorDesignColorsController.createDesignColors);


/**
 * @swagger
 * /designColors/updateDesignColors/{id}:
 *   put:
 *     tags:
 *       - DesignColors
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
 *               DesignColorName:
 *                 type: string
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DesignColors type configuration created successfully
 *     components:
 *       schemas:
 *         DesignColors:
 *           type: object
 *           properties:
 *             DesignColorsName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.put('/updateDesignColors/:id', upload.fields([{ name: 'DesignColorsName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignColorsSchema.createDesignColorsSchema),*/ validateAdmin(), colorDesignColorsController.updateDesignColors);



module.exports = router;