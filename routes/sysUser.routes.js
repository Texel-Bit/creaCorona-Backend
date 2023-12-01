
const express = require('express');
const router = express.Router();
const sysUserController = require('../controllers/sysUser.controller');
const {authenticateJWT, validateAdmin} = require('../middlewares/authMiddleware'); // Assuming you have a middleware for JWT authentication
const sysuserSchemas = require('../joiSchemas/sysUser.schema');
const validateSchema = require('../middlewares/joiMiddleware');


/**
 * @swagger
 * /sysUser/register:
 *   post:
 *     tags:
 *       - SysUser
 *     summary: Register a new system user
 *     requestBody:
 *       description: System user data to register
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               office_idoffice:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 */
router.post('/register', validateSchema(sysuserSchemas.registerSchema), sysUserController.registerUser);

/**
 * @swagger
 * /sysUser/activate/{token}:
 *   get:
 *     tags:
 *       - SysUser
 *     summary: Activate a system user
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: redirect
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/activate/:token', sysUserController.activateUser);

/**
 * @swagger
 * /sysUser/login:
 *   post:
 *     tags:
 *       - SysUser
 *     summary: Log in a system user
 *     requestBody:
 *       description: Login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Bad Request
 */
router.post('/login', validateSchema(sysuserSchemas.loginSchema), sysUserController.loginUser);

router.post('/loginSwwager', validateSchema(sysuserSchemas.loginSchema), sysUserController.loginSwwager);

/**
 * @swagger
 * /sysUser/getAllSysUsers:
 *   get:
 *     tags:
 *       - SysUser
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllSysUsers', authenticateJWT, sysUserController.getAllSysUsers );

/**
 * @swagger
 * /sysUser/getAllSysUsersByCompany/{companyId}:
 *   get:
 *     tags:
 *       - SysUser
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
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
router.get('/getAllSysUsersByCompany/:companyId', validateAdmin(), sysUserController.getAllSysUsersByCompany );


/**
 * @swagger
 * /sysUser/getAllUserRoles:
 *   get:
 *     tags:
 *       - SysUser
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllUserRoles', authenticateJWT, sysUserController.getAllUserRoles );

/**
 * @swagger
 * /sysUser/getAllUserStatus:
 *   get:
 *     tags:
 *       - SysUser
 *     security:
 *       - bearerAuth: []
 *     summary: Activate a system user
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/getAllUserStatus', authenticateJWT, sysUserController.getAllUserStatus );

/**
 * @swagger
 * /sysUser/updateSysUser/{id}:
 *   put:
 *     tags:
 *       - SysUser
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
 *               userName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: integer
 *               userRole_iduserRole:
 *                 type: integer
 *               userStatus_iduserStatus:
 *                 type: integer
 *               office_idoffice:
 *                 type: integer
 *     responses:
 *       200:
 *         description: environment type updated successfully
 *       400:
 *         description: Bad Request
 */
router.put('/updateSysUser/:id', validateSchema(sysuserSchemas.updateSysUser), validateAdmin(), sysUserController.updateSysUser);

/**
 * @swagger
 * /sysUser/getUserByCompanyId/{id}:
 *   get:
 *     tags: [SysUser]
 *     summary: Get an SysUser by ID
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
 *         description: SysUser fetched successfully
 */
router.get('/getUserByCompanyId/:id', authenticateJWT, sysUserController.getUserByCompanyId);

module.exports = router;
