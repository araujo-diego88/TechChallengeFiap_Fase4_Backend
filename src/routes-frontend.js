var express = require('express');
var router = express.Router();
import session from 'express-session';

router.get(`/`, async function (req, res) {

    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();

    var sessao_feita = JSON.stringify( {username:"Nao logado"} )
    console.log(sessao_feita)
    console.log(req.session)
    sessao_feita = req.session

    res.render('index', { title: 'Shared Spaces | Reserve seu espaço', bodyClass:"homepage", lugares:json, sessao:sessao_feita });
});


router.get('/login', function(req, res, next) {
    var sessao_feita = JSON.stringify( {username:"Nao logado"} )
    console.log(req.session)
    sessao_feita = req.session
    
    res.render('login', { title: 'Shared Spaces | Login', bodyClass:"login-page", sessao:sessao_feita });
});
router.get('/cadastrar', function(req, res, next) {
    var sessao_feita = JSON.stringify( {username:"Nao logado"} )
    console.log(req.session)
    sessao_feita = req.session
    
    res.render('cadastrar', { title: 'Shared Spaces | Cadastrar', bodyClass:"login-page", sessao:sessao_feita });
});

router.get('/sala/:id', async function(req, res, next) {
    
    var lugar_id = req.params.id;
    const response = await fetch('http://localhost:3333/placefind?place_id='+lugar_id);
    const json = await response.json();
    
    var sessao_feita = JSON.stringify( {username:"Nao logado"} )
    console.log(req.session)
    sessao_feita = req.session
    
    res.render('sala', { title: 'Shared Spaces | ' + json.nome, bodyClass:"sala-page", lugares:json, sessao:sessao_feita });
});

router.get('/reservar', async function(req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    var sessao_feita = JSON.stringify( {username:"Nao logado"} )
    console.log(req.session)
        sessao_feita = req.session
    
    res.render('reservar', { title: 'Shared Spaces | Catalogo de reservas', bodyClass:"reservar-page", lugares:json, sessao:sessao_feita });
});

// Parte admin
router.get('/admin/login', function(req, res, next) {
    res.render('admin/login', { title: 'Login Admin', bodyClass:"login-page" });
});
router.get('/admin/administrar-reservas', async function(req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    res.render('admin/administrar-reservas', { title: 'Administrar Reservas', bodyClass:"reservar-page", lugares:json });
});

module.exports = router;
