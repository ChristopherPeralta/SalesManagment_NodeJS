const handleDatabaseOperation = (operation) => async (req, res, next) => {
    try {
      await operation(req, res);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = handleDatabaseOperation;