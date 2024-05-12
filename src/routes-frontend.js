var express = require('express');
var router = express.Router();

router.get(`/`, async function (req, res) {

    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    res.render('index', { title: 'Shared Spaces | Reserve seu espaço', bodyClass:"homepage", lugares:json });
});


router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Shared Spaces | Login', bodyClass:"login-page" });
});

router.get('/sala/:id', async function(req, res, next) {
    
    var lugar_id = req.params.id;
    const response = await fetch('http://localhost:3333/placefind?place_id='+lugar_id);
    const json = await response.json();
    
    res.render('sala', { title: 'Shared Spaces | ' + json.nome, bodyClass:"sala-page", lugares:json });
});

router.get('/reservar', async function(req, res, next) {
    const response = await fetch('http://localhost:3333/places?status=true');
    const json = await response.json();
    res.render('reservar', { title: 'Shared Spaces | Catalogo de reservas', bodyClass:"reservar-page", lugares:json });
});
router.get('/teste', function(req, res, next) {
    res.render('teste', { title: 'Shared Spaces | Catalogo de reservas', bodyClass:"teste-page" });
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
