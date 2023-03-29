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

const app = express();
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
