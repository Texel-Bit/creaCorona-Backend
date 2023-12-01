const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const CompanySchema = require('../joiSchemas/company.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const StorageHandler = require('../middlewares/StorageHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * @swagger
 * tags:
 *   name: Company
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /Company/getAllCompanys:
 *   get:
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllCompanys', authenticateJWT, companyController.getAllCompanys);

/**
 * @swagger
 * /Company/getAllCompanyRoles:
 *   get:
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllCompanyRoles', authenticateJWT, companyController.getAllCompanyRoles);

/**
 * @swagger
 * /company/createCompany:
 *   post:
 *     tags: [Company]
 *     summary: Create a new Company type configuration
 *     description: Create a new Company type configuration in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               CompanyName:
 *                 type: string
 *               CompanyAddress:
 *                 type: string
 *               CompanyEmail:
 *                 type: string
 *               CompanyContactName:
 *                 type: string
 *               CompanyCode:
 *                 type: string
 *               CompanyNIT:
 *                 type: string
 *               CompanyPhone:
 *                 type: string
 *               companyStatus_idcompanyStatus:
 *                 type: integer
 *               CompanyRole_idCompanyRole:
 *                 type: integer
 *               companyType_idcompanyType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company type configuration created successfully
 *     components:
 *       schemas:
 *         Company:
 *           type: object
 *           properties:
 *             CompanyName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */

router.post('/createCompany',upload.fields([{ name: 'CompanyName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(CompanySchema.createCompanySchema),*/ validateAdmin(), companyController.createCompany);


/**
 * @swagger
 * /company/updateCompany/{id}:
 *   put:
 *     tags:
 *       - Company
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
 *               CompanyName:
 *                 type: string
 *               CompanyAddress:
 *                 type: string
 *               CompanyEmail:
 *                 type: string
 *               CompanyContactName:
 *                 type: string
 *               CompanyCode:
 *                 type: string
 *               CompanyNIT:
 *                 type: string
 *               CompanyPhone:
 *                 type: string
 *               companyStatus_idcompanyStatus:
 *                 type: integer
 *               CompanyRole_idCompanyRole:
 *                 type: integer
 *               companyType_idcompanyType:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company type configuration created successfully
 *     components:
 *       schemas:
 *         Company:
 *           type: object
 *           properties:
 *             CompanyName:
 *               type: string
 *             image:
 *               type: string
 *               format: binary
 */
router.put('/updateCompany/:id', upload.fields([{ name: 'CompanyName' }, { name: 'image' }]),StorageHandler.processImageFields(['image']), /*validateSchema(CompanySchema.createCompanySchema),*/ validateAdmin(), companyController.updateCompany);



module.exports = router;