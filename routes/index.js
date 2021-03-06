var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/register',(req, res) => {
  res.render('register-form')
})

router.get('/login', function(req, res) {
  res.render('login-form');
});

router.post('/register', function(req, res) {
  axios.post('http://auth:8002/users/register', req.body)
    .then(dados => {
      console.log(dados)
      res.redirect('/login')
    })
    .catch(e => res.render('error', {error: e}))
});

router.post('/login', function(req, res) {
  axios.post('http://auth:8002/users/login', req.body)
    .then(dados => {
      res.cookie('token', dados.data.token, {
        expires: new Date(Date.now() + '1d'),
        secure: false, // set to true if your using https
        httpOnly: true
      });
      res.redirect('/tarefas')
    })
    .catch(e => res.render('error', {error: e}))
});

router.get('/tarefas', function(req, res) {
  console.log(JSON.stringify(req.cookies))
  axios.get('http://files:8001/tarefas?token=' + req.cookies.token)
    .then(dados => res.render('tarefas', {lista: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

module.exports = router;
