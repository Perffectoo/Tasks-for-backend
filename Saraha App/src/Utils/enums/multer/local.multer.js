import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileTypeFromBuffer } from "file-type";
import { BadRequestException } from "../../response/error.response.js";

export const validationMagicNumbers = (allowedTypes = []) => {
  const allowed = allowedTypes.map((t) =>
    t === "image/jpg" ? "image/jpeg" : t,
  );

  return async (req, res, next) => {
    try {
      const files = req.file ? [req.file] : req.files || [];

      for (const file of files) {
        const buffer = await fs.promises.readFile(file.path);
        const type = await fileTypeFromBuffer(buffer);

        if (!type || !allowed.includes(type.mime)) {
          await Promise.all(
            files.map((f) => fs.promises.unlink(f.path).catch(() => {})),
          );

          throw BadRequestException({
            message: `Invalid file type: ${file.originalname}`,
          });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const fileValidation = {
  images: ["image/png", "image/jpg", "image/jpeg"],
  videos: ["video/mp4", "video/mpeg", "video/jpeg"],
  audios: ["audio/webm", "audio/mpeg", "audio/mp4"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
  ],
};
export const localFileUpload = ({ customPath = "general"  , validation = [] }) => {
  const basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userBasePath = basePath;
      if (req.user?._id) userBasePath += `/${req.user._id}`;
      const fullPath = path.resolve(`./src/${userBasePath}`); // src/uploads/User/_id/
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      cb(null, path.resolve(fullPath));
    },

    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() + "_" + Math.random() + "_" + file.originalname;
      file.finalPath = `${basePath}/${req.user._id}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (!validation.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    } else {
      cb(null, true);
    }
  };

  return multer({ fileFilter, storage });
};
