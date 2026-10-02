// import { DataTypes } from "sequelize";
// import { sequelize } from "../connections.js";

// export const UsersModel = sequelize.define(
//     "Users",
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },

//         name: {
//             // type: DataTypes.STRING,
//             allowNull: false,
//         },

//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         },

//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 len:{
//                     args: [7, 25],
//                     msg: "Password must be between 7 and 25 characters long"
//                 }
//             }
//         },

//         role: {
//             type: DataTypes.ENUM("user", "admin"),
//             allowNull: false,
//             defaultValue: "user",
//         },

//         createdAt: {
//             type: DataTypes.DATE,
//         },

//         updatedAt: {
//             type: DataTypes.DATE,
//         },
//     },
//     {
//         timestamps: true,
//         freezeTableName: true,
//     }
// );