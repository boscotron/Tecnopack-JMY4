let opS = 0,g = [],l={v:'<i class="fas fa-plus-circle"></i> Ver todo los registros',o:'<i class="fas fa-minus-circle"></i> Ver menos regitros'};

$(document).ready(function(){
    
    let $validator = $("#wizardForm").validate({
      rules: {
       descripcion: {
            required: true,
            minlength: 5
        },
        cantidad_a_cotizar: {
            required: false,
            minlength: 5
        },
        contenido_y_orden: {
            required: false,
            minlength: 5
        }
      }
    });
    // you can also use the nav-pills-[blue | azure | green | orange | red] for a different color of wizard
    $('#wizardCard').bootstrapWizard({
        tabClass: 'nav nav-pills',
        nextSelector: '.btn-next',
        previousSelector: '.btn-back',
        onNext: function(tab, navigation, index) {
            var $valid = $('#wizardForm').valid();

            if(!$valid) {
                $validator.f1cusInvalid();
                return false;
            }
        },
        onInit : function(tab, navigation, index){

            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            $width = 100/$total;

            $display_width = $(document).width();

            if($display_width < 600 && $total > 3){
               $width = 50;
            }

            navigation.find('li').css('width',$width + '%');
        },
        onTabClick : function(tab, navigation, index){
            // Disable the posibility to click on tabs
            return false;
        },
        onTabShow: function(tab, navigation, index) {
            let $total = navigation.find('li').length;
            let $current = index+1;
            let wizard = navigation.closest('.card-wizard');
            if(index==1 && opS==0)
                opciones();
            if(index==2 )
                confirmar();
            if($current >= $total) {
                $(wizard).find('.btn-next').hide();
                $(wizard).find('.btn-finish').show();
            } else if($current == 1){
                $(wizard).find('.btn-back').hide();
            } else {
                $(wizard).find('.btn-back').show();
                $(wizard).find('.btn-next').show();
                $(wizard).find('.btn-finish').hide();
            }
        }
    });
    let date = new Date(Date.now());
    $("#fecha").val(date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear());
    $('#fecha').prop('readonly', true);
    $("#ver_todo").on('click',function (e) {
        e.preventDefault();
        $(".ocultar").toggle(80);
        $(this).html((($(this).html()==l.v)?l.o:l.v));
    });
});

function confirmar(){
    let h='<tbody>',c=1;g={};
    $(".nuevo_brief").each(function () {
        let t=$(this),v='',f={};
        switch (t.attr('type')) {
            case 'checkbox':
                v=(t.is(':checked'))?t.val():'';
            break;
            default:
                v=t.val();
            break;
        }
        f={n:t.attr('id'),v:v};
        if(f.n!=undefined&&f.v){
            if(f.n.substr(15,8)=='_cliente') f.n='cliente';
            if(f.n.substr(15,6)=='_marca') f.n='marca';
            h+='<tr class="'+((c>3)?'ocultar':'')+'"><td>'+filtro(f.n)+'</td><td>'+filtro(f.v)+'</td></tr>';
            g[f.n]=f.v;c++;
        }
        $("#datos").html('');
        $("#datos").html(h+'</body>');
    });
    $(".ocultar").hide();
    $("#ver_todo").html('');
    $("#ver_todo").html(l.v);
    console.log(g);
};
function opciones(){
    console.log('opciones');
    
    let data = [{
        id: "bandeja",
        text: 'Bandeja'
    },{
        id: "blister",
        text: 'Blister'
    },{
        id: "counter",
        text: 'Counter'
    },{
        id: "dispenser",
        text: 'Dispenser'
    },{
        id: "etiqueta",
        text: 'Etiqueta'
    },{
        id: "esquinero",
        text: 'Esquinero'
    },{
        id: "fajilla",
        text: 'Fajilla'
    },{
        id: "faldon",
        text: 'Faldon'
    },{
        id: "floordisplay",
        text: 'Floordisplay'
    },{
        id: "plegadiza",
        text: 'Plegadiza'
    },{
        id: "pallet",
        text: 'Pallet'
    },{
        id: "rts",
        text: 'RTS'
    },{
        id: "Sidekick",
        text: 'Sidekick'
    },{
        id: "tacon",
        text: 'Tacon'
    }
    ];

    $("#proyecto_desarrollar").select2({
    data: data,
    tags: true,
    });
    let acabados = [{
            id: "barniz_especial",
            text: 'Barniz especial'
        },{
            id: "barniz_uv_brillante",
            text: 'Barniz UV brillante'
        },{
            id: "barniz_uv_mate",
            text: 'Barniz UV Mate'
        },{
            id: "hot_stamping",
            text: 'Hot Stamping'
        },{
            id: "metalizados",
            text: 'Metalizados'
        },{
            id: "plastificado_brillante",
            text: 'Plastificado brillante'
        },{
            id: "plastificado_mate",
            text: 'Plastificado Mate'
        },{
            id: "realce",
            text: 'Realce'
        },
    ];

    $("#acabados_especiales").select2({
    data: acabados,
    tags:true
    });

    opS=1;
}

