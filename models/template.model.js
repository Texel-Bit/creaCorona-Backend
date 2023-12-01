const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTemplate = async (data) => {
  return await prisma.templateTable.create({
    data,
  });
};

exports.getAllTemplates = async () => {
  return await prisma.templateTable.findMany();
};

exports.getTemplateById = async (id) => {
  return await prisma.templateTable.findUnique({
    where: {
      idTemplateTable: id,
    },
  });
};

exports.updateTemplate = async (id, data) => {

  return await prisma.templateTable.update({
    where: {
      idTemplateTable: id,
    },
    data,
  });
};

exports.deleteTemplate = async (id) => {
  return await prisma.templateTable.delete({
    where: {
      idTemplateTable: id,
    },
  });
};

exports.getTemplateByEmail = async (email) => {
  return await prisma.templateTable.findFirst({
    where: {
      TemplateEmail: email,
    },
  });
};