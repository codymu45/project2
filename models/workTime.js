// Creating our Worktime model
module.exports = function(sequelize, DataTypes) {
  const Worktime = sequelize.define("Worktime", {
    // The email cannot be null, and must be a proper email before creation
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mins: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    secs: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Worktime;
};
