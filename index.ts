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
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            user: {
              id: 'Denji',
              name: '덴지쿤',
              description: 'Denji is a dog',
              profileImageUrl:
                'https://i.pinimg.com/736x/ed/cc/3c/edcc3c99612fb4ae2178a688e9e1f2d3.jpg',
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
