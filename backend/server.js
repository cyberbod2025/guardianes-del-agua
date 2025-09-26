import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.GEMINI_API_TOKEN;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const collectCandidateText = (data) => {
  if (!data || !data.candidates) {
    return '';
  }
  return data.candidates
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => part.text || '')
    .join('\n')
    .trim();
};

const buildAiPrompt = ({ aiTask, text, aiPrompt, moduleTitle, teamName, groupId }) => {
  const baseInstruction = `Eres Mentor Aqua, un asistente pedagógico que ayuda a estudiantes de secundaria a formular preguntas de investigación sobre el uso responsable del agua. Evalúa la propuesta del equipo y responde en formato JSON con las claves summary (texto breve) y suggestions (lista de strings).`;
  const taskSpecific =
    aiPrompt ||
    (aiTask === 'researchQuestion'
      ? 'Evalúa si la pregunta es medible, clara y está conectada con datos que puedan recolectarse. Sugiere ajustes concretos que el equipo pueda aplicar de inmediato.'
      : 'Ofrece retroalimentación enfocada en claridad, pasos accionables y relación con el proyecto de agua.');
  const context = [
    moduleTitle ? `Misión o módulo: ${moduleTitle}` : null,
    teamName ? `Equipo: ${teamName}` : null,
    groupId ? `Grupo: ${groupId}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `${baseInstruction}\n\nContexto disponible:\n${context}\n\nTexto del equipo:\n"""${text}"""\n\nIndicaciones para Mentor Aqua:\n${taskSpecific}\n\nDevuelve exclusivamente un objeto JSON como el siguiente:\n{\n  "summary": "retroalimentación breve",\n  "suggestions": ["sugerencia 1", "sugerencia 2"]\n}`;
};

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.get('/api/database', (_req, res) => {
  const dbPath = path.join(__dirname, 'database.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer la base de datos.');
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/ai/validate-question', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'La IA no está disponible. Falta configurar la clave de Gemini.' });
  }

  const {
    text: questionText,
    aiTask = 'researchQuestion',
    aiPrompt,
    moduleId,
    moduleTitle,
    teamName,
    groupId,
  } = req.body || {};

  if (!questionText || typeof questionText !== 'string' || !questionText.trim()) {
    return res.status(400).json({ error: 'Texto inválido para evaluar.' });
  }

  try {
    const prompt = buildAiPrompt({
      aiTask,
      aiPrompt,
      text: questionText.trim(),
      moduleTitle: moduleTitle ? String(moduleTitle) : `Misión ${moduleId ?? ''}`,
      teamName,
      groupId,
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error('Gemini API error:', response.status, body);
      return res.status(502).json({ error: 'Mentor Aqua tuvo un problema al evaluar la pregunta.' });
    }

    const data = await response.json();
    const rawText = collectCandidateText(data);
    let parsedFeedback = null;

    if (rawText) {
      try {
        parsedFeedback = JSON.parse(rawText);
      } catch (parseError) {
        parsedFeedback = null;
      }
    }

    const feedback = parsedFeedback && typeof parsedFeedback === 'object'
      ? parsedFeedback
      : { summary: rawText, suggestions: [] };

    res.json({ feedback, raw: rawText });
  } catch (error) {
    console.error('AI validation error:', error);
    res.status(500).json({ error: 'No fue posible obtener la retroalimentación de Mentor Aqua.' });
  }
});

app.listen(port, () => {
  console.log(`🚿 Servidor de Backend corriendo en http://localhost:${port}`);
});
