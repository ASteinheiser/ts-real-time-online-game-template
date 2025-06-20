import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { server as GQLServer } from './graphql';
import { MyRoom, RESULTS } from './rooms/MyRoom';
import { createContext } from './graphql/context';
import type { PrismaClient } from './prisma-client';

interface SetupAppArgs {
  authClient: GoTrueAdminApi;
  prisma: PrismaClient;
}

export const setupApp = ({ authClient, prisma }: SetupAppArgs) => {
  return config({
    initializeGameServer: (gameServer) => {
      /**
       * Define your room handlers:
       */
      gameServer.define('my_room', MyRoom, { prisma });
    },

    initializeExpress: async (app) => {
      app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(GQLServer, {
          context: ({ req }) => {
            const authHeader = req.headers.authorization;
            return createContext({ authHeader, authClient, prisma });
          },
        })
      );

      // TODO: remove this
      app.get('/game-results', (_, res) => {
        res.send(RESULTS);
      });

      /**
       * Use @colyseus/playground
       * (It is not recommended to expose this route in a production environment)
       */
      if (process.env.NODE_ENV !== 'production') {
        app.use('/', playground());
      }

      /**
       * Use @colyseus/monitor
       * It is recommended to protect this route with a password
       * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
       */
      app.use('/monitor', monitor());
    },

    beforeListen: () => {
      /**
       * Before gameServer.listen() is called.
       */
    },
  });
};
