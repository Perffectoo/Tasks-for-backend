import { z } from "zod";
import { GenderEnum, roleEnum } from "../enums/user.enum.js";
const allowedTlds = ["com", "net", "org", "edu", "gov", "mil", "io", "co"];
export const generalFields = {
  username: z.string({ error: "username is required" }).trim().min(2).max(25),
  firstName: z
    .string({ error: "firstName is required" })
    .trim()
    .min(2)
    .max(25)
    .regex(/^[a-zA-Z0-9]+$/, {
      erro: "firstName must be letters and number only",
    }),
  lastName: z
    .string({ error: "lastName is required" })
    .trim()
    .min(2)
    .max(25)
    .regex(/^[a-zA-Z0-9]+$/, {
      erro: "lastName must be letters and number only",
    }),
  email: z
    .email({ error: "invlaid email address" })
    .refine((v) => allowedTlds.includes(v.split(".").pop().toLowerCase()), {
      error: `email domain must end with ${allowedTlds.join(", ")}`,
    }),

  password: z
    .string({ error: "password is required" })
    .min(8, { error: "password must be at least 8 characters" })
    .max(100),

  age: z
    .number({ error: "age must be a number" })
    .int({ error: "age must be an integer" })
    .positive({ error: "age must be positive" }),

  phone: z.string(),

  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { error: "invalid objectId format" }),

  otp: z.string().regex(/^[0-9]{6}$/, { error: "OTP must be 6 digits" }),

  authorization: z.string({ error: "authorization header is requried" }),
  content: z
    .string({ error: "content is required" })
    .trim()
    .min(1)
    .max(500, { error: "content must be at most 500 characters" }),

  file: (allowedMimeTypes, maxSizeBytes = 5 * 1024 * 1024) => {
    z.object({
      fieldname: z.literal("attachments"),
      originalname: z.string().min(1),
      encoding: z.string(),
      mimetype: z.enum(allowedMimeTypes, { error: "unsupported file type" }),
      size: z.number().positive().max(maxSizeBytes),
      destination: z.string(),
      filename: z.string(),
      path: z.string(),
      finalpath: z.string(),
    });
  },
  role: z.enum(roleEnum),
  gender: z.enum(GenderEnum),
  DOB: z.string({ error: "invalid date of birth" }),
};
