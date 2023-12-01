const express = require('express');
const router = express.Router();
const colorDesignTypeFormatSizeController = require('../controllers/designTypeFormatSize.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designTypeFormatSizeSchema = require('../joiSchemas/designTypeFormatSize.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: DesignTypeFormatSize
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designTypeFormatSize/getAllDesignTypeFormatSize:
 *   get:
 *     tags:
 *       - DesignTypeFormatSize
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignTypeFormatSize', authenticateJWT, colorDesignTypeFormatSizeController.getAllDesignTypeFormatSize);


/**
 * @swagger
 * /designTypeFormatSize/getFormatsByDesignTypeId/{designTypeId}:
 *   get:
 *     tags:
 *       - DesignTypeFormatSize
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve formats by DesignTypeId
 *     parameters:
 *       - name: designTypeId
 *         in: path
 *         required: true
 *         description: ID of the design type to retrieve formats for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formats retrieved successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: DesignTypeId not found
 */
router.get('/getFormatsByDesignTypeId/:designTypeId', authenticateJWT, colorDesignTypeFormatSizeController.getAllDesignTypeByDesignTypeId);


/**
 * @swagger
 * /designTypeFormatSize/createDesignTypeFormatSize:
 *   post:
 *     tags: [DesignTypeFormatSize]
 *     summary: Create a new DesignTypeFormatSize type configuration
 *     description: Create a new DesignTypeFormatSize type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               DesignTypeFormatSizeName:
 *                 type: string
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignTypeFormatSizeHeight:
 *                 type: string
 *               DesignTypeFormatSizeWidht:
 *                 type: string
 *               DesignTypeFormatSizeMosaicScale:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DesignTypeFormatSize type configuration created successfully
 *     components:
 *       schemas:
 *         DesignTypeFormatSize:
 *           type: object
 *           properties:
 *             DesignTypeFormatSizeName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createDesignTypeFormatSize',upload.fields([{ name: 'DesignTypeFormatSizeName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignTypeFormatSizeSchema.createDesignTypeFormatSizeSchema),*/ validateAdmin(), colorDesignTypeFormatSizeController.createDesignTypeFormatSize);


/**
 * @swagger
 * /designTypeFormatSize/updatedesignTypeFormatSize/{id}:
 *   put:
 *     tags:
 *       - DesignTypeFormatSize
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
 *               - DesignTypeFormatSizeName
 *             properties:
 *               DesignTypeFormatSizeName:
 *                 type: string
 *                 maxLenght: 45
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignTypeFormatSizeHeight:
 *                 type: string
 *               DesignTypeFormatSizeWidht:
 *                 type: string
 *               DesignTypeFormatSizeMosaicScale:
 *                 type: string
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updatedesignTypeFormatSize/:id', validateSchema(designTypeFormatSizeSchema.updateDesignTypeFormatSizeSchema), validateAdmin(), colorDesignTypeFormatSizeController.updateDesignTypeFormatSize);

/**
 * @swagger
 * /designTypeFormatSize/setDesignTypeFormatSizeStatus/{id}:
 *   put:
 *     tags:
 *       - DesignTypeFormatSize
 *     summary: Update an DesignTypeFormatSize type by ID
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
 *       description: DesignTypeFormatSize type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: DesignTypeFormatSize type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setDesignTypeFormatSizeStatus/:id', /*validateSchema(DesignTypeFormatSizeSchema.setDesignTypeFormatSizeStatusSchema),*/ validateAdmin(), colorDesignTypeFormatSizeController.setDesignTypeFormatSizeStatus);

/**
 * @swagger
 * /designTypeFormatSize/getDesignTypeFormatSizeByEnvironmentTypeId/{id}:
 *   get:
 *     tags:
 *       - DesignTypeFormatSize
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve formats by DesignTypeId
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the design type to retrieve formats for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formats retrieved successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: DesignTypeId not found
 */
router.get('/getDesignTypeFormatSizeByEnvironmentTypeId/:id', colorDesignTypeFormatSizeController.getDesignTypeFormatSizeByEnvironmentTypeId);


module.exports = router;