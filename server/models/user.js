const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,  
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: [6, 100]
      },
      // set(val) {
      //   // https://crackstation.net/hashing-security.htm
      //   this.setDataValue('password', bcrypt.hashSync(val, 10)) 
      // }
    },
  })

  // Instacne function
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.getDataValue('password'))
  }

  // Class function
  User.hashPassword = async function(password = this.getDataValue('password')) {
    const salt = await bcrypt.genSalt(10)
    
    return bcrypt.hash(password, salt)
  }

  return User
}