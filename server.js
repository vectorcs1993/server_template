import config from './config.js';
import express, { json } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import api from './src/api/api.module.js'
import { formatDateTime } from './src/store.js';

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: [config.CLIENT_ORIGIN],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: '*',
}));

app.use(json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

api(app);

app.listen(config.SERVER_PORT, () => {
  console.log(`${formatDateTime()}: Server is running on the port: ${config.SERVER_PORT}`);
});

app.get('/', (req, res) => {
  res.send(`(Time-Tracking) Management API, mode production: ${config.MODE_PRODUCTION}`);
});