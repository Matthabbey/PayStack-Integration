import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { UserAttributes } from "../interface/userAttribute";

export class UserInstance extends Model<UserAttributes> {
  static patch(
    arg0: { is_premium: boolean },
    arg1: { where: { id: any } }
  ): unknown {
    throw new Error("Method not implemented.");
  }
}


UserInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Email is invalid",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "firstName is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required",
        },
        notEmpty: {
          msg: "Password is required",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_birth: {
      type: DataTypes.DATE,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Verification status is required",
        },
        notEmpty: {
          msg: "user not verified",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: db,
    tableName: "user",
  }
);

export { UserAttributes };

