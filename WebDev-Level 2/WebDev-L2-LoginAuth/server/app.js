/**
 * Builds the Express application (no listening, no database wiring), so tests can start it on a
 * random port with fake dependencies.
 */
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createRoutes } from './routes.js';

export function createApp({ auth, sessions, breachChecker, config, mailer }) {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

  // Security headers (CSP allows only our own scripts + Google Fonts, which the UI uses)
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:', 'blob:'],
          'connect-src': ["'self'"],
          'object-src': ["'none'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  // Extra CSRF defence on top of SameSite=Strict: state-changing requests must come from our own origin
  app.use('/api', (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const origin = req.get('origin');
    if (origin) {
      let originHost = '';
      try {
        originHost = new URL(origin).host;
      } catch {
        /* invalid origin header -> rejected below */
      }
      if (originHost !== req.get('host')) {
        return res.status(403).json({ code: 'BAD_ORIGIN', message: 'Cross-origin request blocked.' });
      }
    }
    next();
  });

  app.use('/api', createRoutes({ auth, sessions, breachChecker, config, mailer }));

  // Catches errors raised before the router (e.g. malformed JSON, oversized body)
  // eslint-disable-next-line no-unused-vars
  app.use('/api', (err, _req, res, _next) => {
    if (err?.type === 'entity.parse.failed' || err?.type === 'entity.too.large') {
      return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid request body.' });
    }
    console.error('[server] Unexpected error:', err);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' });
  });

  // In production serve the built React app from the same server (so cookies are same-origin)
  if (fs.existsSync(path.join(config.distDir, 'index.html'))) {
    app.use(express.static(config.distDir));
    app.get('*', (_req, res) => res.sendFile(path.join(config.distDir, 'index.html')));
  }

  return app;
}
