const express = require('express');
const router = express.Router();
const bundlePricesByZoneController = require('../controllers/bundlePricesByZone.controller');
const {authenticateJWT, validateAdmin} = require('../middlewares/authMiddleware'); // Assuming you have a middleware for JWT authentication
const bundlePricesByZoneSchema = require('../joiSchemas/bundlePricesByZone.schema');
const validateSchema = require('../middlewares/joiMiddleware');

/**
 * @swagger
 * /bundlePricesByZone/getAllBundlePricesByZones:
 *   get:
 *     tags:
 *       - BundlePricesByZone
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllBundlePricesByZones', authenticateJWT, bundlePricesByZoneController.getAllBundlePricesByZone);

/**
 * @swagger
 * /bundlePricesByZone/updateBundlePricesByZone/{id}:
 *   put:
 *     tags:
 *       - BundlePricesByZone
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
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateBundlePricesByZone/:id', validateSchema(bundlePricesByZoneSchema.updateBundlePriceByZoneSchema), validateAdmin(), bundlePricesByZoneController.updateBundlePriceByZone);


module.exports = router;
