// server.js - Gateway Central Orquestador Multi-Tenant (Dante OS v21.2.1 Enterprise Gold)
// Bogotá, Colombia
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import catRouter from './src/routes/catRoutes.js';
import authRouter from './src/routes/authRoutes.js'; 
import adminRouter from './src/routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_VERSION = "v21.2.1-ENTERPRISE_GOLD";

// 🛡️ CONFIGURACIÓN HELMET & POLÍTICA DE SEGURIDAD CONTENT-SECURITY-POLICY (CSP)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdn.tailwindcss.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
            imgSrc: ["'self'", "data:", "blob:", "https:"],
            connectSrc: ["'self'", "https:", "wss:", "ws:"],
            frameAncestors: ["'self'", "https://*.google.com", "https://*.googleusercontent.com", "https://*.run.app", "https://*.ai.studio", "https://ai.studio"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: false
}));

const ALLOWED_ORIGINS = [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:3000', 'http://127.0.0.1:5500', 
    'http://localhost:5500', 'https://danteos.com',
    'https://app.danteos.com',
    'https://dante-os-platform.onrender.com'
];

if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => {
        if (o.trim()) ALLOWED_ORIGINS.push(o.trim());
    });
}

const ALLOWED_DOMAINS_REGEX = /\.(run\.app|ai\.studio|google\.com|googleusercontent\.com|danteos\.com)$/i;

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
            origin.includes('localhost') || origin.includes('127.0.0.1') ||
            ALLOWED_DOMAINS_REGEX.test(new URL(origin).hostname);
        
        if (isAllowed) {
            return callback(null, true);
        }
        return callback(new Error("Acceso bloqueado: Origen no permitido por la política CORS perimetral."));
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// 🛡️ LIMITADORES DE TASA DE PETICIONES (RATE LIMITING ANTI-BRUTE FORCE / DDoS)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutos
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de peticiones globales excedido. Por favor intente más tarde." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutos
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Demasiados intentos de autenticación desde esta IP. Por favor intente en unos minutos." }
});

const catLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minuto
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de tasa en evaluación adaptativa excedido. Por favor responda a un ritmo normal." }
});

const arcoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hora
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de solicitudes de supresión ARCO excedido por hora." }
});

// Aplicación de Limitadores Perimetrales (Incluyendo Aliases v1)
app.use('/api/', globalLimiter);
app.use('/api/auth/login-perimetral', authLimiter);
app.use('/api/v1/auth/login-perimetral', authLimiter);
app.use('/api/auth/register-secure-user', authLimiter);
app.use('/api/v1/auth/register-secure-user', authLimiter);
app.use('/api/auth/arco/hard-delete', arcoLimiter);
app.use('/api/v1/users/arco/hard-delete', arcoLimiter);
app.use('/api/cat/interactuar', catLimiter);

// 🛡️ Middleware de Encabezados Perimetrales Complementarios
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    console.log(`📡 [GATEWAY MULTI-TENANT ${SERVER_VERSION}] -> ${req.method} desde ${req.url}`);
    next();
});

// ====================================================================
// 🛡️ MONTAJE DE RUTAS CORE DEL SISTEMA OPERATIVO COGNITIVO
// ====================================================================
app.use('/api/cat', catRouter);
app.use('/api/auth', authRouter); 
app.use('/api/v1/users', authRouter); // Alias v1 para endpoints ARCO
app.use('/api/v1/auth', authRouter);  // Alias v1 para endpoints de Auth y Consentimiento Parental
app.use('/api/admin', adminRouter);   // Desacoplado SRP: Rutas administrativas B2B

// ENDPOINT DE MONITOREO DE SALUD DEL CLÚSTER (HEALTHCHECK)
app.get('/api/health', (req, res) => {
    return res.status(200).json({ success: true, status: "HEALTHY", version: SERVER_VERSION, timestamp: new Date().toISOString() });
});

// ====================================================================
// 🪐 ENTRADA DE INTERFAZ GRÁFICA (Vistas Estáticas)
// ====================================================================
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ====================================================================
// 🛡️ MIDDLEWARE DE ERRORES GLOBAL Y CONTROL DE RESILIENCIA DEL PROCESO
// ====================================================================
app.use((err, req, res, next) => {
    console.error('🚨 [EXPRESS UNHANDLED ROUTE ERROR]:', err);
    
    const responsePayload = {
        success: false,
        error: "Error interno del servidor. Proceso recuperado por middleware de resiliencia."
    };

    if (process.env.NODE_ENV === 'development') {
        responsePayload.details = err.message || "Excepción no controlada";
    }

    res.status(err.status || 500).json(responsePayload);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 [PROCESS UNHANDLED REJECTION]: Excepción asíncrona capturada:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 [PROCESS UNCAUGHT EXCEPTION]: Excepción síncrona capturada:', error);
});

const server = app.listen(PORT, '0.0.0.0', () => console.log(`\n🚀 [DANTE OS ENTERPRISE GATEWAY ${SERVER_VERSION}]: Activo en http://0.0.0.0:${PORT}`));

const gracefulShutdown = (signal) => {
    console.log(`\n🛑 [SHUTDOWN SIGNAL ${signal}]: Cerrando servidor HTTP y limpiando conexiones...`);
    server.close(() => {
        console.log('✅ [HTTP SERVER CLOSED]: Servidor HTTP cerrado correctamente.');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('⚠️ [FORCED EXIT]: Finalizando proceso forzosamente tras timeout.');
        process.exit(1);
    }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
