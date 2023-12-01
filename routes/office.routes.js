const express = require('express');
const router = express.Router();
const officeController = require('../controllers/office.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const officeSchema = require('../joiSchemas/office.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Office
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /office/getAllOffice:
 *   get:
 *     tags:
 *       - Office
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllOffice', authenticateJWT, officeController.getAllOffice);


/**
 * @swagger
 * /office/getAllOfficeStatus:
 *   get:
 *     tags:
 *       - Office
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllOfficeStatus', authenticateJWT, officeController.getAllOfficeStatus);


/**
 * @swagger
 * /office/createOffice:
 *   post:
 *     tags: [Office]
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
 *               - officeDescription
 *             properties:
 *               officeDescription:
 *                 type: string
 *               Company_idCompany:
 *                 type: integer
 *               state_idstate:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createOffice', validateSchema(officeSchema.createOfficeSchema), validateAdmin(), officeController.createOffice);


/**
 * @swagger
 * /office/updateOffice/{id}:
 *   put:
 *     tags:
 *       - Office
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
 *             properties:
 *               officeDescription:
 *                 type: string
 *               Company_idCompany:
 *                 type: integer
 *               state_idstate:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateOffice/:id', validateSchema(officeSchema.updateOfficeSchema), validateAdmin(), officeController.updateOffice);

/**
 * @swagger
 * /office/getAllOfficesByCompanyId/{id}:
 *   get:
 *     tags: [Office]
 *     summary: Get an Office by ID
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
 *         description: Office fetched successfully
 */
router.get('/getAllOfficesByCompanyId/:id', authenticateJWT, officeController.getAllOfficesByCompanyId);

/**
 * @swagger
 * /office/setOfficeStatus/{id}:
 *   put:
 *     tags:
 *       - Office
 *     summary: Update an Office type by ID
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
 *       description: Office type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Office type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setOfficeStatus/:id', /*validateSchema(OfficeSchema.setOfficeStatusSchema),*/ validateAdmin(), officeController.setOfficeStatus);


module.exports = router;