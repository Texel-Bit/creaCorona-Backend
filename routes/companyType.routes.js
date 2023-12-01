const express = require('express');
const router = express.Router();
const companyTypeController = require('../controllers/companyType.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const CompanyTypeSchema = require('../joiSchemas/companyType.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: CompanyType
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /CompanyType/getAllCompanyTypes:
 *   get:
 *     tags:
 *       - CompanyType
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllCompanyTypes', authenticateJWT, companyTypeController.getAllCompanyTypes);


/**
 * @swagger
 * /CompanyType/createCompanyType:
 *   post:
 *     tags: [CompanyType]
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
 *               - companyTypeDescription 
 *             properties:
 *               companyTypeDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createCompanyType', validateSchema(CompanyTypeSchema.createCompanyTypeSchema), validateAdmin(), companyTypeController.createCompanyType);


/**
 * @swagger
 * /CompanyType/updateCompanyType/{id}:
 *   put:
 *     tags:
 *       - CompanyType
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
 *               - companyTypeDescription 
 *             properties:
 *               companyTypeDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateCompanyType/:id', validateSchema(CompanyTypeSchema.updateCompanyTypeSchema), validateAdmin(), companyTypeController.updateCompanyType);



module.exports = router;