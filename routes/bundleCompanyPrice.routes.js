const express = require('express');
const router = express.Router();
const bundleCompanyPriceController = require('../controllers/bundleCompanyPrice.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const bundleCompanyPriceSchema = require('../joiSchemas/bundleCompanyPrice.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: BundleCompanyPrice
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /bundleCompanyPrice/getAllBundleCompanyPrices:
 *   get:
 *     tags:
 *       - BundleCompanyPrice
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllBundleCompanyPrices', authenticateJWT, bundleCompanyPriceController.getAllBundleCompanyPrices);


/**
 * @swagger
 * /bundleCompanyPrice/getAllBundleCompanyPricesByFormatSizeTexture/{id}:
 *   get:
 *     tags:
 *       - BundleCompanyPrice
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllBundleCompanyPricesByFormatSizeTexture/:id', authenticateJWT, bundleCompanyPriceController.getAllBundleCompanyPricesByFormatSizeTexture);



/**
 * @swagger
 * /bundleCompanyPrice/createBundleCompanyPrice:
 *   post:
 *     tags: [BundleCompanyPrice]
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
 *               - bundle_idbundle 
 *             properties:
 *               bundle_idbundle:
 *                 type: integer
 *               companyZone_idcompanyZone:
 *                 type: integer
 *               companyType_idcompanyType:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createBundleCompanyPrice', validateSchema(bundleCompanyPriceSchema.createBundleCompanyPriceSchema), validateAdmin(), bundleCompanyPriceController.createBundleCompanyPrice);


/**
 * @swagger
 * /bundleCompanyPrice/updateBundleCompanyPrice/{bundleId}:
 *   put:
 *     tags:
 *       - BundleCompanyPrice
 *     summary: Update an environment type by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bundleId
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
 *               companyZone_idcompanyZone:
 *                 type: integer
 *               companyType_idcompanyType:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateBundleCompanyPrice/:bundleId', validateSchema(bundleCompanyPriceSchema.updateBundleCompanyPriceSchema), validateAdmin(), bundleCompanyPriceController.updateBundleCompanyPrice);

/**
 * @swagger
 * /bundleCompanyPrice/getBundleCompanyPriceByFormatZiseTexture:
 *   post:
 *     tags: [BundleCompanyPrice]
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
 *               - FormatSizeTexture_idFormatSizeTexture
 *             properties:
 *               FormatSizeTexture_idFormatSizeTexture:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */
router.post('/getBundleCompanyPriceByFormatZiseTexture', authenticateJWT, bundleCompanyPriceController.getBundleCompanyPriceByFormatZiseTexture);


module.exports = router;