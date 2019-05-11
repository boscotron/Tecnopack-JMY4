/*
La licencia MIT (MIT)

Copyright (c) 2019 Concomsis S.A. de C.V.
 
Por la presente se otorga el permiso, sin cargo, a cualquier persona que obtenga una copia de
este software y los archivos de documentación asociados (el "Software"), para tratar en
el Software sin restricciones, incluidos, entre otros, los derechos de
usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y / o vender copias de
el Software, y para permitir que las personas a quienes se suministra el Software lo hagan,
sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
Copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITOS, INCLUIDOS, PERO NO LIMITADOS A LAS GARANTÍAS DE COMERCIABILIDAD, APTITUD
PARA UN PROPÓSITO PARTICULAR Y NO INCUMPLIMIENTO. EN NINGÚN CASO LOS AUTORES O
LOS TITULARES DEL DERECHO DE AUTOR SERÁN RESPONSABLES POR CUALQUIER RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, SI
EN UNA ACCIÓN DE CONTRATO, CORTE O DE OTRA MANERA, DERIVADO DE, FUERA O EN
CONEXIÓN CON EL SOFTWARE O EL USO U OTRAS REPARACIONES EN EL SOFTWARE.
*/ 
'use strict'; 
/////////////////////// CON FIREBASE         
         
const functions = require('firebase-functions'); 
const admin = require('firebase-admin');
admin.initializeApp();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
 
const express = require('express'); 
const engines = require('consolidate');
const hbs = require('hbs');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
///  
const jmy = require('comsis_jmy');
const jmy_admin = require('comsis_jmy_admin');
const jmy_connect= require('./config/key');
const jmy_tpk = require('./routes/jmy_tpk');
let context = jmy.context;
app.use('/', jmy_admin);
app.use('/tpk', jmy_tpk);
  
app.use(jmy.co);
app.use(express.static(__dirname + '/public'));
app.set('view engine',"hbs");   
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', jmy.sesion(jmy_connect.key),async (req, res) => {

  const post = req.body;
  let acceso = req.accesos
  try {      
    console.log('post',post);
    let data=context(req);
    data.head.title="Coworking";
    res.render('social_dashboard',data);    
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error.message);
    res.sendStatus(500);
  }
});   
  
 
app.get('/tkn', jmy.sesion(jmy_connect.key),async (req, res) => {
  let acceso = req.accesos
  try {      
    let data=context(req);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('charset', 'utf-8');
    res.end('<pre>'+JSON.stringify([acceso,data])+'</pre>');    
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error);
    res.sendStatus(500);
  }
});



// Expose the API as a function
exports.api = functions.https.onRequest(app);

