const express = require('express');
const router = express.Router();
const colorDesignColorInBundleController = require('../controllers/designColorInBundle.controller');
const validateSchema = require('../middlewares/joiMiddleware');
const designColorInBundleSchema = require('../joiSchemas/designColorInBundle.schema');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: DesignColorInBundle
 *   description: environment type configuration management
 */

/**
 * @swagger
 * /designColorInBundle/getAllDesignColorInBundle:
 *   get:
 *     tags:
 *       - DesignColorInBundle
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllDesignColorInBundle', authenticateJWT, colorDesignColorInBundleController.getAllDesignColorInBundle);


/**
 * @swagger
 * /designColorInBundle/createdesignColorInBundle:
 *   post:
 *     tags: [DesignColorInBundle]
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
 *               - DesignColorBundle_idDesignColorBundle
 *             properties:
 *               DesignColorBundle_idDesignColorBundle:
 *                 type: integer
 *               DesignColors_idDesignColors:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.post('/createdesignColorInBundle', validateSchema(designColorInBundleSchema.createDesignColorInBundleSchema), validateAdmin(), colorDesignColorInBundleController.createDesignColorInBundle);

/**
 * @swagger
 * /designColorInBundle/deleteDesignColorInBundle:
 *   delete:
 *     tags: [DesignColorInBundle]
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
 *               - DesignColorBundle_idDesignColorBundle
 *               - DesignColors_idDesignColors 
 *             properties:
 *               DesignColorBundle_idDesignColorBundle:
 *                 type: integer
 *               DesignColors_idDesignColors:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type configuration created successfully
 */

router.delete('/deleteDesignColorInBundle/', authenticateJWT, colorDesignColorInBundleController.deleteDesignColorInBundle);


module.exports = router;