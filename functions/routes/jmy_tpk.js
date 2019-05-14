/*
La licencia MIT (MIT)

Copyright (c) 2019 Concomsis S.A. de C.V.
-Boscotron2000-
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
const express = require('express');
const router = express.Router();
const jmy = require('comsis_jmy');
const jmy_connect= require('../config/key.js');
router.use(jmy.co); 
router.get('/ordenes', async (req, res) => {

    res.send(JSON.stringify([req.hostname]));    
    //res.redirect(301,"");
});
router.get('/ordenes/:c', jmy.sesion(jmy_connect.key),async (req, res) => {
    try {    
        let d=jmy.context(req);
        const a = req.accesos; 
        
        switch (req.params.c) {
            case 'dashboard':
                res.send('dashboard');
            break;    
            case 'nuevo':
                d.carga={
                    css:[
                        {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"},
                        {url:"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css"},
                    ],
                    js:[
                        {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
                        {url:"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"},
                        {url:"https://unpkg.com/popper.js"},
                        {url:d.head.cdn+"assets/js/jmy/jmy_web_node.js"},
                        {url:d.head.cdn+"assets/js/tpk/utilidades.js?v="+Date.now()},
                        {url:d.head.cdn+"assets/js/tpk/orden_nuevo.js"}
                    ]
                };
                d.head.title="Nuevo brief";
                d.out['prefijo']="tpk_orden_nuevo"; 
                res.render('tpk_orden_nuevo',d);
                    
            break;    
            case 'lista':
                d.carga={
                    css:[
                        {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"},
                        {url:"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css"},
                    ],
                    js:[
                        {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
                        {url:"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"},
                        {url:"https://unpkg.com/popper.js"},
                        {url:d.head.cdn+"assets/js/jmy/jmy_web_node.js"},
                        {url:d.head.cdn+"assets/js/tpk/utilidades.js?v="+Date.now()},
                        {url:d.head.cdn+"assets/js/tpk/orden_lista.js?v="+Date.now()}
                    ]
                };
                d.head.title="Listado de ordenes";
                d.out['prefijo']="tpk_ordenes_lista"; 
                res.render('tpk_ordenes_lista',d);
            break;    
            default:
              res.render('404',d);
            break;
        }
    } catch(e) {
        console.log('administrador_g er:',e);                    
        res.status(500).send('Ups! ocurrió un error en el servidor, esta siendo reportado, por favor intente más tarde.');
        return;
    }
});
router.post('/ordenes/:c', jmy.sesion(jmy_connect.key),async (req, res) => {
     
    try {    
        let post = (typeof req.body == 'string')?JSON.parse(req.body):{},
            d=jmy.context(req);
        const a = req.accesos; 
        
        switch (req.params.c) {
            case 'lista':
                /// ver
                jmy.ver([{
                    tabla:'ordenes',
                    api:'tpk_ventas',
                }],a).then(function (e){
                    let col=[];
                    switch ('f') {
                        case 'ventas':
                        break;
                        default:
                            col=['referencia','fecha','marca','descripcion','estado'];
                            break;
                    }
                    res.send(JSON.stringify({ 
                        col:col,
                        e:e,
                    }));
                });
            break;
            case 'guardar':  
                console.log(post);
                let g=post;
                g['estado']='asignacion_de_diseno';
                
                let id=(typeof g['id']=="string")?d['id']:null;
                jmy.guardar([{
                    tabla:'ordenes',
                    api:'tpk_ventas',
                    id:id,
                    guardar:{
                        orden:g,
                        estado:"asignacion_de_diseno",
                        vendedor:{
                            user_id:a.user_info.uid,
                            name:a.user_info.nombre,
                            foto:a.user_info.url_foto,
                            estado:"nuevo"
                        }
                    }
                }],a).then(function(e){
                    res.send(JSON.stringify(e[0].jmy_guardar))
                });
            //res.send(JSON.stringify(post));
            break;    
            default:
              res.send(JSON.stringify({error:'no fn'}));
            break;
        }
    } catch(e) {
        console.log('administrador_g er:',e);                    
        res.status(500).send('Ups! ocurrió un error en el servidor, esta siendo reportado, por favor intente más tarde.');
        return;
    }
});
router.get('/orden/:i', jmy.sesion(jmy_connect.key),async (req, res) => {
    try {    
        let d=jmy.context(req);
        const a=req.accesos,id=req.params.i|| null; 


        d.head.title="Sin referencia";
        if(id==undefined){
            res.render('tpk_orden_404',d);
        }else{
            jmy.ver([{
                tabla:'ordenes',
                api:'tpk_ventas',
                id:id,
            }],a).then(function (e){
                d.out['e']=JSON.stringify(e);
                d.out['detalles_brief']=[
                    {
                        nom:"Fecha",
                        var:"2018-01-01",
                    },
                    {
                        nom:"Cliente",
                        var:"2018-01-01",
                    },
                    {
                        nom:"Marca",
                        var:"2018-01-01",
                    },
                    {
                        nom:"Cantidad a cotizar",
                        var:"2018-01-01",
                    },
                    {
                        nom:"Corrugado",
                        var:"2018-01-01",
                    },
                    {
                        nom:"Charola",
                        var:"2018-01-01",
                    }
                ];
                d.head.title="Sin referencia";
                d.carga.css.push({url:d.head.cdn+"assets/jsoneditor/dist/jsoneditor.min.css"});
                d.carga.js.push({url:d.head.cdn+"assets/jsoneditor/dist/jsoneditor.min.js"})
                d.carga.js.push({url:"https://www.gstatic.com/charts/loader.js"});
                d.carga.js.push({url:d.head.cdn+"assets/js/tpk/orden.js?d="+Date.now() });;

                res.render('tpk_orden_detalles',d);
            });
        }

    } catch(e) {
        console.log('administrador_g er:',e);                    
        res.status(500).send('Ups! ocurrió un error en el servidor, esta siendo reportado, por favor intente más tarde.');
        return;
    }
});
module.exports = router;