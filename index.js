const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');

const app = express();


passport.use(
  new GitHubStrategy(
    {
      clientID: '658dc3866b7f8ec5d793',
      clientSecret: 'c9919fb92909852aa3549e85883a87f9fc7cbd27',
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use(
  session({
    secret: 'seu-segredo-secreto',
    resave: true,
    saveUninitialized: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/github', passport.authenticate('github'));


app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);


app.get('/profile', (req, res) => {
  
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  
  res.json(req.user);
});


app.get('/', (req, res) => {
  res.send('Home');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});