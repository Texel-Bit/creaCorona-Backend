const express = require('express');
const router = express.Router();
const designTypeController = require('../controllers/designType.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designTypeSchema = require('../joiSchemas/designType.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: DesignType
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designType/getAllDesignType:
 *   get:
 *     tags:
 *       - DesignType
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignType', designTypeController.getAllDesignType);


/**
 * @swagger
 * /designType/createDesignType:
 *   post:
 *     tags: [DesignType]
 *     summary: Create a new DesignType type configuration
 *     description: Create a new DesignType type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               DesignTypeName:
 *                 type: string
 *               MosaicType_idMosaicType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DesignType type configuration created successfully
 *     components:
 *       schemas:
 *         DesignType:
 *           type: object
 *           properties:
 *             DesignTypeName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createDesignType',upload.fields([{ name: 'DesignTypeName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignTypeSchema.createDesignTypeSchema),*/ validateAdmin(), designTypeController.createDesignType);


/**
 * @swagger
 * /designType/updateDesignType/{id}:
 *   put:
 *     tags:
 *       - DesignType
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
 *               DesignTypeName:
 *                 type: string
 *               MosaicType_idMosaicType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DesignType type configuration created successfully
 *     components:
 *       schemas:
 *         DesignType:
 *           type: object
 *           properties:
 *             DesignTypeName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.put('/updateDesignType/:id', upload.fields([{ name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(DesignTypeSchema.createDesignTypeSchema),*/ validateAdmin(), designTypeController.updateDesignType);

/**
 * @swagger
 * /designType/setDesignTypeStatus/{id}:
 *   put:
 *     tags:
 *       - DesignType
 *     summary: Update an DesignType type by ID
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
 *       description: DesignType type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: DesignType type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setDesignTypeStatus/:id', /*validateSchema(DesignTypeSchema.setDesignTypeStatusSchema),*/ validateAdmin(), designTypeController.setDesignTypeStatus);


module.exports = router;