import { z } from "zod";
import { generalFields } from "../../Utils/validation/general.fields.js";

export const freezeAccountSchema = {
  params: z.object({ userId: generalFields.id.optional() }),
};

export const restoreAccountSchema = {
  params: z.object({ userId: generalFields.id.optional() }),
};


export const hardDeleteAccountSchema = {
  params: z.object({ userId: generalFields.id.optional() }),
};