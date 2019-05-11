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

                d=jmy.context(req,{
                    css:[
                    {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"},
                    {url:"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css"},
                    ],
                    js:[
                    {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
                    {url:"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"},
                    {url:"//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"},
                    {url:d.head.cdn+"assets/js/tpk/orden_nuevo.js"}
                    ]
                });
                d.head.title="Nuevo brief";
                d.out['prefijo']="tpk_orden_nuevo"; 
                res.render('tpk_orden_nuevo',d);
                    
            break;    
            case 'lista':
                res.send('lista');
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
router.get('/orden/:i', jmy.sesion(jmy_connect.key),async (req, res) => {
    try {    
        let d=jmy.context(req);
        const a = req.accesos; 
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
        d.head.title="Detalles de orden";
        d.carga.js.push({url:"https://www.gstatic.com/charts/loader.js"});
        d.carga.js.push({url:d.head.cdn+"assets/js/tpk/orden.js"});

        res.render('tpk_orden_detalles',d);

    } catch(e) {
        console.log('administrador_g er:',e);                    
        res.status(500).send('Ups! ocurrió un error en el servidor, esta siendo reportado, por favor intente más tarde.');
        return;
    }
});
module.exports = router;