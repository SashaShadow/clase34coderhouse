import express from "express";
import session from 'express-session';
const { Router } = express;
import { logger200, logger404, validateNumber, uploadFile } from "./middlewares.js";
import { logger, loggerError } from "./logger.js";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import productsRouter from "./routers/productsRouter.js";
import cartRouter from "./routers/cartsRouter.js";
import randomRouter from './routers/randomRouter.js';
import { upload } from './multer.js';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';
import passport from 'passport';
import { login, signup, serialize, deSerialize } from './auth/auth.js';
import { loginRoute, loginPost, signupRoute, signupPost, logout } from './auth/routes.js';
import { getMsgs, postMsgs } from './chat/msgRoutes.js';
import { ioSockets } from './sockets/sockets.js';
import minimist from "minimist";
import "dotenv/config.js";

const numCpus = os.cpus().length

const options = {
  alias: {
    p: 'PORT',
    m: 'MODO'
  }
}

const myArgs = minimist(process.argv.slice(2), options)
const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const router = Router();

const PORT = myArgs.PORT || process.env.PORT || 8080;

const serverUp = () => {
  const server = httpServer.listen(PORT, () => {
    logger.info(`Servidor http escuchando en el puerto ${server.address().port}`)
  })
  server.on("error", error => loggerError.error(`Error en servidor ${error}`));
}

if (myArgs.MODO === 'cluster') {
  if (cluster.isPrimary) {
    logger.info(`El master con pid numero ${process.pid} esta funcionando`);

    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`el worker ${worker.process.pid} murió`)
    });

  } else {
    serverUp();
  }
} else if (myArgs.MODO === 'fork' || !myArgs.MODO) {
  serverUp();
} 

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(compression()); //desactivar o activar para chequear el peso de la ruta info
app.use("/api", express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 
app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
    mongoUrl: process.env.MONGODB,
    mongoOptions: advancedOptions,
    ttl: 600
  }),
    secret: 'fahrenheit',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//PASSPORT STRATEGIES
login();
signup();
serialize();
deSerialize();

//SOCKETS
ioSockets(io);

//RUTAS MENSAJES CHAT
router.get('/mensajes', getMsgs())
router.post('/mensajes', postMsgs())

//HOME
router.get("/", (req, res) => {
    if (req.user) {
        req.session.user = req.user;
        res.render("pages/index.ejs", {user: req.user});
    } else {
        res.redirect('/api/login')
    }
});

router.get("/profile", (req, res) => {
    if (req.user) {
      res.render("pages/profile.ejs", {user: req.user});
    } else {
      res.redirect('/api/login')
    }
})

// RUTAS AUTH
router.get('/login', loginRoute())
router.post('/login', loginPost())
router.get('/signup', signupRoute())
router.post('/signup', upload.single('photo'), uploadFile(), validateNumber(), signupPost())
router.get('/logout', logout())

//INFO (XD)
router.get('/info', (req, res) => {
  const information = { OS: process.platform, 
    nodeversion: process.version, 
    memoryusage: process.memoryUsage().rss, 
    execpath: process.title, pid: process.pid,
    projfolder: process.cwd(), procnum: numCpus};
  
  // console.log(information); //comentar o descomentar para hacer los tests
  return res.render('pages/info.ejs', {info: process, cpus: numCpus})
})

app.use('/api', logger200(), router);
app.use('/api/random',  logger200(), randomRouter);
app.use('/api/products', logger200(), productsRouter);
app.use('/api/cart', cartRouter); 
app.use(logger404());
