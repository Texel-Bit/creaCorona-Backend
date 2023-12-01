const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateJWT } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard Management
 */

/**
 * @swagger
 * /dashboard/environmentRanking:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Counts the usage of each environment type within quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date to filter usage
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date to filter usage
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit the number of results returned
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with count of environment types used in quotations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/environmentRanking', authenticateJWT, dashboardController.countEnvironmentTypesUsedInQuotations);



/**
 * @swagger
 * /dashboard/environmentType:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Counts the usage of each environment type in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date to filter usage
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date to filter usage
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with count of environment types used in quotations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/environmentType', authenticateJWT, dashboardController.countEnvironmentTypeInQuotations);

/**
 * @swagger
 * /dashboard/designTypes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Counts the usage of each design type in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date to filter usage
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date to filter usage
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with count of design types used in quotations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/designTypes', authenticateJWT, dashboardController.countDesignTypesUsedInQuotations);


/**
 * @swagger
 * /dashboard/designs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the ranking of designs used in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date to filter usage
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date to filter usage
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit the number of results returned
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with ranking of designs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/designs', authenticateJWT, dashboardController.getDesignRankingInQuotations);


/**
 * @swagger
 * /dashboard/designColors:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the ranking of design colors used in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date to filter usage
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date to filter usage
 *       - in: query
 *         name: colorType
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by specific color type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit the number of results returned
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with ranking of design colors
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/designColors', authenticateJWT, dashboardController.getDesignColorsRanking);


/**
 * @swagger
 * /dashboard/structure:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the ranking of Format Size Textures used in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Maximum number of results to return
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with ranking of format size textures
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/structure', authenticateJWT, dashboardController.getFormatSizeTextureRanking);

/**
 * @swagger
 * /dashboard/designTypeFormatSize:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the ranking of Design Type Format Sizes used in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Maximum number of results to return
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with ranking of design type format sizes
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/designTypeFormatSize', authenticateJWT, dashboardController.getDesignTypeFormatSizeRanking);

/**
 * @swagger
 * /dashboard/grouts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the ranking of Grouts used in quotations
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Maximum number of results to return
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successful response with ranking of grouts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/grouts', authenticateJWT, dashboardController.getGroutRanking);

/**
 * @swagger
 * /dashboard/GetSessionsAverageTime:
 *   get:
 *     summary: Get the average session time within a date range
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date of the range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date of the range
 *     responses:
 *       200:
 *         description: Average session time in seconds within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageTime:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get('/GetSessionsAverageTime', dashboardController.getSessionsAverageTime);


/**
 * @swagger
 * /dashboard/getFinishedSessionsCount:
 *   get:
 *     summary: Get the count of finished sessions within a date range
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date of the range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date of the range
 *     responses:
 *       200:
 *         description: Count of finished sessions within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finishedSessionsCount:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/getFinishedSessionsCount', dashboardController.getFinishedSessionsCount);

/**
 * @swagger
 * /dashboard/getQuotationsCount:
 *   get:
 *     summary: Get the count of all quotations within a date range
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date of the range (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date of the range (inclusive)
 *     responses:
 *       200:
 *         description: Count of all quotations within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quotationsCount:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/getQuotationsCount', dashboardController.getQuotationsCount);

module.exports = router;
