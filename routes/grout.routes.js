const express = require('express');
const router = express.Router();
const groutController = require('../controllers/grout.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const groutSchema = require('../joiSchemas/grout.schema');
const { authenticateJWT, validateAdmin, validateJWT } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Grout
 *   description: grout type configuration management
 */

/**
 * @swagger
 * /grout/getAllGroutes:
 *   get:
 *     tags:
 *       - Grout
 *     summary: Activate a system user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllGroutes', groutController.getAllGroutes);


/**
 * @swagger
 * /grout/createGrout:
 *   post:
 *     tags: [Grout]
 *     summary: Create a new grout type configuration
 *     description: Create a new grout type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - groutName
 *             properties:
 *               groutName:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Grout type configuration created successfully
 *     components:
 *       schemas:
 *         Grout:
 *           type: object
 *           properties:
 *             groutName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createGrout',upload.fields([{ name: 'groutName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(groutSchema.createGroutSchema),*/ validateAdmin(), groutController.createGrout);


/**
 * @swagger
 * /grout/updateGrout/{id}:
 *   put:
 *     tags:
 *       - Grout
 *     summary: Update an grout type by ID
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
 *       description: grout type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groutName
 *             properties:
 *               groutName:
 *                 type: string
 *                 maxLenght: 45
 *     responses:
 *       200:
 *         description: grout type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateGrout/:id', /*validateSchema(groutSchema.updateGroutSchema),*/ validateAdmin(), groutController.updateGrout);

/**
 * @swagger
 * /grout/setGroutStatus/{id}:
 *   put:
 *     tags:
 *       - Grout
 *     summary: Update an grout type by ID
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
 *       description: grout type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: grout type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setGroutStatus/:id', /*validateSchema(groutSchema.setGroutStatusSchema),*/ validateAdmin(), groutController.setGroutStatus);


module.exports = router;