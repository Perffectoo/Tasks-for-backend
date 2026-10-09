import mongoose, { Schema } from "mongoose";

import {
    GenderEnum,
    ProviderEnum,
    roleEnum
} from "../../Utils/enums/user.enum.js";


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name must be at most 50 characters"],
            trim: true
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name must be at most 50 characters"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        DOB: Date,

        age: Number,

        phone: String,

        gender: {
            type: Number,
            enum: Object.values(GenderEnum),
            default: GenderEnum.MALE
        },

        role: {
            type: Number,
            enum: Object.values(roleEnum),
            default: roleEnum.USER
        },

        Provider: {
            type: Number,
            enum: Object.values(ProviderEnum),
            default: ProviderEnum.SYSTEM
        },

        confirmEmail: Date,

        ProfilePicture: String,

        coverPicture: String
    },

    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);


// Virtual username
userSchema
    .virtual("username")

    .set(function (value) {

        const [firstName, lastName] = value.split(" ") || [];

        this.set({
            firstName,
            lastName
        });
    })

    .get(function () {

        return `${this.firstName} ${this.lastName}`;
    });



const User = mongoose.model(
    "User",
    userSchema
);


export default User;