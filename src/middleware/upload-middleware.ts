import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extensao = path.extname(file.originalname);
    const nomeBase = path
      .basename(file.originalname, extensao)
      .replace(/\s+/g, "-")
      .toLowerCase();

    const nomeArquivo = `${Date.now()}-${nomeBase}${extensao}`;
    cb(null, nomeArquivo);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(new Error("400|Formato de imagem inválido. Use JPG, PNG ou WEBP."));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});