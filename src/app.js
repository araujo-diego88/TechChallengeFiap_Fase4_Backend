import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import routes from './routes';
var session=require('express-session');
var cookieParser = require('cookie-parser');

// var indexRouter = require('./routes-frontend');


class App{

  constructor(){
    this.server = express();

    mongoose.connect('mongodb+srv://backFase4:backFase4@backfase4.wpybnh1.mongodb.net/backFase4?retryWrites=true&w=majority&appName=backFase4');

    this.middlewares();
    this.routes();
  }  

  middlewares() {

    this.server.use(cors());

    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')) );

    this.server.set('views', path.join(__dirname, 'views'));
    this.server.set('view engine', 'ejs');
    this.server.use(express.static(path.join(__dirname, 'public')));
    // this.server.use('/', indexRouter);
    this.server.use(cookieParser());

    this.server.use(express.urlencoded({ extended: false }));

    this.server.use('/css', express.static(path.resolve(__dirname, 'public/stylesheets/css')));
    this.server.use('/css', express.static(path.resolve(__dirname,'..', 'node_modules/bootstrap/dist/css')));
    this.server.use('/js', express.static(path.resolve(__dirname, '..', 'node_modules/bootstrap/dist/js')));
    this.server.use('/js', express.static(path.resolve(__dirname, '..', 'node_modules/jquery/dist')));

    this.server.use(session({
        secret: 'AC44-FIAP-AppQ38Saa',
        name: "teste-techchalllenge",
        resave: false,
        saveUninitialized: true,
        cookie:{
          maxAge: 24 * 60 * 60 * 1000 * 7, //seven days
          secure:false
        }
    }));
    

    console.log(__dirname);

    this.server.set('trust proxy', 1); // Trust first proxy
    this.server.use(express.json());
  }

  routes(){
    this.server.use(routes);
  }

}
export default new App().server;