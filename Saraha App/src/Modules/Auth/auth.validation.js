import { z } from "zod";
import { generalFields } from "../../Utils/validation/general.fields.js";
import { LogOutTypeEnum } from "../../Utils/enums/user.enum.js";
export const signupSchema = {
  body: z
    .strictObject({
      username: generalFields.username ,
      email: generalFields.email,
      password: generalFields.password,
      confirmPassword: z.string({ error: "confirmPassword is required" }),
      age: generalFields.age.optional(),
      phone: generalFields.phone.optional(),
      role: generalFields.role.optional(),
      DOB: generalFields.DOB.optional(),
      gender: generalFields.gender.optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Password do not match",
      path: ["confirmPassword"],
    }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
  }),
};

export const loginSchema = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

export const refreshToken = {
  headers: z.strictObject({
    authorization: generalFields.authorization,
  }),
};

export const socialLoginSchema = {
  body: z.strictObject({
    idToken: z.string({ error: "idToken is required" }).min(1),
  }),
};

export const logoutSchema = {
  query: z.strictObject({
    flag: z.enum(Object.values(LogOutTypeEnum), {
      error: `flag must be one of ${Object.values(LogOutTypeEnum).join(", ")}`,
    }),
  }),
};





export const forgetPasswordSchema = {
  query: z.strictObject({
    email: generalFields.email,
  }),
};


export const resetPasswordSchema = {
  query: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
    newPassword: generalFields.password,
    confirmNewPassword: z.string({ error: "confirmPassword is required" }),
  }).refine((data) => data.password === data.confirmNewPassword, {
    error: "Password do not match",
    path: ["confirmNewPassword"]
  }),
};
