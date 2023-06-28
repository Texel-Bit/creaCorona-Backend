const express = require("express");
const sysUserRoutes = require("./sysUser");
const companyRoutes = require("./company");
const desingTypeRoutes = require("./designType");
const brechaRoutes = require("./brecha");
const designColorsRoutes = require("./designColors");
const designTypeFormatSizeRoutes = require("./designTypeFormatSize");
const designRoutes = require("./design");
const formatSizeTextureRoutes = require("./formatSizeTexture");
const environmentTypeRoutes = require("./environmentType");
const environmentRoutes = require("./environment");
const designCompanyRoutes = require("./designCompany");
const mosaicTypeRoutes = require("./mosaicType");
const companyZoneRoutes = require("./companyZone");
const bundleRoutes = require("./bundle");
const officeRoutes = require("./office");
const bundleCompanyPriceRoutes = require("./bundleCompanyPrice");
const companyTypeRoutes = require("./companyType");
const quotationRoutes = require("./quotation");
const quotationStatusRoutes=require("./quotationStatus")
const userRoleRoutes=require("./userRole")

const designColorTypeRoutes=require("./designColorType")

const stateRoutes=require("./state")
const designColorBundleRoutes=require("./designColorBundle")



const app = express();
app.use("/state", stateRoutes);
app.use("/designColorBundle", designColorBundleRoutes);

app.use("/designColorType", designColorTypeRoutes);

app.use("/userRole", userRoleRoutes);

app.use("/quotationStatus", quotationStatusRoutes);
app.use("/bundleCompanyPrice", bundleCompanyPriceRoutes);
app.use("/companyType", companyTypeRoutes);
app.use("/quotation", quotationRoutes);
app.use("/companyZone", companyZoneRoutes);
app.use("/bundle", bundleRoutes);
app.use("/office", officeRoutes);
app.use("/sysUser", sysUserRoutes);
app.use("/mosaicType", mosaicTypeRoutes);
app.use("/company", companyRoutes);
app.use("/desingType", desingTypeRoutes);
app.use("/brecha", brechaRoutes);
app.use("/designColors", designColorsRoutes);
app.use("/designTypeFormatSize", designTypeFormatSizeRoutes);
app.use("/design", designRoutes);
app.use("/formatSizeTexture", formatSizeTextureRoutes);
app.use("/environmentType", environmentTypeRoutes);
app.use("/environment", environmentRoutes);
app.use("/designCompany", designCompanyRoutes);

module.exports = app;
