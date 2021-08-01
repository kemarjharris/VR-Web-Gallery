import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './src/resolvers';
import { typeDefs } from './src/typedefs';
import session from 'express-session';
import cookie from 'cookie';
import helmet from 'helmet';
import { shareSession } from './socket';
import cors from 'cors';

const PORT = 4000;
const app = express();
app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

const sessionMiddleware = session({
  secret: 'hotchips',
  resave: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  },
  saveUninitialized: true,
});

app.use(sessionMiddleware);

app.use(function (req, res, next) {
  let username = (req.session.username) ? req.session.username : '';
  res.setHeader('Set-Cookie', cookie.serialize('username', username, {
    path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 1 day
  }));
  next();
});

// source: https://www.youtube.com/watch?v=EuaVr7vFF5E
const server = new ApolloServer({
  playground: false,
  typeDefs,
  resolvers,
  formatError: function (error) {
    return { message: error.message };
  },
  context: ({ req, res, connection }) => {
    return { req, res, connection };
  },
  subscriptions: {
    onConnect: (_, ws) => {
      return new Promise(resolve =>
        sessionMiddleware(ws.upgradeReq, {}, () => {
          resolve({ req: ws.upgradeReq });
        })
      );
    }
  }
});

server.applyMiddleware({
  app, cors: corsOptions
});
const httpServer = http.createServer(app);
shareSession(httpServer, sessionMiddleware);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, function () {
  console.log(`Server ready at localhost:${PORT}/graphql`);
});