function onFinishWizard(){
    let r = [/*'cliente','marca','contenido_y_orden','descripcion'*/],b=1,f=[];
    $(".btn-finish").prop('disabled', true);
    if(typeof g['observaciones'] =="undefined" && $("#observaciones").val()!='')
        g['observaciones']=$("#observaciones").val();
    r.forEach(e => {
        b=(g[e]!=undefined && b==1)?b:0;
        if(!b)
            f.push(filtro(e));
    });
    if(!b)
        swal("!Falta algo!", "es necesario que ingreses la información de "+f.join(', '), "warning");
    else
        $.ajax({
            url: url_base+"tpk/ordenes/guardar",
            type: "POST",
            data: JSON.stringify(g),
            contentType:false,
            dataType: 'json',
            cache: false,
            processData: false,
            success: function(r){
                console.log(r);	
                $(".btn-finish").prop('disabled', false);
                if(r.error!='')
                    swal("!UPS!", "Ocurrió un error: "+r.error, "warning");
                else{       
                let timerInterval
                    Swal.fire({
                    title: '!Listo!',
                    html: 'Tu brief fue guardado correctamente. <small>Redireccionando a listado en <strong></strong> seg.</small>',
                    timer: 5000,
                    footer: '<a href="'+url_base+'tpk/orden/'+r.out.cabecera.id+'"> Ver brief </a>',
                    onBeforeOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                        Swal.getContent().querySelector('strong')
                            .textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    onClose: () => {
                        window.location =url_base+'tpk/ordenes/lista';
                        clearInterval(timerInterval);
                    }
                    }).then((result) => {
                    if (
                        // Read more about handling dismissals
                        result.dismiss === Swal.DismissReason.timer
                    ) {
                        console.log('I was closed by the timer')
                    }
                    })
                }

                /*swal("!Listo!", "Tu brief fue guardado correctamente", "warning");
                swal("!UPS!", "No tienes permisos para guardar este brief", "warning");*/
            },
            error: function(result) {
                console.log(result);
                $(".btn-finish").prop('disabled', false);
                swal("!UPS!", "Ocurrió un error al conectar con el servidor", "error");
            }
        });
    
}

function buscarMarca(d=[]) {
    console.log('buscarMarca',d);
    let o = {
        p:$("#prefijo").val()
    };
    $("#cliente").attr("value",d);
    $("#ver_marca").html("");
    $("#ver_marca").html('<label class="control-label">Marca</label>'+

        '<select type="select" class="form-control input-sm btn-mini jmy_web nuevo_brief" '+
        'placeholder="Seleccione una marca" '+
        'data-lista-id="marcas_'+d+'" '+
        'data-lista-t="clientes" '+
        'data-idf=""'+
        'data-auto-guardar="no"'+
        'data-value="" '+
        'data-t="clientes" '+
        'data-a="tpk_ventas" '+
        'data-id="'+o.p+'_marca"  '+
        'id="marca" '+
        'tabindex="60" contenteditable="true" tabindex="31"'+
        '></select>');
    carga();
    
}