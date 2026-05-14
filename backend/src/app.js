import express from 'express';
import cors from 'cors';

import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();

// CORS configuration - Allow requests from RECON_CMS frontend
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://localhost:8080',
    'http://localhost:8081'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'lang', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express.json());

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

export default app;