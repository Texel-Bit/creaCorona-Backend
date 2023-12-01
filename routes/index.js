const express = require('express');
const templateRoutes = require('./template.routes');
const sysUserRoutes = require('./sysUser.routes');
const environmentTypeRoutes = require('./environmentType.routes');
const environmentRoutes = require('./environment.routes');
const mosaicTypeRoutes = require('./mosaicType.routes');
const designColorsRoutes = require('./designColors.routes');
const groutRoutes = require('./grout.routes');
const bundleRoutes = require('./bundle.routes');
const bundleCompanyPriceRoutes = require('./bundleCompanyPrice.routes');
const designColorBundleRoutes = require('./designColorBundle.routes');
const companyRoutes = require('./company.routes');
const companyTypeRoutes = require('./companyType.routes');
const companyZoneRoutes = require('./companyZone.routes');
const designRoutes = require('./design.routes');
const designColorInBundleRoutes = require('./designColorInBundle.routes');
const designCompanyRoutes = require('./designCompany.routes');
const designTypeFormatSizeRoutes = require('./designTypeFormatSize.routes');
const formatSizeTextureRoutes = require('./formatSizeTexture.routes');
const officeRoutes = require('./office.routes');
const quotationStatusRoutes = require('./quotationStatus.routes');
const stateRoutes = require('./state.routes');
const designColorTypeRoutes = require('./designColorType.routes');
const designTypeRoutes = require('./designType.routes');
const companyStatusRoutes = require('./companyStatus.routes');
const quotationRoutes = require('./quotation.routes');
const bundlePricesByZoneRoutes = require('./bundlePricesByZone.routes')
const dashboardRoutes = require('./dashboard.routes')
const sessionRoutes = require('./session.routes')

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.use('/Template', templateRoutes);
router.use('/sysUser', sysUserRoutes);
router.use('/environmentType', environmentTypeRoutes);
router.use('/environment', environmentRoutes);
router.use('/mosaicType', mosaicTypeRoutes);
router.use('/designColors', designColorsRoutes);
router.use('/grout', groutRoutes);
router.use('/bundle', bundleRoutes);
router.use('/bundleCompanyPrice', bundleCompanyPriceRoutes);
router.use('/designColorBundle', designColorBundleRoutes);
router.use('/company', companyRoutes);
router.use('/companyType', companyTypeRoutes);
router.use('/companyZone', companyZoneRoutes);
router.use('/design', designRoutes);
router.use('/designColorInBundle', designColorInBundleRoutes);
router.use('/designCompany', designCompanyRoutes);
router.use('/designTypeFormatSize', designTypeFormatSizeRoutes);
router.use('/formatSizeTexture', formatSizeTextureRoutes);
router.use('/office', officeRoutes);
router.use('/quotationStatus', quotationStatusRoutes);
router.use('/state', stateRoutes);
router.use('/designColorType', designColorTypeRoutes);
router.use('/designType', designTypeRoutes);
router.use('/companyStatus', companyStatusRoutes);
router.use('/quotation', quotationRoutes);
router.use('/bundlePricesByZone', bundlePricesByZoneRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/session', sessionRoutes)


module.exports = router;
