// Creating our tasks model
module.exports = function(sequelize, DataTypes) {
  const Tasks = sequelize.define("Tasks", {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    }
  });
  return Tasks;
};
