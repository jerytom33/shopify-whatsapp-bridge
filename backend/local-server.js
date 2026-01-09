require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Serverless Functions
const healthFn = require('./api/health');
const statsFn = require('./api/stats');
const configFn = require('./api/config');
const activityFn = require('./api/activity');
const testWebhookFn = require('./api/test-webhook');
const debugFn = require('./api/debug');
const templatesFn = require('./api/templates');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Helper to wrap Vercel async functions for Express
const wrap = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};

// Mount Routes
app.get('/api/health', wrap(healthFn));
app.get('/api/stats', wrap(statsFn));

app.get('/api/config', wrap(configFn));
app.post('/api/config', wrap(configFn));
app.options('/api/config', wrap(configFn));

app.get('/api/activity', wrap(activityFn));

app.post('/api/test-webhook', wrap(testWebhookFn));
app.get('/api/debug', wrap(debugFn));
app.get('/api/templates', wrap(templatesFn));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Local Server Error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
});

app.listen(PORT, () => {
    console.log(`
🚀 Local Server running on http://localhost:${PORT}
   - /api/health
   - /api/stats
   - /api/config
   - /api/debug
    `);
});
