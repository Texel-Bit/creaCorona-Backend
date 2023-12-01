exports.getUserGameConfiguration = async (userId) => {
    // Fetch the game configuration from the database
    // Example: return an array of items with their generator percentages
    return [
      { itemId: 'item1', percentage: 40 },
      { itemId: 'item2', percentage: 30 },
      { itemId: 'item3', percentage: 20 },
      { itemId: 'item4', percentage: 10 },
    ];
  };