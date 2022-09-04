import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { logger, stream } from '@utils/logger';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { Routes } from '@interfaces/routes.interface';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from '@middlewares/error.middleware';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import morgan from 'morgan';
import typeDefs from '@/apollo/schemas';
import resolvers from '@/apollo/resolvers';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public httpServer: http.Server;
  public apolloServer: ApolloServer;

  constructor(routes: Routes[]) {
    this.app = express();
    this.httpServer = http.createServer(this.app);

    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      csrfPrevention: true,
      cache: 'bounded',
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
    });

    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeApollo();
    this.initializeErrorHandling();
  }

  public async listen() {
    await new Promise<void>(resolve => this.httpServer.listen({ port: this.port }, resolve));
    logger.info(`=================================`);
    logger.info(`======= ENV: ${this.env} =======`);
    logger.info(`🚀 GraphQL listening on the port ${this.port}`);
    logger.info(`=================================`);
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private async initializeApollo() {
    await this.apolloServer.start();
    this.apolloServer.applyMiddleware({ app: this.app });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
