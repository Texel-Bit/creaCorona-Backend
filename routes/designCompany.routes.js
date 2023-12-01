const express = require('express');
const router = express.Router();
const designCompanyController = require('../controllers/designCompany.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designCompanySchema = require('../joiSchemas/designCompany.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: DesignCompany
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designCompany/getAllDesignCompany:
 *   get:
 *     tags:
 *       - DesignCompany
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignCompany', authenticateJWT, designCompanyController.getAllDesignCompany);


/**
 * @swagger
 * /designCompany/createdesignCompany:
 *   post:
 *     tags: [DesignCompany]
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
 *               - DesignCompanyBuyPrice
 *             properties:
 *               DesignCompanyBuyPrice:
 *                 type: number
 *               Company_idCompany:
 *                 type: integer
 *               Design_idDesign:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createdesignCompany', validateSchema(designCompanySchema.createDesignCompanySchema), validateAdmin(), designCompanyController.createDesignCompany);


/**
 * @swagger
 * /designCompany/updatedesignCompany:
 *   put:
 *     tags: [DesignCompany]
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
 *               - DesignCompanyBuyPrice
 *             properties:
 *               DesignCompanyBuyPrice:
 *                 type: number
 *               Company_idCompany:
 *                 type: integer
 *               Design_idDesign:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */
router.put('/updatedesignCompany', validateSchema(designCompanySchema.updateDesignCompanySchema), validateAdmin(), designCompanyController.updateDesignCompany);



module.exports = router;