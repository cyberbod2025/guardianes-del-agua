import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuración para usar __dirname en Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Asegurarse de que la carpeta 'uploads' exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ruta para la subida de archivos
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    // Devuelve la ruta relativa para que el frontend pueda usarla
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Ruta para servir la base de datos
app.get('/api/database', (req, res) => {
    const dbPath = path.join(__dirname, 'database.json');
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al leer la base de datos.');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`✅ Servidor de Backend corriendo en http://localhost:${port}`);
});