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


routes.post('/places', upload.single('thumbnail') ,PlaceController.store);

routes.get('/places', PlaceController.index);
routes.get('/placefind', PlaceController.id_find);
routes.put('/places/:place_id', upload.single('thumbnail'), PlaceController.update);
routes.delete('/places', PlaceController.destroy);

// routes.post('/sessions', upload.single('avatar'), SessionController.store);
routes.post('/sessions', SessionController.store);
routes.post('/loginsession', SessionController.login);


routes.get('/placefind', PlaceController.id_find);

routes.get('/dashboard', DashboardController.show);

routes.post('/places/:place_id/reserve', ReserveController.store);
routes.get('/reserves', ReserveController.index);
routes.delete('/reserves/cancel', ReserveController.destroy);


routes.get(`/`, async function (req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    
    if(req.session.loggedIn)
        sessao_feita = req.session

    // req.session.reload
    // console.log(next)
    // console.log(sessao_feita)
    

    res.render('index', { title: 'Shared Spaces | Reserve seu espaço', bodyClass:"homepage", lugares:json, sessao:sessao_feita });
});


routes.get('/login', function(req, res, next) {
    if(req.session.loggedIn)
        sessao_feita = req.session
    
    res.render('login', { title: 'Shared Spaces | Login', bodyClass:"login-page", sessao:sessao_feita });
});

routes.get('/logout', async function(req, res, next) {
    if(req.session.loggedIn) {
        sessao_feita = {conta: { username:"Nao logado" } }
        req.session.destroy();
    }
    console.log(req.session)
    res.redirect('/')
});


routes.get('/cadastrar', async function(req, res) {
    if(req.session.loggedIn)
        sessao_feita = req.session
    
    res.render('cadastrar', { title: 'Shared Spaces | Cadastrar', bodyClass:"login-page", sessao:sessao_feita });
});

routes.get('/sala/:id', async function(req, res) {
    
    var lugar_id = req.params.id;
    const response = await fetch('http://localhost:3333/placefind?place_id='+lugar_id);
    const json = await response.json();
    
    if(req.session.loggedIn)
        sessao_feita = req.session
    
    res.render('sala', { title: 'Shared Spaces | ' + json.nome, bodyClass:"sala-page", lugares:json, sessao:sessao_feita });
});

routes.get('/reservar', async function(req, res) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    var sessao_feita = JSON.stringify( {username:"Nao logado"} )
    console.log(req.session)
        sessao_feita = req.session
    
    res.render('reservar', { title: 'Shared Spaces | Catalogo de reservas', bodyClass:"reservar-page", lugares:json, sessao:sessao_feita });
});

// Parte admin
routes.get('/admin/administrar-reservas', async function(req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    res.render('admin/administrar-reservas', { title: 'Administrar Reservas', bodyClass:"reservar-page", lugares:json });
});


export default routes;