require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const serverlessExpress = require('@codegenie/serverless-express')
const { connectDB } = require('../../src/config/database');
const routes = require('./routes');
const { middlewareNotFound } = require('../../src/middleware/404');
const authMiddleware  = require('../../src/middleware/auth');
const {  middlewareErrors } = require('../../src/middleware/errors');

const app = express();

connectDB();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    },
  },
}));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.ADMIN_FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MenuApp API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use('/api/v1/',authMiddleware)
app.use('/api/v1', routes);
app.use('*', middlewareNotFound);
app.use(middlewareErrors);

module.exports = app;

module.exports.handler = (event, context) => {
  console.log("isBase64Encoded:", event.isBase64Encoded);
  console.log("content-type:", event.headers?.["content-type"]);
  console.log("body length:", event.body?.length);

  return serverlessExpress({
    app,
    binarySettings: {
      contentTypes: [
        "multipart/form-data",
        "image/jpeg",
        "image/png",
        "image/webp"
      ]
    }
  })(event, context);
};