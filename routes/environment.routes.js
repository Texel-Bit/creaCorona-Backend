const express = require('express');
const router = express.Router();
const environmentController = require('../controllers/environment.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const environmentSchema = require('../joiSchemas/environment.schema');
const { authenticateJWT, validateAdmin, validateJWT } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Environment
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /environment/getAllEnvironment:
 *   get:
 *     tags:
 *       - Environment
 *     summary: Activate a system user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllEnvironment', environmentController.getAllEnvironment);

/**
 * @swagger
 * /environment/getAllEnvironmentByEnvironmentType/{id}:
 *   get:
 *     tags: [Environment]
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
router.get('/getAllEnvironmentByEnvironmentType/:id', authenticateJWT, environmentController.getAllEnvironmentByEnvironmentType);


/**
 * @swagger
 * /environment/createEnvironment:
 *   post:
 *     tags: [Environment]
 *     summary: Create a new Environment type configuration
 *     description: Create a new Environment type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               EnvironmentName:
 *                 type: string
 *               EnvironmentAngle:
 *                 type: string
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *               imageMask:
 *                 type: string
 *                 format: binary
 *               imageProfile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Environment type configuration created successfully
 *     components:
 *       schemas:
 *         Environment:
 *           type: object
 *           properties:
 *             EnvironmentName:
 *               type: string
 *             imageMask:
 *               type: string
 *               format: binary
 *             imageProfile:
 *               type: string
 *               format: binary
 */

router.post('/createEnvironment',upload.fields([{ name: 'EnvironmentName' }, { name: 'imageMask' }, { name: 'imageProfile' }]),StorageHandler.processImageFields(['imageMask', 'imageProfile']), /*validateSchema(EnvironmentSchema.createEnvironmentSchema),*/ validateAdmin(), environmentController.createEnvironment);




/**
 * @swagger
 * /environment/updateEnvironment/{id}:
 *   put:
 *     tags: [Environment]
 *     summary: Create a new Environment type configuration
 *     description: Create a new Environment type configuration in the system.
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               EnvironmentName:
 *                 type: string
 *               EnvironmentAngle:
 *                 type: string
 *               imageMask:
 *                 type: string
 *                 format: binary
 *               imageProfile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Environment type configuration created successfully
 *     components:
 *       schemas:
 *         Environment:
 *           type: object
 *           properties:
 *             EnvironmentName:
 *               type: string
 *             imageMask:
 *               type: string
 *               format: binary
 *             imageProfile:
 *               type: string
 *               format: binary
 */
router.put('/updateEnvironment/:id', validateAdmin(), environmentController.updateEnvironment);

/**
 * @swagger
 * /environment/setEnvironmentStatus/{id}:
 *   put:
 *     tags:
 *       - Environment
 *     summary: Update an Environment type by ID
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
 *       description: Environment type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setEnvironmentStatus/:id', /*validateSchema(EnvironmentSchema.setEnvironmentStatusSchema),*/ validateAdmin(), environmentController.setEnvironmentStatus);


module.exports = router;