const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.countEnvironmentTypesUsedInQuotations = async (startDate, endDate, limit) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions.where = {
            quotationDate: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };
    }

    const groupedResults = await prisma.quotation.groupBy({
        by: ['Environment_idEnvironment'],
        _count: {
            Environment_idEnvironment: true
        },
        ...conditions,
        orderBy: {
            _count: {
                Environment_idEnvironment: 'desc'
            }
        },
    });

    // Apply dynamic limit
    const limitedResults = limit ? groupedResults.slice(0, limit) : groupedResults;

    // Fetch the environment details for each grouped result
    const resultsWithEnvironmentInfo = await Promise.all(
        limitedResults.map(async (result) => {
            const environment = await prisma.environment.findUnique({
                where: { idEnvironment: result.Environment_idEnvironment },
                select: {
                    idEnvironment: true,
                    EnvironmentName: true,
                    EnvironmentProfileImage: true,
                    EnvironmentType: {
                        select: {
                            EnvironmentTypeName: true, // Assuming 'EnvironmentTypeName' is a field in 'EnvironmentType'
                        },
                    },
                },
            });
            return {
                count: result._count.Environment_idEnvironment,
                environment: environment || null, // Include environment details or null if not found
            };
        })
    );
    

    return resultsWithEnvironmentInfo;
};


exports.countEnvironmentTypeInQuotations = async (startDate, endDate) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions = {
            where: {
                quotationDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        };
    }

    const environmentTypes = await prisma.quotation.findMany({
        ...conditions,
        select: {
            Environment: {
                select: {
                    EnvironmentType: {
                        select: {
                            idEnvironmentType: true,
                            EnvironmentTypeName: true,
                        }
                    }
                }
            }
        }
    });

    // Group and count by EnvironmentType
    const counts = environmentTypes.reduce((acc, { Environment }) => {
        const typeId = Environment.EnvironmentType.idEnvironmentType;
        if (!acc[typeId]) {
            acc[typeId] = {
                environmentTypeName: Environment.EnvironmentType.EnvironmentTypeName,
                count: 1
            };
        } else {
            acc[typeId].count += 1;
        }
        return acc;
    }, {});

    return Object.values(counts);
};

exports.countDesignTypesUsedInQuotations = async (startDate, endDate) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions = {
            where: {
                quotationDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        };
    }

    const quotations = await prisma.quotation.findMany({
        ...conditions,
        include: {
            FormatSizeTexture: {
                include: {
                    DesignTypeFormatSize: {
                        include: {
                            DesignType: true
                        }
                    }
                }
            }
        }
    });

    // Count DesignType occurrences
    const designTypeCounts = {};
    quotations.forEach(({ FormatSizeTexture }) => {
        const designTypeId = FormatSizeTexture.DesignTypeFormatSize.DesignType.idDesignType;
        if (designTypeCounts[designTypeId]) {
            designTypeCounts[designTypeId].count++;
        } else {
            designTypeCounts[designTypeId] = {
                designTypeName: FormatSizeTexture.DesignTypeFormatSize.DesignType.DesignTypeName,
                designTypeImage:FormatSizeTexture.DesignTypeFormatSize.DesignType.DesignTypeIconPath,
                count: 1
            };
        }
    });

    // Convert the object into an array and sort by count in descending order
    return Object.values(designTypeCounts).sort((a, b) => b.count - a.count);
};

exports.getDesignRankingInQuotations = async (startDate, endDate, limit) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions = {
            where: {
                quotationDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        };
    }

    const quotations = await prisma.quotation.findMany({
        ...conditions,
        include: {
            quotationProductDetails: {
                include: {
                    Design: true // Assuming Design includes the image path
                }
            }
        }
    });

    // Count Design occurrences and include image
    const designCounts = {};
    quotations.forEach(({ quotationProductDetails }) => {
        quotationProductDetails.forEach(({ Design }) => {
            const designId = Design.idDesign;
            if (designCounts[designId]) {
                designCounts[designId].count++;
            } else {
                designCounts[designId] = {
                    designName: Design.DesignName,
                    designImage: Design.DesignImagePath, // Include the design image path
                    count: 1
                };
            }
        });
    });

    // Convert to array and sort by count
    const sortedDesigns = Object.values(designCounts).sort((a, b) => b.count - a.count);

    // Apply dynamic limit
    return limit ? sortedDesigns.slice(0, limit) : sortedDesigns;
};

exports.getDesignColorsRanking = async (startDate, endDate, colorType, limit) => {
    let whereConditions = {};

    if (startDate && endDate) {
        whereConditions['quotation.quotationDate'] = {
            gte: new Date(startDate),
            lte: new Date(endDate)
        };
    }

    if (colorType) {
        whereConditions['DesignColors'] = {
            DesignColorType_idDesignColorType: colorType
        };
    }

    const designColorUsage = await prisma.DesignColors_has_quotation.findMany({
        where: whereConditions,
        include: {
            DesignColors: true // Assumes this includes color name and image path
        }
    });

    // Count DesignColor occurrences
    const colorCounts = {};
    designColorUsage.forEach(({ DesignColors }) => {
        const colorId = DesignColors.idDesignColors;
        if (colorCounts[colorId]) {
            colorCounts[colorId].count++;
        } else {
            colorCounts[colorId] = {
                colorName: DesignColors.DesignColorName,
                colorImage: DesignColors.DesignColorPath, // Image path attribute
                count: 1
            };
        }
    });

    // Convert to array, sort by count, and apply limit
    const sortedColors = Object.values(colorCounts).sort((a, b) => b.count - a.count);
    return limit ? sortedColors.slice(0, limit) : sortedColors;
};



