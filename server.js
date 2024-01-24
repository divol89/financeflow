import express from 'express';
import next from 'next';
import session from 'express-session';
import { initialize, session as _session, authenticate } from './auth/passport'; // Adjust the path if needed

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(session({
    secret: 'your-secret', // Please use a secure secret in production
    resave: false,
    saveUninitialized: false,
  }));

  server.use(initialize());
  server.use(_session());

  // Twitter OAuth Routes
  server.get('/auth/twitter', authenticate('twitter'));

  server.get('/auth/twitter/callback',
    authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication
      res.redirect('/');
    }
  );

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
