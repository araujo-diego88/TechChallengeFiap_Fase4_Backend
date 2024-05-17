import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";

import SessionController from "./controllers/SessionController";
import PlaceController from "./controllers/PlaceController";
import DashboardController from './controllers/DashboardController';
import ReserveController from "./controllers/ReserveController";

const routes = new Router();
const upload = multer(uploadConfig);

var sessao_feita = {conta: { username:"Nao logado" } }

/// Parte Backend

routes.post('/places', upload.single('thumbnail') ,PlaceController.store);
routes.get('/places', PlaceController.index);
routes.get('/placefind', PlaceController.id_find);
routes.put('/places/:place_id', upload.single('thumbnail'), PlaceController.update);
routes.delete('/places', PlaceController.destroy);
routes.get('/placefind', PlaceController.id_find);

routes.post('/sessions', SessionController.store);
routes.post('/updateconta', SessionController.update);
routes.post('/loginsession', SessionController.login);

routes.get('/dashboard', DashboardController.show);
routes.post('/places/:place_id/reserve', ReserveController.store);
routes.get('/reserves', ReserveController.index);
routes.delete('/reserves/cancel', ReserveController.destroy);


/// Parte Frontend

// Index
routes.get(`/`, async function (req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    
    if(req.session.loggedIn)
        sessao_feita = req.session
    else
        sessao_feita = {conta: { username:"Nao logado" } }

    // console.log(req.session._id)

    res.render('index', { title: 'Shared Spaces | Reserve seu espaço', bodyClass:"homepage", lugares:json, sessao:sessao_feita });
});

// Cadastro e Login
routes.get('/cadastrar', async function(req, res) {
    if(req.session.loggedIn)
        sessao_feita = req.session
    else
        sessao_feita = {conta: { username:"Nao logado" } }
    
    res.render('cadastrar', { title: 'Shared Spaces | Cadastrar', bodyClass:"login-page", sessao:sessao_feita });
});
routes.get('/login', function(req, res, next) {
    if(req.session.loggedIn)
        sessao_feita = req.session
    else
        sessao_feita = {conta: { username:"Nao logado" } }
    
    res.render('login', { title: 'Shared Spaces | Login', bodyClass:"login-page", sessao:sessao_feita });
});

routes.get('/logout', async function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = {conta: { username:"Nao logado" } }
        req.session.destroy();
    }
    // console.log(req.session)
    res.redirect('/')
});

// Conta
routes.get('/minha-conta', function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session
        res.render('minha-conta', { title: 'Shared Spaces | Minha conta', bodyClass:"minhaconta-page", sessao:sessao_feita });
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});
routes.get('/alterar-dados', function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session
        res.render('alterar-dados', { title: 'Shared Spaces | Alterar dados', bodyClass:"minhaconta-page", sessao:sessao_feita });
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});

routes.get('/sala/:id', async function(req, res) {
    
    var lugar_id = req.params.id;
    const response = await fetch('http://localhost:3333/placefind?place_id='+lugar_id);
    const json = await response.json();
    
    if(req.session.loggedIn)
        sessao_feita = req.session
    else
        sessao_feita = {conta: { username:"Nao logado" } }
    
    res.render('sala', { title: 'Shared Spaces | ' + json.nome, bodyClass:"sala-page", lugares:json, sessao:sessao_feita });
});



routes.get('/reservar', async function(req, res) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();

    if(req.session.loggedIn)
        sessao_feita = req.session
    else
        sessao_feita = {conta: { username:"Nao logado" } }
    
    res.render('reservar', { title: 'Shared Spaces | Catalogo de reservas', bodyClass:"reservar-page", lugares:json, sessao:sessao_feita });
});

// Parte admin
routes.get('/admin/administrar-reservas', async function(req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    res.render('admin/administrar-reservas', { title: 'Administrar Reservas', bodyClass:"reservar-page", lugares:json });
});


export default routes;