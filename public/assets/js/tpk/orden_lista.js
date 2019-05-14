function operateFormatter(value, row, index) {
        return [
            '<div class="table-icons">',
                '<a rel="tooltip" title="Vista rápida" class="btn btn-simple btn-info btn-icon table-action view" href="javascript:void(0)">',
                    '<i class="far fa-address-card"></i>',
                '</a>',
                '<a rel="tooltip" title="Edit" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
                    '<i class="ti-pencil-alt"></i>',
                '</a>',
            '</div>',
        ].join('');
    }
$(document).ready(function name() {
    var $table = $('#bootstrap-table');
    let url_base = $("#url_base").val(),h='',c=1,table=[],data={};
    console.log(url_base);
    
    $.ajax({
        url: url_base+"tpk/ordenes/lista",
        type: "POST",
        data: JSON.stringify({}), 
        contentType:false, 
        dataType: 'json',
        cache: false,
        processData: false,
        success: function(r){
            console.log(r);	
            const c = r.col || [];
            let ta = {columns:[],data:[]},info={};
            ta.columns.push({
                field: "state",
                fieldid:"id",
                checkbox:true
              });
            ta.columns.push({
                field: "id",
                fieldid:"id",
                class:"ocultar",
                sortClass:"ocultar",
              });
            c.forEach(cc => {
                ta.columns.push({
                    field: cc,
                    title: filtro(cc),
                    sortable:true
                  });
            });
            ta.columns.push({
                field: "actions",
                title: "Acciones",
                sortClass:"td-actions text-right",
                events:"operateEvents",
                formatter:"operateFormatter"
              });
            r.e.forEach(rr => {
                let ct={},id=rr.jmy_ver.id_f;
                rr=rr.jmy_ver.ot;
                console.log('r',rr);
                ct['state']="ssss";
                ct['id'] = id || '';
                if(c.includes('referencia')) ct['referencia'] = rr.referencia || '';
                if(c.includes('fecha')) ct['fecha'] = rr.orden.fecha || '';
                if(c.includes('marca')) ct['marca'] = filtro(rr.orden.marca  || '');
                if(c.includes('cliente')) ct['cliente'] = filtro(rr.orden.cliente  || '');
                if(c.includes('descripcion')) ct['descripcion'] = rr.orden.descripcion || '';
                if(c.includes('estado')) ct['estado'] = filtro(rr.orden.estado  || '');
                c['actions']="";
                data[id]=rr;
                ta.data.push(ct);
            });
            window.operateEvents = {
                'click .view': function (e, value, row, index) {
                    h='';
                    h+='<table class="table table-hover"><tbody>';
                    Object.keys(data[row.id]).forEach(function (e) {
                        console.log(e);
                        const tm = data[row.id][e];
                        if(typeof tm ==="string")
                            h+='<tr class="'+((c>3)?'ocultar':'')+'"><td>'+filtro(e)+'</td><td>'+filtro(tm)+'</td></tr>';
                        if(typeof tm ==="object")
                            Object.keys(tm).forEach(function (eb) {

                                h+='<tr class="'+((c>3)?'ocultar':'')+'"><td>'+filtro(eb)+'</td><td>'+filtro(data[row.id][e][eb],(['foto'].includes(eb))?{type:'imagen_perfil'}:{type:''})+'</td></tr>';
                            });
                    });
                    h+='</tbody></table>';
                    Swal.fire({
                        title: "Resumen de la orden",
                        html: h,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Ver más información",
                        cancelButtonText: "Cerrar",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }).then( function (r) {
                        if(typeof r.value !="undefined")
                            window.location.href = url_base+'tpk/orden/'+row.id;
                    });
                },
                'click .edit': function (e, value, row, index) {
                    window.location.href = url_base+'/tpk/orden/'+row.id;
                },
            };
            $table.bootstrapTable({
                toolbar: ".toolbar",
                columns:ta.columns,
                data:ta.data,
                clickToSelect: true,
                showRefresh: true,
                search: true,
                showToggle: true,
                showColumns: true,
                pagination: true,
                searchAlign: 'left',
                pageSize: 50,
                clickToSelect: false,
                pageList: [50,100,150,200],
        
                formatShowingRows: function(pageFrom, pageTo, totalRows){
                    //do nothing here, we don't want to show the text "showing x of y from..."
                },
                formatRecordsPerPage: function(pageNumber){
                    return pageNumber + " rows visible";
                },
                icons: {
                    refresh: 'fa fa-refresh',
                    toggle: 'fa fa-th-list',
                    columns: 'fa fa-columns',
                    detailOpen: 'fa fa-plus-circle',
                    detailClose: 'ti-close'
                }
            });
        
            //activate the tooltips after the data table is initialized
            $('[rel="tooltip"]').tooltip();
        
            $(window).resize(function () {
                $table.bootstrapTable('resetView');
            });

        },
        error: function(result) {
            console.log(result);
            $(".btn-finish").prop('disabled', false);
            swal("!UPS!", "Ocurrió un error al conectar con el servidor", "error");
        }
    });
    
});