exports.getFormatSizeTextureRanking = async (startDate, endDate, limit) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions.where = {
            quotationDate: { // Assuming 'quotationDate' is the correct date field
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };
    }

    const textureUsage = await prisma.quotation.findMany({
        ...conditions,
        select: {
            FormatSizeTexture: {
                select: {
                    idFormatSizeTexture: true,
                    FormatSizeTextureName: true,
                    FormatSizeTextureMaskPath: true,
                    DesignTypeFormatSize: {
                        select: {
                            DesignTypeFormatSizeName: true
                        }
                    }
                }
            }
        }
    });

    const textureCounts = textureUsage.reduce((acc, { FormatSizeTexture }) => {
        const textureId = FormatSizeTexture.idFormatSizeTexture;
        if (!acc[textureId]) {
            acc[textureId] = {
                count: 1,
                FormatSizeTextureName: FormatSizeTexture.FormatSizeTextureName,
                FormatSizeTextureMaskPath: FormatSizeTexture.FormatSizeTextureMaskPath,
                FormatSize: FormatSizeTexture.DesignTypeFormatSize.DesignTypeFormatSizeName
            };
        } else {
            acc[textureId].count += 1;
        }
        return acc;
    }, {});

    const sortedTextures = Object.entries(textureCounts)
                                 .map(([id, data]) => ({ id, ...data }))
                                 .sort((a, b) => b.count - a.count);

    return limit ? sortedTextures.slice(0, limit) : sortedTextures;
};



exports.getDesignTypeFormatSizeRanking = async (startDate, endDate, limit) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions.where = {
            quotationDate: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };
    }

    const formatSizeUsage = await prisma.quotation.findMany({
        ...conditions,
        select: {
            FormatSizeTexture: {
                include: {
                    DesignTypeFormatSize: {
                        
                        select:{
                            idDesignTypeFormatSize:true,
                            DesignTypeFormatSizeName:true,
                            DesignType:{
                                select:{
                                    DesignTypeIconPath:true
                                }
                               
                            }
                        }
                    }
                }
            }
        }
    });



    const formatSizeCounts = formatSizeUsage.reduce((acc, item) => {
        const formatSizeId = item.FormatSizeTexture?.DesignTypeFormatSize?.idDesignTypeFormatSize;
        if (formatSizeId) {
            if (!acc[formatSizeId]) {
                acc[formatSizeId] = {
                    count: 1,
                    // Add any additional fields you want from DesignTypeFormatSize
                    designTypeFormatSizeName: item.FormatSizeTexture.DesignTypeFormatSize.DesignTypeFormatSizeName,
                    designTypeImage: item.FormatSizeTexture.DesignTypeFormatSize.DesignType.DesignTypeIconPath
                };
            } else {
                acc[formatSizeId].count += 1;
            }
        }
        return acc;
    }, {});

    const sortedFormatSizes = Object.values(formatSizeCounts)
                                    .sort((a, b) => b.count - a.count);

    return limit ? sortedFormatSizes.slice(0, limit) : sortedFormatSizes;
};


exports.getGroutRanking = async (startDate, endDate, limit) => {
    let conditions = {};
    if (startDate && endDate) {
        conditions.where = {
            quotationDate: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };
    }

    const groutUsage = await prisma.quotation.findMany({
        ...conditions,
        select: {
            grout: {
                select: {
                    idgrout: true, 
                    groutName:true,
                    groutColorPath:true
                }
            }
        }
    });


    const groutCounts = groutUsage.reduce((acc, { grout }) => {
        if (!grout) return acc; 

        const groutId = grout.idgrout;
        if (!acc[groutId]) {
            acc[groutId] = {
                count: 1,
                groutName: grout.groutName, // Example of additional field
                groutColorPath:grout.groutColorPath
            };
        } else {
            acc[groutId].count += 1;
        }
        return acc;
    }, {});

    console.log(groutCounts)

    const sortedGrouts = Object.entries(groutCounts)
                               .map(([id, count]) => ({ id, count }))
                               .sort((a, b) => b.count.count - a.count.count);

    return limit ? sortedGrouts.slice(0, limit) : sortedGrouts;
};

exports.getSessionsAverageTime = async (startDate,endDate) => {

    let whereClause = {
        sessionStartDate: { not: null },
        sessionEndDate: { not: null }
    };

    if (startDate) {
        whereClause.sessionStartDate.gte = new Date(startDate);
    }
    if (endDate) {
        whereClause.sessionEndDate.lte = new Date(endDate);
    }

    const sessions = await prisma.session.findMany({
        where: {
            ...whereClause,
            sessionStartDate: { not: null },
            sessionEndDate: { not: null }
        }
    });


    if (sessions.length === 0) {
        return 0;
    }

    const totalDuration = sessions.reduce((total, session) => {
        const start = new Date(session.sessionStartDate);
        const end = new Date(session.sessionEndDate);
        return total + (end - start);
    }, 0);

    const averageDuration = totalDuration / sessions.length;
    return averageDuration/1000; 
};

exports.getFinishedSessionsCount = async (startDate, endDate) => {

    let whereClause = {};

    if (startDate && endDate) {
        whereClause = {
            sessionEndDate: {
                not: null,
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };
    } else if (startDate) {
        whereClause = {
            sessionEndDate: {
                not: null,
                gte: new Date(startDate)
            }
        };
    } else if (endDate) {
        whereClause = {
            sessionEndDate: {
                not: null,
                lte: new Date(endDate)
            }
        };
    }

    return await prisma.session.count({
        where: whereClause
    });
};


exports.getQuotationsCount = async (startDate, endDate) => {
    let whereClause = {};

    if (startDate && endDate) {
        whereClause = {
            // Assuming 'createdAt' or 'date' is the field you want to filter by
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        };
    }

    return await prisma.quotation.count({ where: whereClause });
};








  
  
  


