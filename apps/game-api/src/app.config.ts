import makeColyseusApp from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { server as GQLServer } from './graphql';
import { MyRoom } from './rooms/MyRoom';
import { createContext } from './graphql/context';
import type { PrismaClient } from './prisma-client';

interface MakeAppArgs {
  authClient: GoTrueAdminApi;
  prisma: PrismaClient;
}

export const makeApp = ({ authClient, prisma }: MakeAppArgs) => {
  return makeColyseusApp({
    initializeGameServer: (gameServer) => {
      /**
       * Define your room handlers:
       */
      gameServer.define('my_room', MyRoom, { prisma });
    },

    initializeExpress: async (app) => {
      /**
       * Configure GraphQL route, middleware and context
       */
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

      /**
       * Simple health check endpoint
       */
      app.get('/health', (_, res) => {
        res.status(200).json({ status: 'ok' });
      });
    },

    beforeListen: () => {
      /**
       * Before gameServer.listen() is called.
       */
    },
  });
};
