const express = require('express');
const router = express.Router();
const companyZoneController = require('../controllers/companyZOne.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const CompanyZoneSchema = require('../joiSchemas/companyZone.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: CompanyZone
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /CompanyZone/getAllCompanyZones:
 *   get:
 *     tags:
 *       - CompanyZone
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllCompanyZones', authenticateJWT, companyZoneController.getAllCompanyZones);


/**
 * @swagger
 * /CompanyZone/createCompanyZone:
 *   post:
 *     tags: [CompanyZone]
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
 *               - companyZoneName 
 *             properties:
 *               companyZoneName:
 *                 type: string
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createCompanyZone', validateSchema(CompanyZoneSchema.createCompanyZoneSchema), validateAdmin(), companyZoneController.createCompanyZone);


/**
 * @swagger
 * /CompanyZone/updateCompanyZone/{id}:
 *   put:
 *     tags:
 *       - CompanyZone
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
 *               - companyZoneName 
 *             properties:
 *               companyZoneName:
 *                 type: string
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateCompanyZone/:id', validateSchema(CompanyZoneSchema.updateCompanyZoneSchema), validateAdmin(), companyZoneController.updateCompanyZone);

/**
 * @swagger
 * /companyZone/setCompanyZoneStatus/{id}:
 *   put:
 *     tags:
 *       - CompanyZone
 *     summary: Update an CompanyZone type by ID
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
 *       description: CompanyZone type data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: CompanyZone type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/setCompanyZoneStatus/:id', /*validateSchema(CompanyZoneSchema.setCompanyZoneStatusSchema),*/ validateAdmin(), companyZoneController.setCompanyZoneStatus);


module.exports = router;