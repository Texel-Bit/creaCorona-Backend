const express = require('express');
const router = express.Router();
const stateController = require('../controllers/state.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const stateSchema = require('../joiSchemas/state.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: State
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /state/getAllStates:
 *   get:
 *     tags:
 *       - State
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllStates', stateController.getAllStates);


/**
 * @swagger
 * /state/createState:
 *   post:
 *     tags: [State]
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
 *               - stateName
 *             properties:
 *               stateName:
 *                 type: string
 *                 maxLenght: 45
 *               companyZone_idcompanyZone:
 *                 type: integer
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createState', validateSchema(stateSchema.createStateSchema), validateAdmin(), stateController.createState);


/**
 * @swagger
 * /state/updateState/{id}:
 *   put:
 *     tags:
 *       - State
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
 *               - stateName
 *             properties:
 *               stateName:
 *                 type: string
 *                 maxLenght: 45
 *               companyZone_idcompanyZone:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateState/:id', validateSchema(stateSchema.updateStateSchema), validateAdmin(), stateController.updateState);


/**
 * @swagger
 * /state/deleteState/{id}:
 *   delete:
 *     tags: [State]
 *     summary: Delete an State by ID
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
 *         description: Design color bundle deleted successfully
 */
router.delete('/deleteState/:id', validateAdmin(), stateController.deleteState);

/**
 * @swagger
 * /state/setStateStatus/{id}:
 *   put:
 *     tags:
 *       - State
 *     summary: Update an State type by ID
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
 *       description: State type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: State type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setStateStatus/:id', /*validateSchema(StateSchema.setStateStatusSchema),*/ validateAdmin(), stateController.setStateStatus);


module.exports = router;