import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connections.js";

export class CommentsModel extends Model {}

CommentsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Posts",
                key: "id",
            },
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
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "Comments",
        timestamps: true,
        freezeTableName: true,
    }
);