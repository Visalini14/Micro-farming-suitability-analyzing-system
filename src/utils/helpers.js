export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPlantEmoji = (plantType) => {
  const emojis = {
    'Vegetable': '🥦',
    'Herb': '🌿',
    'Flower': '🌸',
    'Fruit': '🍓',
    'Fungus': '🍄'
  };
  return emojis[plantType] || '🌱';
};