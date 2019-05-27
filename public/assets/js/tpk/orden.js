$(document).ready(function(){
     let container = document.getElementById("jsoneditor"),
        j = document.getElementById("jsoneditor").innerHTML,h="",v={},c=1,cf=6,l={v:'<i class="fas fa-plus-circle"></i> Ver todo los registros',o:'<i class="fas fa-minus-circle"></i> Ver menos regitros'};
    if(j!=''&& typeof j =="string")
      j=JSON.parse(j);
    console.log(j);
    document.getElementById("jsoneditor").innerHTML='';
    let editor = new JSONEditor(container, {
      mode: 'view',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      onError: function (err) {
        alert(err.toString());
      },
      onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    });
    editor.set(j[0].jmy_ver);
    h+='<table class="table table-hover"><tbody>';
    v=j[0].jmy_ver.ot;
    Object.keys(v).forEach(function (e) {
        console.log(e);
        const tm = v[e];
        if(typeof tm ==="string"){
            h+='<tr class="'+((c>cf)?'ocultar':'')+'"><td>'+filtro(e)+'</td><td>'+filtro(tm)+'</td></tr>'; c++;}
        if(typeof tm ==="object")
            Object.keys(tm).forEach(function (eb) {
                if(typeof v[e][eb] == "object") v[e][eb]=v[e][eb].join(',');
                h+='<tr class="'+((c>cf)?'ocultar':'')+'"><td>'+filtro(eb)+'</td><td>'+filtro(v[e][eb],(['foto'].includes(eb))?{type:'imagen_perfil'}:{type:''})+'</td></tr>'; c++;
            });
    });
    h+='</tbody></table><button id="ver_todo" class="btn btn-block">'+l.v+'</button>';
    $("#solicitud_brief").html(h);
    $(".ocultar").hide();
    $("#ver_todo").on('click',function (e) {
      e.preventDefault();
      $(".ocultar").toggle(80);
      $(this).html((($(this).html()==l.v)?l.o:l.v));
  });
    google.charts.load("current", {packages:["timeline"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
  
      var container = document.getElementById('example3.1');
      var chart = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: 'string', id: 'Position' });
      dataTable.addColumn({ type: 'string', id: 'Name' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });
      dataTable.addRows([
        [ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
        [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
        [ 'President', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
        [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
        [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
        [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
        [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)],
        [ 'Secretary of State', 'John Jay', new Date(1789, 8, 25), new Date(1790, 2, 22)],
        [ 'Secretary of State', 'Thomas Jefferson', new Date(1790, 2, 22), new Date(1793, 11, 31)],
        [ 'Secretary of State', 'Edmund Randolph', new Date(1794, 0, 2), new Date(1795, 7, 20)],
        [ 'Secretary of State', 'Timothy Pickering', new Date(1795, 7, 20), new Date(1800, 4, 12)],
        [ 'Secretary of State', 'Charles Lee', new Date(1800, 4, 13), new Date(1800, 5, 5)],
        [ 'Secretary of State', 'John Marshall', new Date(1800, 5, 13), new Date(1801, 2, 4)],
        [ 'Secretary of State', 'Levi Lincoln', new Date(1801, 2, 5), new Date(1801, 4, 1)],
        [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)]
      ]);
  
      chart.draw(dataTable);
    }

   
 
});