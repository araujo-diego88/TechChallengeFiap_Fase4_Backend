import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";

import SessionController from "./controllers/SessionController";
import PlaceController from "./controllers/PlaceController";
import ReserveController from "./controllers/ReserveController";

const routes = new Router();
const upload = multer(uploadConfig);

var sessao_feita = {conta: { username:"Nao logado" } }

/// Parte Backend

routes.get('/places', PlaceController.index);
routes.get('/placefind', PlaceController.id_find);
routes.post('/places', upload.single('thumbnail') ,PlaceController.store);
routes.post('/places/:place_id', upload.single('thumbnail'), PlaceController.update);
routes.post('/removeplace/:place_id', PlaceController.destroy);

routes.post('/sessions', SessionController.store);
routes.post('/updateconta', SessionController.update);
routes.post('/loginsession', SessionController.login);

routes.post('/places/:place_id/reserve', ReserveController.store);
routes.get('/reserves', ReserveController.index);
routes.post('/reserves/cancel/:reserve_id', ReserveController.destroy);


/// Parte Frontend

// Index
routes.get(`/`, async function (req, res, next) {
    // const response = await fetch('http://localhost:3333/places?status=true');
    const json = await PlaceController.index(req, res)
    
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
    if(req.session.loggedIn) {
        sessao_feita = req.session
        res.redirect('/minha-conta')
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.render('login', { title: 'Shared Spaces | Login', bodyClass:"login-page", sessao:sessao_feita });
    }
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
routes.get('/registrar-espaco', function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session
        res.render('registrar-espaco', { title: 'Shared Spaces | Registrar Espaço', bodyClass:"minhaconta-page", sessao:sessao_feita });
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});

routes.get('/gerenciar-espacos', async function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session

        const json = await PlaceController.find_user_places(req, res)

        res.render('gerenciar-espacos', { title: 'Shared Spaces | Gerenciar Espaço', bodyClass:"homepage", sessao:sessao_feita, lugares:json });
        // console.log(json);
        
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});
routes.get('/gerenciar-reservas', async function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session

        const json = await ReserveController.index(req, res)

        res.render('gerenciar-reservas', { title: 'Shared Spaces | Gerenciar Reservas', bodyClass:"homepage", sessao:sessao_feita, reservas:json });
        // console.log(json);
        
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});

routes.get('/adm-gerenciar-espacos', async function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session

        const json = await PlaceController.index_all(req, res)
        if(req.session.conta.isAdmin)
            res.render('gerenciar-espacos', { title: 'Shared Spaces | *ADMIN* Gerenciar Espaço', bodyClass:"homepage", sessao:sessao_feita, lugares:json });
        else 
            res.render('403', { title: 'Shared Spaces | Acesso negado', bodyClass:"homepage", sessao:sessao_feita });

        // console.log(json);
        
    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});

routes.get('/gerenciar/:id', async function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = req.session

        // var lugar_id = req.params.id;

        const json = await PlaceController.gerency_single(req, res)
        // console.log(json);

        if(json) {
            res.render('gerenciar', { title: 'Shared Spaces | Gerenciar '+ json.nome, bodyClass:"homepage", sessao:sessao_feita, lugar:json, id_lugar:req.params.id });
        }
        else {
            res.render('401', { title: 'Shared Spaces | Acesso negado', bodyClass:"homepage", sessao:sessao_feita });
        }

    }
    else {
        sessao_feita = {conta: { username:"Nao logado" } }
        res.redirect('/login')
    }
});

routes.get('/sala/:id', async function(req, res) {
    
    // var lugar_id = req.params.id;
    // const response = await fetch('http://localhost:3333/placefind?place_id='+lugar_id);
    // const json = await response.json();
    const json = await PlaceController.id_find(req, res)
    
    if(req.session.loggedIn)
        sessao_feita = req.session
    else
        sessao_feita = {conta: { username:"Nao logado" } }
    
    res.render('sala', { title: 'Shared Spaces | ' + json.nome, bodyClass:"sala-page", lugares:json, sessao:sessao_feita });
});

export default routes;