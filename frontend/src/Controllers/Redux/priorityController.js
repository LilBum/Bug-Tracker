const colors = ['#b33a3a', '#ff6700', '#32cd32'];
const levels = ['High', 'Medium', 'Low'];

function PriorityController(priority) {
  const index = Number(priority) - 1;

  return {
    level: levels[index] || 'Unknown',
    color: colors[index] || '#333333',
  };
}

export default PriorityController;
