const dashboardModel = require('../models/dashboard.model');
const AnswerManager = require('../middlewares/AnswerManager');


exports.countEnvironmentTypesUsedInQuotations = async (req, res) => {
    try {
      const { startDate, endDate, limit } = req.query;
      const limitNumber = limit ? parseInt(limit, 10) : undefined;
      const counts = await dashboardModel.countEnvironmentTypesUsedInQuotations(startDate, endDate, limitNumber);
      AnswerManager.handleSuccess(res, counts);
    } catch (error) {
      console.error(error);
      AnswerManager.handleError(res, error);
    }
  };
  

  exports.countEnvironmentTypeInQuotations = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const counts = await dashboardModel.countEnvironmentTypeInQuotations(startDate, endDate);
        AnswerManager.handleSuccess(res, counts);
    } catch (error) {
        console.error(error);
        AnswerManager.handleError(res, error);
    }
};

exports.countDesignTypesUsedInQuotations = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const counts = await dashboardModel.countDesignTypesUsedInQuotations(startDate, endDate);
        AnswerManager.handleSuccess(res, counts);
    } catch (error) {
        console.error(error);
        AnswerManager.handleError(res, error);
    }
};

exports.getDesignRankingInQuotations = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const limitNumber = limit ? parseInt(limit, 10) : undefined;
        const ranking = await dashboardModel.getDesignRankingInQuotations(startDate, endDate, limitNumber);
        AnswerManager.handleSuccess(res, ranking);
    } catch (error) {
        console.error(error);
        AnswerManager.handleError(res, error);
    }
};

exports.getDesignColorsRanking = async (req, res) => {
    try {
        const { startDate, endDate, colorType, limit } = req.query;
        const limitNumber = limit ? parseInt(limit, 10) : undefined;
        const colorTypeNumber = colorType ? parseInt(colorType, 10) : undefined;
        const ranking = await dashboardModel.getDesignColorsRanking(startDate, endDate, colorTypeNumber, limitNumber);
        AnswerManager.handleSuccess(res, ranking);
    } catch (error) {
        console.error(error);
        AnswerManager.handleError(res, error);
    }
};

exports.getFormatSizeTextureRanking = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const ranking = await dashboardModel.getFormatSizeTextureRanking(startDate, endDate, parseInt(limit, 10));
        AnswerManager.handleSuccess(res, ranking);
    } catch (error) {
        AnswerManager.handleError(res, error);
    }
};

exports.getDesignTypeFormatSizeRanking = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const ranking = await dashboardModel.getDesignTypeFormatSizeRanking(startDate, endDate, parseInt(limit, 10));
        AnswerManager.handleSuccess(res, ranking);
    } catch (error) {
        AnswerManager.handleError(res, error);
    }
};

exports.getGroutRanking = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const ranking = await dashboardModel.getGroutRanking(startDate, endDate, parseInt(limit, 10));
        AnswerManager.handleSuccess(res, ranking);
    } catch (error) {
        AnswerManager.handleError(res, error);
    }
};





// dashboard.controller.js
exports.getSessionsAverageTime = async (req, res) => {

    
    const { startDate, endDate } = req.query; // Extract from query parameters

    try {
        const averageTime = await dashboardModel.getSessionsAverageTime(startDate, endDate);
        AnswerManager.handleSuccess(res, averageTime); // Convert to seconds for the response
    } catch (error) {
        AnswerManager.handleError(res, error);
    }
};



exports.getFinishedSessionsCount = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const count = await dashboardModel.getFinishedSessionsCount(startDate, endDate);
        res.json({ finishedSessionsCount: count });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getQuotationsCount = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const count = await dashboardModel.getQuotationsCount(startDate, endDate);
        res.json({ quotationsCount: count });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


