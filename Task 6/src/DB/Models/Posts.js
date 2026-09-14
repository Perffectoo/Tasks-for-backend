import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connections.js";

export class PostsModel extends Model {}

PostsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },

        createdAt: {
            type: DataTypes.DATE,
        },

        updatedAt: {
            type: DataTypes.DATE ,
        },
    },

{
    sequelize,
    modelName: "Posts",
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
}
);