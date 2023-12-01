const express = require('express');
const templateController = require('../controllers/template.controller');
const { authenticateJWT } = require('../middlewares/authMiddleware');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Template
 *   description: Template management
 */

/**
 * @swagger
 * /api/Template/login:
 *   post:
 *     tags: 
 *       - Template
 *     summary: Log in a template
 *     description: Log in with a template's email and password.
 *     requestBody:
 *       description: Template email and password.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TemplateEmail
 *               - TemplatePassword
 *             properties:
 *               TemplateEmail:
 *                 type: string
 *                 default: "manuel.garcia.jaimes@gmail.com"
 *               TemplatePassword:
 *                 type: string
 *                 default: "123456"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Authentication failed
 */

router.post('/login', templateController.loginTemplate);



/**
 * @swagger
 * /api/Template/CreateTemplate:
 *   post:
 *     tags: [Template]
 *     summary: Create a new template
 *     description: Create a new template in the system.
 *     parameters:
 *       - in: body
 *         name: Template
 *         description: The template to create.
 *         schema:
 *           type: object
 *           required:
 *             - TemplateEmail
 *             - TemplatePassword
 *             - TemplateTableName
 *           properties:
 *             TemplateEmail:
 *               type: string
 *             TemplatePassword:
 *               type: string
 *             TemplateTableName:
 *               type: string
 *             TemplateTableAge:
 *               type: integer
 *             TemplateTableRegisterDate:
 *               type: string
 *               format: date-time
 *             TemplateTableHaveBooleanData:
 *               type: integer
 *             TemplateTableWeight:
 *               type: string
 *     responses:
 *       200:
 *         description: Template created successfully
 */
router.post('/CreateTemplate', templateController.createTemplate);

/**
 * @swagger
 * /api/Template/GetAllTemplates:
 *   get:
 *     tags: [Template]
 *     summary: Get all templates
 *     description: Fetch all templates from the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Templates fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/GetAllTemplates', authenticateJWT, templateController.getAllTemplates);

/**
 * @swagger
 * /api/Template/GetTemplateById/{id}:
 *   get:
 *     summary: Get a template by ID
 *     tags: [Template]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     description: Fetch a single template by ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/GetTemplateById/:id', authenticateJWT, templateController.getTemplateById);

/**
 * @swagger
 * /api/Template/UpdateTemplate/{id}:
 *   put:
 *     summary: Update a template by ID
 *     tags: [Template]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Template data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TemplateTableName:
 *                 type: string
 *               TemplateTableAge:
 *                 type: integer
 *               TemplateTableHaveBooleanData:
 *                 type: integer
 *               TemplateTableWeight:
 *                 type: string
 *     description: Update a single template by ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/UpdateTemplate/:id', authenticateJWT, templateController.updateTemplate);


/**
 * @swagger
 * /api/Template/SendMail:
 *   post:
 *     summary: Send an email template
 *     tags: [Template]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: The email details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     description: Send an email using a template.
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       401:
 *         description: Unauthorized
 */

router.post('/SendMail', authenticateJWT, templateController.sendMailTemplate);

module.exports = router;