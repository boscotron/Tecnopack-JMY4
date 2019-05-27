$.ajax({
    url: url_base + 'administrador/jmyWebAjG/tkn',
    type: 'post',	
    contentType:false,
    dataType: 'json',
    cache: false,
    processData: false,
    success: function(r) {
        var container = document.getElementById('jsoneditor');
        var options = {
            mode: 'view'
        };
        var editor = new JSONEditor(container, options,r);
    },
    error: function(r) {
        swal("UPS!","Ocurrió un error al guardar. Intenta de nuevo.","warning", {
            buttons: false,
            timer: 3000,
        });
        console.error(r);
    },
    data: JSON.stringify({})
});