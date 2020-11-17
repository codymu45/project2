// Creating our tasks model
module.exports = function(sequelize, DataTypes) {
  const Tasks = sequelize.define("Tasks", {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: function() {
        return "Queue";
      }
    }
  });
  return Tasks;
};
