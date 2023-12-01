const express = require('express');
const router = express.Router();
const companyZoneController = require('../controllers/companyZOne.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: CompanyStatus
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /CompanyStatus/getAllCompanyStatus:
 *   get:
 *     tags:
 *       - CompanyStatus
 *     summary: Get All Company Status
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllCompanyStatus', companyZoneController.getAllCompanyStatus);





module.exports = router;