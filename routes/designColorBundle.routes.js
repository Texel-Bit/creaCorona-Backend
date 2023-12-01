const express = require('express');
const router = express.Router();
const designColorBundleController = require('../controllers/designColorBundle.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designColorBundleSchema = require('../joiSchemas/designColorBundle.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: DesignColorBundle
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designColorBundle/getAllDesignColorBundles:
 *   get:
 *     tags:
 *       - DesignColorBundle
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignColorBundles', authenticateJWT, designColorBundleController.getAllDesignColorBundles);


/**
 * @swagger
 * /designColorBundle/createdesignColorBundle:
 *   post:
 *     tags: [DesignColorBundle]
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
 *               - DesignColorBundleName
 *             properties:
 *               DesignColorBundleName:
 *                 type: string
 *                 maxLenght: 45
 *               DesignType_idDesignType :
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createdesignColorBundle', validateSchema(designColorBundleSchema.createDesignColorBundleSchema), validateAdmin(), designColorBundleController.createDesignColorBundle);


/**
 * @swagger
 * /designColorBundle/updatedesignColorBundle/{id}:
 *   put:
 *     tags:
 *       - DesignColorBundle
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
 *               DesignColorBundleName:
 *                 type: string
 *                 maxLenght: 45
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updatedesignColorBundle/:id', validateSchema(designColorBundleSchema.updateDesignColorBundleSchema), validateAdmin(), designColorBundleController.updateDesignColorBundle);


/**
 * @swagger
 * /designColorBundle/deleteDesignColorBundle/{id}:
 *   delete:
 *     tags: [DesignColorBundle]
 *     summary: Delete an DesignColorBundle by ID
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
router.delete('/deleteDesignColorBundle/:id', validateAdmin(), designColorBundleController.deleteDesignColorBundle);

/**
 * @swagger
 * /designColorBundle/getAllDesignColorBundleByFilters:
 *   post:
 *     tags: [DesignColorBundle]
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
 *               - DesignType_idDesignType
 *               - DesignColorType_idDesignColorType
 *               - EnvironmentType_idEnvironmentType
 *             properties:
 *               DesignType_idDesignType:
 *                 type: integer
 *               DesignColorType_idDesignColorType:
 *                 type: integer
 *               EnvironmentType_idEnvironmentType:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/getAllDesignColorBundleByFilters', validateSchema(designColorBundleSchema.getAllDesignColorBundleByFiltersSchema), designColorBundleController.getAllDesignColorBundleByFilters);


module.exports = router;