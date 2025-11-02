import 'expo-router/entry';

import { createServer, Response, Server } from 'miragejs';

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post('/login', (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === 'Denji' && password === '1234') {
          return {
            accessToken: '1234567890',
            refreshToken: '1234567890',
            user: {
              id: 'Denji',
            },
          };
        } else {
          return new Response(
            401,
            {},
            { error: 'Invalid username or password' }
          );
        }
      });
    },
  });
}
