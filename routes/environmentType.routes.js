const express = require('express');
const router = express.Router();
const environmentTypeController = require('../controllers/environmentType.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const environmentTypeSchema = require('../joiSchemas/environmentType.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: EnvironmentType
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /environmentType/getAllEnvironmentType:
 *   get:
 *     tags:
 *       - EnvironmentType
 *     summary: Activate a system user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllEnvironmentType', environmentTypeController.getAllEnvironmentType);

/**
 * @swagger
 * /environmentType/getAllDesignTypeEnvironmentType:
 *   get:
 *     tags:
 *       - EnvironmentType
 *     summary: Activate a system user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignTypeEnvironmentType', environmentTypeController.getAllDesignTypeEnvironmentType);

/**
 * @swagger
 * /environmentType/getAllDesignTypeByEnvironmentType/{id}:
 *   get:
 *     tags: [EnvironmentType]
 *     summary: Get an Environment by ID
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
 *         description: Environment fetched successfully
 */
router.get('/getAllDesignTypeByEnvironmentType/:id', authenticateJWT, environmentTypeController.getAllDesignTypeByEnvironmentType);



/**
 * @swagger
 * /environmentType/createEnvironmentType:
 *   post:
 *     tags: [EnvironmentType]
 *     summary: Create a new EnvironmentType type configuration
 *     description: Create a new EnvironmentType type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               EnvironmentTypeName:
 *                 type: string
 *               WorkWithStructure:
 *                 type: boolean
 *               EnvironmentTypeIcon:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: EnvironmentType type configuration created successfully
 *     components:
 *       schemas:
 *         EnvironmentType:
 *           type: object
 *           properties:
 *             EnvironmentTypeName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createEnvironmentType',upload.fields([{ name: 'EnvironmentTypeName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(EnvironmentTypeSchema.createEnvironmentTypeSchema),*/ validateAdmin(), environmentTypeController.createEnvironmentType);


/**
 * @swagger
 * /environmentType/updateEnvironmentType/{id}:
 *   put:
 *     tags:
 *       - EnvironmentType
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
 *               EnvironmentTypeName:
 *                 type: string
 *               WorkWithStructure:
 *                 type: boolean
 *               EnvironmentTypeIcon:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: EnvironmentType type configuration created successfully
 *     components:
 *       schemas:
 *         EnvironmentType:
 *           type: object
 *           properties:
 *             EnvironmentTypeName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.put('/updateEnvironmentType/:id', upload.fields([{ name: 'EnvironmentTypeName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(EnvironmentTypeSchema.createEnvironmentTypeSchema),*/ validateAdmin(), environmentTypeController.updateEnvironmentType);


/**
 * @swagger
 * /environmentType/createDesignTypeEnvironmentType:
 *   post:
 *     tags: [EnvironmentType]
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
 *               - DesignType_idDesignType
 *               - EnvironmentType_idEnvironmentType
 *             properties:
 *               DesignType_idDesignType:
 *                 type: integer
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createDesignTypeEnvironmentType', validateSchema(environmentTypeSchema.createDesignTypeEnvironmentTypeSchema), validateAdmin(), environmentTypeController.createDesignTypeEnvironmentType);

/**
 * @swagger
 * /environmentType/deleteDesignTypeEnvironmentType:
 *   delete:
 *     tags: [EnvironmentType]
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
router.delete('/deleteDesignTypeEnvironmentType', authenticateJWT, environmentTypeController.deleteDesignTypeEnvironmentType);

/**
 * @swagger
 * /environmentType/getAllDesignTypeFormatSizeForEnvironmentType:
 *   post:
 *     tags: [EnvironmentType]
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
router.post('/getAllDesignTypeFormatSizeForEnvironmentType', authenticateJWT, environmentTypeController.getAllDesignTypeFormatSizeForEnvironmentType);

/**
 * @swagger
 * /environmentType/createDesignTypeFormatSizeForEnvironmentType:
 *   post:
 *     tags: [EnvironmentType]
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
 *               - formatsSize
 *               - EnvironmentType_idEnvironmentType
 *               - DesignType_idDesignType
 *             properties:
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *               DesignType_idDesignType:
 *                 type: integer
 *               formatsSize:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createDesignTypeFormatSizeForEnvironmentType', validateSchema(environmentTypeSchema.createDesignTypeFormatSizeForEnvironmentTypeSchema), validateAdmin(), environmentTypeController.createDesignTypeFormatSizeForEnvironmentType);

/**
 * @swagger
 * /environmentType/deleteDesignTypeFormatSizeForEnvironmentType:
 *   delete:
 *     tags: [EnvironmentType]
 *     summary: delete a new environment type configuration
 *     description: delete a new environment type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - DesignTypeFormatSize_idDesignTypeFormatSize
 *               - EnvironmentType_idEnvironmentType 
 *             properties:
 *               DesignTypeFormatSize_idDesignTypeFormatSize:
 *                 type: integer
 *               EnvironmentType_idEnvironmentType :
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration deleted successfully
 */
router.delete('/deleteDesignTypeFormatSizeForEnvironmentType', validateSchema(environmentTypeSchema.deleteDesignTypeFormatSizeForEnvironmentTypeSchema), validateAdmin(), environmentTypeController.deleteDesignTypeFormatSizeForEnvironmentType);

/**
 * @swagger
 * /environmentType/getDesignColorTypesByEnvironmentIdAndDesignType:
 *   post:
 *     tags: [EnvironmentType]
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

router.post('/getDesignColorTypesByEnvironmentIdAndDesignType', validateSchema(environmentTypeSchema.getDesignColorTypesByEnvironmentIdAndDesignTypeSchema), authenticateJWT, environmentTypeController.getDesignColorTypesByEnvironmentIdAndDesignType);

/**
 * @swagger
 * /environmentType/getAllDesignColorTypeHasDesignType:
 *   get:
 *     tags:
 *       - EnvironmentType
 *     summary: Activate a system user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */

router.get('/getAllDesignColorTypeHasDesignType', authenticateJWT, environmentTypeController.getAllDesignColorTypeHasDesignType);

/**
 * @swagger
 * /environmentType/addDesignColorTypeToEnvironmentType:
 *   post:
 *     tags: [EnvironmentType]
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
 *               - DesignType_idDesignType
 *               - DesignColorType_idDesignColorType
 *             properties:
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */
router.post('/addDesignColorTypeToEnvironmentType', validateSchema(environmentTypeSchema.addDesignColorTypeToEnvironmentTypeSchema), validateAdmin(), environmentTypeController.addDesignColorTypeToEnvironmentType);

/**
 * @swagger
 * /environmentType/setEnvironmentTypeStatus/{id}:
 *   put:
 *     tags:
 *       - EnvironmentType
 *     summary: Update an EnvironmentType type by ID
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
 *       description: EnvironmentType type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: EnvironmentType type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setEnvironmentTypeStatus/:id', /*validateSchema(EnvironmentTypeSchema.setEnvironmentTypeStatusSchema),*/ validateAdmin(), environmentTypeController.setEnvironmentTypeStatus);


module.exports = router;