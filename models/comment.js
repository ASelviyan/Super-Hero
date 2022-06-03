'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comment.belongsTo(models.user, {foreignKey: 'userId'})
      models.comment.belongsTo(models.user, {foreignKey:'teamId'})
    }
  }
  comment.init({
    username: DataTypes.STRING,
    comment: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    userId:{
      type:DataTypes.INTEGER,
      refrences: {
        model:'user',
        key:'id'
      }
    },
    teamId: {
      type:DataTypes.INTEGER,
      refrences: {
        model:'user',
        key:'id'
      }
    }
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};