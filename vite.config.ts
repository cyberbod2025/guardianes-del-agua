// @ts-nocheck
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

const ensureUtf8CharsetPlugin = (): PluginOption => ({
  name: 'ensure-utf8-charset',
  configureServer(server) {
    server.middlewares.use(createCharsetMiddleware());
  },
  configurePreviewServer(server) {
    server.middlewares.use(createCharsetMiddleware());
  },
});

function createCharsetMiddleware() {
  return (_req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const originalSetHeader = res.setHeader.bind(res);
    const originalWriteHead = res.writeHead.bind(res);

    const normalize = (value: string): string => {
      const normalized = value.toLowerCase();
      const isTextual = normalized.startsWith('text/') || normalized.startsWith('application/javascript') || normalized.startsWith('application/json') || normalized.startsWith('image/svg');
      if (!isTextual) {
        return value;
      }

      if (!/charset=/i.test(value)) {
        return `${value}; charset=utf-8`;
      }

      return value.replace(/charset=([^;]+)/i, 'charset=utf-8');
    };

    const ensureHeader = (name: string, value: string | number | readonly string[] | undefined) => {
      if (typeof name !== 'string' || name.toLowerCase() !== 'content-type') {
        return value;
      }
      if (typeof value === 'string') {
        return normalize(value);
      }
      if (Array.isArray(value)) {
        return value.map((entry) => (typeof entry === 'string' ? normalize(entry) : entry));
      }
      return value;
    };

    res.setHeader = (name: string, value: string | number | string[]) => {
      return originalSetHeader(name, ensureHeader(name, value) as string | number | string[]);
    };

    res.writeHead = (...args: any[]) => {
      const headersIndex = typeof args[1] === 'string' ? 2 : 1;
      if (args.length > headersIndex && args[headersIndex] && typeof args[headersIndex] === 'object') {
        const headers = { ...args[headersIndex] } as any;
        for (const key of Object.keys(headers)) {
          headers[key] = ensureHeader(key, headers[key]);
        }
        args[headersIndex] = headers;
      }
      return originalWriteHead(...args);
    };

    const restore = () => {
      res.setHeader = originalSetHeader;
      res.writeHead = originalWriteHead;
    };

    res.on('finish', restore);
    res.on('close', restore);

    next();
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), ensureUtf8CharsetPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
