function favoritos_pop(gd=[]) {
	const	h_f=function (d=[],h='',c=0) {
		h+='<li class="jmy_li_favoritos_ac_n" data-sec="f" data-ac="n" > <a class="btn-warning"> <i class="fas fa-plus-circle"></i> Agregar nuevo</a></li>';
		d.forEach(e => {
			console.log(e);
			
			h+='<li><a class="jmy_li_favoritos_ac" href="'+url_base+e.url+'" >'+e.titulo+' <div class="pull-right"><button class="btn btn-xs btn-fill jmy_li_favoritos_ac_n" data-sec="f" data-i="'+c+'" data-ac="b"><i class="fas fa-times"></i></button><button class="btn btn-xs btn-fill jmy_li_favoritos_ac_n" data-sec="f" data-i="'+c+'" data-ac="a" ><i class="fas fa-archive"></i></button></br><small>'+jmy_hace_tiempo(e.fecha)+'</small></div><br><small>'+e.url+'</small> </a></li>';c++;
		});
		return h;
	},
	gp= function (d={}) {
		$.ajax({
			url: url_base + 'administrador/jmyWebAjG/fg',
			type: 'post',	
			contentType:false,
			dataType: 'json',
			cache: false,
			processData: false,
			success: function(re) {
				console.log(re);
				if(typeof re.f.l == "object")
					$('.jmy_li_favoritos').html(h_f(re.f.l));
				if($(".jmy_dashboard_favoritos_count").length && typeof re.f.c.activos == "string"){
					$(".jmy_dashboard_favoritos_count").html(re.f.c.activos);
					jmy_li_favoritos_ac_n(re);	
				}
			},
			error: function(re) {
				swal("UPS!","Ocurrió un error al guardar. Intenta de nuevo.","warning", {
					buttons: false,
					timer: 3000,
				});
				console.error(re);
			},
			data: JSON.stringify(d)
		});
	},
	acB =function (r={}) {
		$('.jmy_li_favoritos_ac_n').on('click',function (e) {
			e.preventDefault();
			let s=$(this).data('sec')||null,i=$(this).data('i')||null,ac=$(this).data('ac')||null,
				m ={
				f:{
					titulo:document.title,
					url:url,
					fecha:Date.now()
				}
			}
			if(typeof s == "string")
				switch (ac) {
					case 'n':
						r[s].l.unshift(m[s]);		
					break;
					case 'a':
						if(i)
							r[s].la.unshift(r[s].la[i]);	
						else
							break;
					case 'b':
						if(i)
							unset(r[s].la[i])
					break;
					default:
						break;
				}
			gp(r);
		});
	}
	jQuery(function ($) { 
		if ($('ul.jmy_li_favoritos').length) {
		
			$.ajax({
				url: url_base + 'administrador/jmyWebAjG/fl',
				type: 'post',	
				contentType:false,
				dataType: 'json',
				cache: false,
				processData: false,
				success: function(res) {
					console.log(res);
					r={
						f:{
							c:res.f.c || {},
							l:res.f.l || [],
							la:res.f.la || []
						}
					};
					if($(".jmy_dashboard_favoritos_count").length && typeof r.f.c.activos == "string")
						$(".jmy_dashboard_favoritos_count").html(r.f.c.activos);
				
					$('.jmy_li_favoritos').html(h_f(r.f.l));
					
				
					acB(r);					

				},
				error: function(res) {
					swal("UPS!","Ocurrió un error al guardar. Intenta de nuevo.","warning", {
						buttons: false,
						timer: 3000,
					});
					console.error(res);
				},
				data: JSON.stringify({})
			});
		}
	});
}

function jmy_web_guardar(gd=[]) {
	console.log(gd);
	jQuery(function ($) { 
		let g = {};
		$.when(gd.forEach(d => {
			if (d.d != '') {
				let v = [];
				let t = d.type;
				switch (t) {
					case'select':v=$("#"+d.d+" option:selected").val();break;
					case'textarea':v=$("textarea#"+d.d).val();break;
					case'input':case'calendar':case'number':case'date':case'email':case'password':case'hidden':v=$("#"+ d.d).val();break;
					default:v=(d.valor!=undefined)?d.valor:$("#"+d.d).html();break;
				}				
				if(g[d.a]==undefined)
					g[d.a]={};
				if(g[d.a][d.t]==undefined)
					g[d.a][d.t]={};		
				let f=d.idf||'nuevo';
				if(g[d.a][d.t][f]==undefined)
					g[d.a][d.t][f]={};					
				if(d.id!=undefined){
					let s=d.id.split("-");
					d.id=s[0];
					if(g[d.a][d.t][f][d.id]==undefined)
						if(s[1]!=undefined){
							g[d.a][d.t][f][d.id]={};
							if(g[d.a][d.t][f][d.id][s[1]]==undefined)
								g[d.a][d.t][f][d.id][s[1]]={};
							g[d.a][d.t][f][d.id][s[1]]=v;
						}else
							g[d.a][d.t][f][d.id]=v;
				}else{
					console.log(d.id);
				}
			}
		})).then(function (e) {
			console.log('ggggg',g);			
			$.ajax({
				url: url_base + 'administrador/jmyWebAjG/s',
				type: 'post',	
				contentType:false,
				dataType: 'json',
				cache: false,
				processData: false,
				success: function(res) {
					console.log(res);
					mensajeGuardado();
				},
				error: function(res) {
					swal("UPS!","Ocurrió un error al guardar. Intenta de nuevo.","warning", {
						buttons: false,
						timer: 3000,
					});
					console.error(res);
				},
				data: JSON.stringify(g)
			});
		console.log('save',g);
		});
	});
}
function jmy_web_url_friendly(a,s='-'){
	return a.trim()
				.toLowerCase()
				.replace(/[^a-z0-9]+/g,s)
				.replace(/^-+|-+$/g, s)
				.replace(/^-+|-+$/g,'')}
function jmy_web_caracteres_especiales(a="",s="!@#$^&%*()+=-[]\/{}|:<>?,."){
	for (let i=0;i<s.length; i++) {
		a=a.replace(new RegExp("\\" + s[i], 'gi'), '');
	}
	return a.toLowerCase()
			.replace(/ /g,"_")
			.replace(/á/gi,"a")
			.replace(/é/gi,"e")
			.replace(/í/gi,"i")
			.replace(/ó/gi,"o")
			.replace(/ú/gi,"u")
			.replace(/ñ/gi,"n");
}
function botones(d={}) {
	let left = d.pageX,
	 		top = d.pageY + 30;
	console.log(d);
	d=d.data;
	jQuery(function ($) { 
		$("#jmy_web").html("");
		$("#jmy_web").addClass("jmyweb-botones");
		$("#jmy_web").css({
			'left': left + 'px',
			'top': top + 'px',
			'z-index': '10000',
			'position': 'absolute',
			'border-radius': '5px',
			'padding': '5px',
			'background-color': 'rgba(200,200,200,0.65)'
		});
		let href = ($("#" + d.id).attr("href") != undefined) ? $("#" + d.id).attr("href") : false;
		let html = ''; 
		let btne = '';
		if(href!==false){		
			html = html + '<input type="text" value="'+href+'" id="jmy_web_href" placeholder="href:#"> ';
			btne = btne + '<a href="'+href+'" style="'+style.b_azul+'">[->]</a>';
		}		
		html = html + '<img src="'+leng.imgLogo+'" heigth="60"><button class="jmy_web_guardar" data-id="' + d.id + '" data-page="' + d.page + '" data-tabla="' + d.tabla + '" style="'+style.b_guardar+'">[=] '+leng.guardar+'</button>'+btne+'<button class="jmy_web_cancelar" style="'+style.b_cancelar+'">[x]</button>';
		$("#jmy_web").html(html);
		$("#jmy_web").show(250);
		$(".jmy_web_guardar").click(function() {
			jmy_web_guardar({data:d});
		});
		$(".jmy_web_cancelar").click(function(e) {
			$("#jmy_web").hide(250);
		});
	});
}

function herramientas(d = []) {
	let left = 100;
	let top = 5;
	jQuery(function ($) { 
	$("#jmy_web_tools").html("");
	$("#jmy_web_tools").addClass("jmyweb-botones");
	$("#jmy_web_tools").css({
		'right': left + 'px',
		'bottom': top + 'px',
		'position': 'fixed',
		'z-index': '100000'
	}); 2
	let html = '';
	/*if(href!==false)	
		html = html + '<input type="text" value="'+href+'" id="jmy_web_href" placeholder="href:'+d.data.id+'"> ';*/
	html = html + '<button class="jmy_t_guardar" style="'+style.h_guardar+'">[+] '+leng.guardar_cambios+'</button><button class="jmy_web_tools_cancelar" style="'+style.h_cancelar+'"> [x] '+leng.guardar_cambios+'</button>';
	$("#jmy_web_tools").html(html);
	$("#jmy_web_tools").show(250);
	$(".jmy_t_guardar").click(function() {
		guardarSinGuardar();
		$("#jmy_web_tools").hide(250);
	});
	$(".jmy_web_tools_cancelar").click(function(e) {
		$("#jmy_web_tools").hide(250);
	});
	});
}
function guardarSinGuardar(){
	jQuery(function ($) { 
		console.log(sinGuardar);
		let t = [];
		for (let i = 0; i < sinGuardar.length; i++) {
			t.push({
				"type": $("#" + sinGuardar[i]).attr("type"),
				"id": $("#" + sinGuardar[i]).data("id"),
				"idf": $("#" + sinGuardar[i]).data("idf"),
				"d": $("#" + sinGuardar[i]).attr("id"),
				"a": $("#" + sinGuardar[i]).data("a"),
				"t": $("#" + sinGuardar[i]).data("t")
			});			
		}	
		console.log(t);		
		jmy_web_guardar(t);
		sinGuardar = [];
	});
}
function mensajeGuardado(){
	jQuery(function ($) { 
		$("#jmy_web").html("");
		$("#jmy_web").html("<p>"+leng.dato_guardado+"</p>").delay(2000).hide(500);
	});
}
function agregarSinGuardar(d){ /* ({id:785}) */
	if(jQuery.inArray(d.id,sinGuardar)== -1) 
		sinGuardar.push(d.id);		
}
function jmy_web_div_click(){
	
	jQuery(function ($) {
		let vr=[],lid=[];
		$.when($(".jmy_web").each(function() {
			let f={
				idd:$(this).attr('id') || null,
				t:$(this).data('t') || null,
				a:$(this).data('a') || null,
				id:$(this).data('id') || null,
				idf:$(this).data('idf') || null,
				idl:$(this).data('lista-id') || null,
				idlt:$(this).data('lista-t') || null,
				p:$(this).html()
			},t=$(this).attr('type');
			if($(this).data('editor')!='no') $(this).attr("contenteditable", "true");
			switch (t) {
				case'select':
					if(f.idd!=undefined){
						f.idd=f.id+"_"+Date.now();
						$(this).attr('id',f.idd);
					}
					lid.push({t:f.t,a:f.a,c:f.idl,txt:'se:'+f.idd});
				break;
				default:
					if($(this).data('ver')!=undefined) if(f.t!=undefined&&f.a!=undefined&&f.id!=undefined&&f.idf!=undefined) vr.push(f);
				break;
			}
		})).then(function () {
			//console.log("lid",lid,"VR",vr);
			let g={};
			vr.forEach(d => {
				if(g[d.a]==undefined)
					g[d.a]={};
				if(g[d.a][d.t]==undefined)
					g[d.a][d.t]={};		
				if(g[d.a][d.t][d.idf]==undefined)
					g[d.a][d.t][d.idf]=[];
				let s=d.id.split("-");
					d.id=s[0];
				g[d.a][d.t][d.idf].push(d.id);				
			});		
			let m={tx:g,se:lid};
			//console.log(m);			
			if(Object.keys(m.tx).length>0 || m.se.length>0)
				$.ajax({
					url: url_base+ 'administrador/jmyWebAjG/v',
					type: 'post',	
					contentType:false,
					dataType: 'json',
					cache: false,
					processData: false,
					data: JSON.stringify(m),
					success: function(res) {
						//console.log(res);
						if(typeof res === 'object' && res !== 'Internal Server Error'){
							let t = [];
							let g={},
									s={};
							res.forEach(d => {
								d=d.jmy_ver;
								if(d.error!=undefined){
									console.warn('d',d.error);
								}else{
									//console.log('d',d);
									t=d.txt.split(':');
									switch (t[0]) {
										case "se":
											if(typeof s[t[1]]!=='object')s[t[1]]=[];
											s[t[1]].push(d);
										break;
										default:
											if(d.a !== undefined && d.t !== undefined){
												if(g[d.a]==undefined)
													g[d.a]={};
												if(g[d.a][d.t]==undefined)
													g[d.a][d.t]={};		
												
												if(g[d.a][d.t][d.id_f]==undefined)
													g[d.a][d.t][d.id_f]=[];
												
												g[d.a][d.t][d.id_f]=d.ot;
											}
										break;
									}
								}
							});
							//console.log('g',g,'s',s);
							$(".jmy_web").each(function() {
								const dv = {
										i: $(this).attr('id'),				
										c: $(this).data("id"),
										f: $(this).data("idf"),
										t: $(this).data("t"),
										a: $(this).data("a"),
										v: $(this).data("ver"),
										y: $(this).attr("type"),
										p: $(this).attr("placeholder"),
								};
								let o='';
								if(dv.a !== undefined && dv.t !== undefined && ['on'].includes(dv.v)){
									if(typeof g[dv.a] !== undefined && typeof g[dv.a] !== "undefined")
										if(typeof g[dv.a][dv.t] !== undefined && typeof g[dv.a][dv.t] !== "undefined")
											if(typeof g[dv.a][dv.t][dv.f] !== undefined && typeof g[dv.a][dv.t][dv.f] !== "undefined")
												if(typeof g[dv.a][dv.t][dv.f][dv.c] !== undefined && typeof g[dv.a][dv.t][dv.f][dv.c] !== "undefined")
													o=g[dv.a][dv.t][dv.f][dv.c];  }
								switch (dv.y) {
									case 'select':
										let t=[{id:"",text:dv.p}];
										if(typeof s[dv.i] == "object")
											s[dv.i].forEach(e =>{t.push({id: e.ot.value,text: e.ot.nombre})});
										t.push({id:"JMYAGREGAR",text:'[+] Agregar '});
											$("#"+dv.i).removeClass('jmy_web');
										if(typeof window['v'+dv.i]=="undefined"){
											window['v'+dv.i]=$("#"+dv.i).select2({data:t});
										$("#"+dv.i).change(function(){
											let v=$("option:selected",this).val(), 
													f=$(this).data('fn') || null;
												if(f!=undefined) eval(f+'("'+v+'")');
												if(v=="JMYAGREGAR"){
													jmy_web_select_editar(dv);
												}
											});
										}
									break;
									default:
										if(o!=undefined){
											$(this).html('');
											$(this).html(o);
										}
									break;
								}										
							});
						}
					},
					error: function(res) {
						let r = (typeof res == "string" && res instanceof String) ? res : "";
						switch (r) {
								case "Unauthorized":
										r={t:"Sin permisos",m:"Este usuario no tiene acceso",t:"error"};    
								break;
								default:
										r={t:"UPS!",m:"Ocurrió un error al solicitar datos, intente de nuevo.",t:"warning"};    
								break;
						}
						swal(r.t,r.m,r.t, {
							buttons: false,
							timer: 3000,
						});
						console.error(res);
					}
				});
			});
		$(".jmy_web").click(function(e) {
			let d={d:$(this).data('id'),a:$(this).attr('id'),f:"",g:"",ve:$(this).data('ver'),h:$(this).data('auto-guardar')||''};
			if(d.h==""){
				if(d.a==undefined){
					$(this).attr('id',d.d+'_'+Date.now())
					d.a=d.d+'_'+Date.now();
				}
				d={
					id:d.a,
					idg:d.a,				
					type:$(this).attr('type'),
					placeholder:$(this).data("placeholder"),
					t:$(this).data("t"),
					a:$(this).data("a"),
				};
				agregarSinGuardar(d);
				herramientas();
				if ($(this).data('editor') != 'no') { /*CKEDITOR.remove(data.id); CKEDITOR.replace(this);*/ } else {
					$(this).attr("contenteditable", "true");
					CKEDITOR.remove(d.id);
					botones({
						pageX: e.pageX,
						pageY: e.pageY,
						data: d
					});
				}
			}
		}); 
	});
}

function jmy_web_msk_add_blog() {
	let html = '<button class="jmy_blog_guardar" >'+leng.agregar_post+'</button>';
	html = html + '<input type="text" id="nombre_nuevo_post" placeholder="'+leng.nombre_nuevo_post+'"> ';
	jQuery(function ($) { 
	$("#jmy_web_agregar_blog").html("");
	$("#jmy_web_agregar_blog").html(html);
	$(".jmy_blog_guardar").click(function() {
		let str = $("#nombre_nuevo_post").val();
		if (str != '') {
			let t = btoa(str);
			let r = str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
			t = $('#jmy_web_agregar_blog').data('url') || null;
			r = (t!=undefined&&t!='')?t+r:location.origin + "/blog/" + r + "/guardar/";
			window.location.href = r;
		} else {
			alert(leng.sin_titulo_post);
		}
	});
	});
}

function jmy_web_html_categorias(d=[]){
	let h='';
	let b='';
	jQuery(function ($) { 
	$(".jmy_web_categorias").each(function() {
		h='';			
		b=$(this).data('titulo');
		console.log(b);
		b=(b!=undefined)?b:"Cambiar titulos de pestañas";
		h = '<div style="background-color:rgba(30,170,30,0.7);padding:4px;font-size:16px;color:fcfcfc;border-radius:5px; withd:100%;">'+b+'</div>';
		$(this).html('');	
		$(this).show(250);	
		$(this).html(h);				
	});
	});
}

function jmy_web_categorias_click(){
	jQuery(function ($) { 
		$(".jmy_web_categorias").click(function(e) {
			let d = { 	"t":$(this).data('titulo'),
						"v":$(this).data('value'),
						"p":$(this).data('page'),
						"id":$(this).attr('id'),
					};
			console.log(d);
			let t=(d.t!='')?d.t:leng.seccion_comas;
			let v = prompt(t,d.v);		
			if (v != null) {
				jmy_web_guardar({data:{
						"valor": v,
						"page": d.p,
						"id": d.id,	
					}});
				location.reload();			
			}	    
		}); 
	}); 
}

function jmy_web_contador_click(){
	jQuery(function ($) { 
		$(".jmy_web_contador").click(function(e) {
			let d = { 	"t":$(this).data('titulo'),
						"v":$(this).data('value'),
						"p":$(this).data('page'),
						"id":$(this).attr('id'),
						"tabla":$(this).data('tabla'),
						"re":$(this).data('redi'),
					};
			console.log('jmy_web_contador',d);
			let t = (d.t!='') ? d.t : leng.cont_cant;
			let v = prompt(t,d.v);		
			if (v != null) {
				v = parseInt(v);
				if (v != null ) {
					jmy_web_guardar({data:{
							"valor": v,
							"page": d.p,
							"id": d.id,	
							"tabla": (d.tabla!=undefined)?d.tabla:'vistaweb',	
							"fn": "jmy_web_html_contador_respuesta",	
						}});
					}else{
						alert('valor incorrecto');
					}
				}	    
			}); 
		}); 
	}
function jmy_web_html_contador_respuesta(d=[]){
	let res = d.r;
	let error = res.error;
	if(error==undefined)
		location.reload();
	else
		alert('Faltan datos');
}

function jmy_web_html_contador(d=[]){
	let c='';
	let h='';
	let b='';
	jQuery(function ($) { 
		$(".jmy_web_contador").each(function() {
			h='';
			c=$(this).data('value');
			b=$(this).data('button');
			console.log(b);
			
			b=(b!=undefined)?b:'Carrucel de '+c+' páginas';
			h = '<div style="background-color:rgba(30,170,30,0.7);padding:4px;font-size:16px;color:fcfcfc;border-radius:5px">'+b+'</div>';
			$(this).html('');	
			$(this).show(250);	
			$(this).html(h);				
		});
	});
}


function jmy_web_web_slider(d=[]){	  	
	let va=JSON.stringify(d.var);
	let pos = (d.button=='down') ? 'bottom:5px;left:5px;':'top:5px;left:5px;';
	let style = (d.style==undefined) ?  "z-index:10000;position:absolute;"+pos : d.style;
	jQuery(function ($) { 
		let h = "<div style='"+style+"' id='"+d.id+"_DI'><img style='width: 66px;height: auto;' id='"+d.id+"_OP' src='http://social.comsis.mx/templet/images/logo.png' data-var='"+va+"' data-page='"+d.page+"' data-tabla='"+d.tabla+"' heigth='60'></div>";
		if(d.herramientasPadre)
			$("#"+d.id).parent().append(h);    
		else
	  		$("#"+d.id).append(h);    
	  
	  $("#"+d.id+"_OP").click(function(){
		  $(".webSliderOP").remove();
		jmy_web_web_slider_OP({
			  id:d.id,
			  var:$(this).data('var'),
			  tabla:$(this).data('tabla'),
			  page:$(this).data('page')
		  });
	  });
	  });
	  
};

function guardarSliderProceso(d=[]){
	
}
function guardarSlider(d=[]){
	jQuery(function ($) { 
		let t = [];
		for (let i = 0; i < wSSaveTextArr.length; i++) {
			t = wSSaveTextArrDa[wSSaveTextArr[i]];
			t = {
				"id": wSSaveTextArr[i],
				"valor": t.val,
				"page": t.page,
				"tabla": t.tabla,
			};
			console.log('jmy_slider_guardar',t);
		if(t.type=="text"){
			$("#"+wSSaveTextArr[i]).html("");
			$("#"+wSSaveTextArr[i]).html(t.val);
		}
		jmy_web_guardar({data: t});
		  $(".webSliderOP").remove();
	}
	});
}
let ultimo_guardar_slider = 0;
function addGuardarSlider(d){ /*({id:785})*/
	if(jQuery.inArray(d.id,wSSaveTextArr)== -1 && d.id!=undefined) {
		wSSaveTextArr.push(d.id);		
		wSSaveTextArrDa[d.id]=[];
		wSSaveTextArrDa[d.id]=d;
	}
	
    //if(d.btn_guardar!=undefined)
    jQuery(function ($) { 
		$(".jmy_slider_guardar").prop('disabled', false);
		$(".jmy_slider_guardar").html('[+ Guardar ]');
        $(".jmy_slider_guardar").css(style.b_guardar);
    });
	if(d.id!=undefined){
		let t =wSSaveTextArrDa[d.id];
		console.log(t);
		t.val=d.val;
		wSSaveTextArrDa[d.id]=t;
	}
}
function jmy_web_web_slider_OP(d=[]){
	console.log(d);
	
	  let h="",t=[],t2="", dA = 0, gb = [];
	  for(let i=0;i<d.var.length;i++){
		  t=d.var[i];
		  t2="";
		  switch (t.type) {
			case 'imagen':
				if(t.width!=undefined) 
					t2 = t2+"<br> w: "+t.width;

				if(t.width!=undefined) 
					t2 = t2+" h: "+t.height;

				h=h+'<div class="drop-area" data-id_target="'+t.id+'" data-class="'+t.class+'" data-page="'+d.page+'" data-idadd="'+t.idadd+'" data-tabla="'+d.tabla+'" data-width="'+t.width+'" data-height="'+t.height+'"  data-cop=\''+ ((t.cop!=undefined)?JSON.stringify(t.cop):'') +'\' style="'+style.wS_ima+'" ><h3 class="drop-text" style="'+style.wS_ima_h3+'">'+leng.drop_image+' '+t2+'</h3></div>';
				dA++;
			break;
			case 'text':
				h=h+'<div style="'+style.wS_tx+'"><input data-page="'+d.page+'" data-tabla="'+d.tabla+'" type="text" placeholder="'+t.placeholder+'" value="'+t.value+'"  id="'+t.id+'" data-id_target="'+t.id+'" class="wSSaveText" style="'+style.wS_tx_in+'"></div>';
			break;
			case 'hidden':
				h=h+'<input data-page="'+d.page+'" data-tabla="'+d.tabla+'" type="hidden"  value="'+t.value+'"  id="'+t.id+'" data-id_target="'+t.id+'" >';
				
					gb.push({	id:t.id,
					page:d.page,
					tabla:d.tabla,
					val:t.value,
					type:"hidden"	}); 

			break;
		}
	  }
	  if(h=="")
		  h=leng.no_data_editable;
	  else
		  h=h+'<div style="'+style.wS_he+'"><button class="jmy_slider_guardar" style="'+style.wS_gu+'">[+]</button><button class="jmy_web_slider_cancelar" style="'+style.wS_ca+'"> [x] </button></div>';
		  jQuery(function ($) { 
	  $("#"+d.id+"_DI").append('<div class="webSliderOP" style="'+style.wS_OP+'">'+h+'</div>');

		if(gb.length>0)
			gb.forEach(e => {
				console.log('gb',e);
				
				addGuardarSlider(e); 			
			});
	  


	  $(".webSliderOP").draggable({
		cursor: "move",
		/*cursorAt: {
			top: 20,
			left: 20
		}*/
	});
	  $(".wSSaveText").on('input',function(){
		  let t={	id:$(this).data('id_target'),
				page:$(this).data('page'),
				tabla:$(this).data('tabla'),
				val:$(this).val(),
				type:"text"	};			
		  addGuardarSlider(t); 
	  });
	  $(".jmy_slider_guardar").click(function(){
		  guardarSlider();
	  });

	  $(".jmy_web_slider_cancelar").click(function(){
		  let wSSaveTextArr=[];
		  $(".webSliderOP").remove();
	  });

	  $(".drop-area").on('dragenter', function (e){
		e.preventDefault();
		$(this).css('background', '#BBD5B8');
	});

	$(".drop-area").on('dragover', function (e){
		e.preventDefault();
	});

	$(".drop-area").on('drop', function (e){
		$(this).css('background', '#D8F9D3');
		e.preventDefault();
		let im = e.originalEvent.dataTransfer.files;
		console.log(im);
		
		uImage(im,{	id:$(this).data('id_target'),
					page:$(this).data('page'),
					tabla:$(this).data('tabla'),
					idadd:$(this).data('idadd'),
					height:$(this).data('height'),
					width:$(this).data('width')	,
					class:$(this).data('class')	,
					cop:$(this).data('cop')	,
					porcional:$(this).data('porcional')	});
		});
	});
	

 }
 function uImage(im,d=[]){
	var fI = new FormData();
	fI.append('userImage', im[0]);
	d['btn_guardar']=true;
	uForm(fI,d);
}


function uImage(im,d=[]){
	
	
	var fI = new FormData();
	fI.append('userImage', im[0]);

        console.log(fI,d);		

	if(d.cop!=undefined){
		let st;
		//$.when(
		d.cop.forEach(e => {
			
			$(".jmy_slider_guardar").html('[Cargando..]');
			$(".jmy_slider_guardar").prop('disabled', true);
			$(".jmy_slider_guardar").css(style.b_cargando);
			st = setTimeout(uForm(fI,{
				id:e.id,
				page:d.page,
				tabla:d.tabla,
				height:e.height,
				width:e.width,
				porcional:e.porcional
			}), 2000);
		});
		//)).done(function(){
			clearTimeout(st);
		//});
		
		d.btn_guardar=true;
		uForm(fI,d);
	}else{
		d.btn_guardar=true;
		uForm(fI,d);
	}
	
}

function uForm(formData,d=[]){
	d.tabla=(d.tabla=="undefined")?"":d.tabla;
	console.log(d);
	jQuery(function ($) { 
	$(".jmy_slider_guardar").prop('disabled', true);
	$(".jmy_slider_guardar").css(style.b_cargando);

	$(".jmy_slider_guardar").html('Cargando imagen...');
	$.ajax({
		url: location.origin+"/jmyWebUpLoIm/width-"+d.width+"/height-"+d.height+"/",
		type: "POST",
		data: formData,
		contentType:false,
		dataType: 'json',
		cache: false,
		processData: false,
		success: function(r){
			console.log(r,formData);			
			r.url =(r.url!=undefined)?r.url:r.val;

			let h = '<img width="45%" src="'+r.url+'">';
			$('#drop-area').html(h);
			console.log(d);
			$("#"+d.id).attr("src",r.url);
			if(d.idadd!=undefined)
				$("#"+d.idadd).attr("src",r.url);
			if(d.class!=undefined)
				$("."+d.class).attr("src",r.url);
			addGuardarSlider({	id:d.id, 
								id_target:d.id,
								  tabla:d.tabla,
								  page:d.page,
								  val:r.url,
								  btn_guardar:d.btn_guardar
							  });
	},error: function(result) {
		console.log(result);

		$(".jmy_slider_guardar").html('[-Error, Volver intentar]');
			}
		});
		});
}

function jmy_web_cargaSlider(d = []) {


	jQuery(function ($) { 
		$(".jmy_web_slider").each(function(e) {
			jmy_web_web_slider({
				id: $(this).attr('id'),
				placeholder: $(this).data("placeholder"),
				page: $(this).data("page"),
				tabla: $(this).data("tabla"),
				var: $(this).data("var"),
				marco: $(this).data("marco"),
				style: $(this).data("style"),
				button: $(this).data("button")
			});
		});
	});
}

function img_op(){
	let h='';
	let t='';
	let b=[];
	$(".jmy_web_img").each(function() {
		 d = {
					"tabla":$(this).data("tabla"),
					"page":$(this).data("page"),
					"var":$(this).data("var"),
		};
		h='';
		h = '<div style="background-color:rgba(30,170,30,0.7);padding:4px;font-size:16px;color:fcfcfc;border-radius:5px">';
			for (let i = 0; i < d.var.length; i++) {
				t = d.var[i];
				h = h+t.id;
			}
		h = h+'</div>';
		$(this).html('');	
		$(this).show(250);	
		console.log(h);
		//$(this).html(h);				
	});
}
let sinGuardar = [];
let config = [];
let WSlider=[];
let lng=[];	
let wSSaveTextArr=[];
let wSSaveTextArrDa=[];
//$.getScript("app/js/jmy/MX-es.js",function(){});
let leng = {
	guardar:"Guardar",
	guardar_cambios:"Guardar todos los cambios",
	hola:"hola",
	hola:"hola",
	imgLogo:"http://social.comsis.mx/templet/images/logo.png",
	no_data_save:"Falta datos para poder guardar",
	drop_image:"Arrastra aqui las imagen",
	no_data_editable:"No hay datos editables en esta sección",
	dato_guardado:"Dato guardado :)",
	sin_titulo_post:"Primero ingrese el titulo del post",
	nombre_nuevo_post:"Nombre del nuevo post",
	seccion_comas:"Indica el nombre de cada sección separado por comas",
	cont_cant:"Indica en número la cantidad de paginas de este elemento a mostrar",
	agregar_post:"Agregar nota en el blog",
	}
let style = {
	h_guardar:"background-color:rgba(30,140,30,0.8);padding:8px;color:#fff;font-size:16px;border:0;border-radius:5px;",
	h_cancelar:"background-color:rgba(140,30,30,0.8);padding:8px;color:#fff;font-size:16px;border:0;border-radius:5px;",
	b_guardar:"background-color:rgba(30,140,30,0.8);padding:8px;color:#fff;font-size:16px;border:0;border-radius:5px;",
	b_azul:"background-color:rgba(30,30,140,0.8);padding:8px;color:#fff;font-size:16px;border:0;border-radius:5px;",
	b_cargando:"background-color:rgba(30,30,30,0.8);padding:8px;color:#fff;font-size:16px;border:0;border-radius:5px;",
	b_cancelar:"background-color:rgba(140,30,30,0.8);padding:8px;color:#fff;font-size:16px;border:0;border-radius:5px;",
	wS_ima:"margin:5px; width:220px; height:60px; background-color:white; border:3px dashed grey;",
	wS_ima_h3:"margin:5px 5px; color:grey; font-size:12px; font-weight:bold; text-align: center;",
	wS_tx:"margin:5px; width:220px; height:30px; background-color:white; font-size:12px;",
	wS_tx_in:"color:#333 !important",
	wS_gu:"background-color:rgba(30,140,30,0.8);padding:4px;color:#fff;font-size:14px;border:0;border-radius:4px;",
	wS_in:"background-color:rgba(30,30,140,0.8);padding:4px;color:#fff;font-size:14px;border:0;border-radius:4px;",
	wS_ca:"background-color:rgba(140,30,30,0.8);padding:4px;color:#fff;font-size:14px;border:0;border-radius:4px;",
	wS_he:"margin:5px; width:220px; height:40px; background-color:white;",
	wS_OP:"position:absolute;top:5px;left:70px;padding:5px;border-radius:5px;background-color:rgba(200,200,200,0.7);color:#333;font-size:12px;z-index:9999;",
}
function jmy_web_select_recargar(d=[]){
	jQuery(function ($) { 
		$(".jmy_web_recargar_select").on("click",function(){
			jmy_web_select(d);
		});
	});
}
function jmy_web_select_editar(d=[]){
	let h ='';
	console.log('jmy_web_select_editar',d);
	[
		{
			"id":"nombre_nuevo_catalogo",
			"value":"",
			"type":"text",
			"placeholder":"Nombre",
			"label":"Nombre"
		},{
			"id":"value_nuevo_catalogo",
			"value":"",
			"type":"text",
			"placeholder":"Valor",
			"label":"Valor",
			"class":"select_editar_oculto"
		},{
			"id":"descripcion_nuevo_catalogo",
			"value":"",
			"type":"text",
			"placeholder":"Descripción",
			"label":"Descripción",
			"class":"select_editar_oculto"
		}
	].forEach(e => {
		let id=(e.id!=''&&e.id!=undefined)?e.id:'jmy_web_select_editar'+Math.floor((Math.random() * 1000) + 1);
		h=h+'<div class="form-group '+e.class+'"><label for="'+e.id+'">'+e.label+'</label><input type="'+e.type+'" class="form-control input-sm" id="'+e.id+'" placeholder="'+e.placeholder+'"></div>';
	});
	if(h=="")
	  h=leng.no_data_editable;
	else
	  h=h+'<div style="'+style.wS_he+'"><button class="jmy_select_opciones" style="'+style.wS_in+'">[*]</button><button class="jmy_select_guardar" style="'+style.wS_gu+'">[+]</button><button class="jmy_web_select_cancelar" style="'+style.wS_ca+'"> [x] </button></div>';
	jQuery(function ($) { 
		$(".webSliderOPSelect").remove();
		$("#"+d.i).parent().append('<div class="webSliderOPSelect" style="'+style.wS_OP+'">'+h+'</div>');
		$(".select_editar_oculto").hide();
		$(".jmy_select_opciones").on('click',function (e){
  		e.preventDefault();
			$(".select_editar_oculto").toggle();
		});

		$(".webSliderOPSelect").draggable({
			cursor: "move",
		});
	
		$(".jmy_select_guardar").on('click',function(e){
  		e.preventDefault();
			let g = {
				id:d.l,
				i:d.i,
				v:d.v,
				h:d.h,
				t:d.t,
				a:d.a,
				l:$("#"+d.i).data("lista-id"),
				nombre:$("#nombre_nuevo_catalogo").val(),
				value:$("#value_nuevo_catalogo").val(),
				descripcion:$("#descripcion_nuevo_catalogo").val()
			};
			if(g.nombre!=''&&g.nombre!=undefined){
				g.value = (g.value!=''&&g.value!=undefined)?jmy_web_url_friendly(jmy_web_caracteres_especiales(g.value),'_'):jmy_web_url_friendly(jmy_web_caracteres_especiales(g.nombre),'_');
				console.log(g);				
				jmy_web_select_guardar(g);	
			}
		});

		$(".jmy_web_select_cancelar").click(function(){
			let wSSaveTextArr=[];
			$(".webSliderOPSelect").remove();
		});

		
	});
	
}
function jmy_web_select_guardar(d=[]){
	$('.jmy_select_guardar').attr('disabled','disabled');
	jQuery(function ($) { 
		$.ajax({
			url: url_base+ 'administrador/jmyWebAjG/l',
			type: 'post',	
			contentType:false,
			dataType: 'json',
			cache: false,
			processData: false,
			success: function(res) {
				console.log(d,res);
				if(typeof res.error =="undefined"){
					let e = res[0][0].jmy_guardar.error || null;
					console.log(e);				
					if(e==undefined){
						if ($('#'+d.i).find("option[value='" + d.value + "']").length) {
							$('#'+d.i).val(d.value).trigger('change');
						}else{ 
							const newOption = new Option(d.nombre, d.value, true, true);
							$('#'+d.i).append(newOption).trigger('change');
						} 
						$(".webSliderOPSelect ").remove();
					}else{
						console.error(e);					
						$('.jmy_select_guardar').removeAttr('disabled');
						swal("UPS!","Ocurrió un error al guardar. Intenta de nuevo.","warning", );
					}
				}else{
					console.error(res);		
					$(".webSliderOPSelect ").remove();
					$('.jmy_select_guardar').removeAttr('disabled');
					swal("Acceso restringido",res.error,"error" );
				}
			},
			error: function(res) {
				$('.jmy_select_guardar').removeAttr('disabled');
				swal("UPS!","Ocurrió un error al guardar. Intenta de nuevo.","warning", {
					buttons: false,
					timer: 3000,
				});
				console.error(res);
			},
			data: JSON.stringify(d)
		});
	});	
}
let count = 0;
function jmy_web_select(d=[]){
	console.log('jmy_web_select',d);
	
	jQuery(function ($) { 
		$.ajax({
			url: url_base + 'administrador/jmyWebAjG/v',
			type: 'post',	
			contentType:false,
			dataType: 'json',
			cache: false,
			processData: false,
			success: function(res) {
				console.log(res);				
				const l=res.lista.otFm;
		
				
				/*let h='';
				if(d.h!='')h=h+'<option>'+d.h+'</option>';
				if(l!=undefined){
					//console.log(l);					
					l.forEach(e => {
						const s = (e.value===d.v) ? 'selected':'';
						h= h+'<option value="'+e.value+'" '+s+'>'+e.nombre+'</option>';
					});
				}
				if(res.ps) h= h+'<option value="JMYAGREGAR"> [+] Agregar </option>';
				$("#"+d.i).html(h);
				*/
				$("#"+d.i).change(function(){
					let v = $("option:selected",this).val();
					console.log(v);
					if(v=="JMYAGREGAR"){
						jmy_web_select_editar(d);
					}
				});
			},
			error: function(res) {
				console.error(res);
			},
			data: d
		});
	});	
}
function jmy_hace_tiempo(primeraFecha='',segundaFecha='',leng={y:'Años',m:'Meses',d:'Días',h:'Horas',i:"Minuto(s)",s:'un momento',p:'Hace'}){
	primeraFecha = new Date(Number(primeraFecha));
	segundaFecha = (segundaFecha!='')? new Date(Number(segundaFecha)): new Date(Date.now());
	let o=24*60*60*1000,t='d',d=Math.abs((primeraFecha.getTime()-segundaFecha.getTime())/(o));
	if(d>728){d= ((d / 30) / 365);t='y'}else{
		if(d>30){d= d / 30;t='m'}else{
			if(d>=1){d=d;t='d'}else{
				if(d<1){d=d*1000;t='h'}
				if(d<1){d=d*60;t='i'}
				if(d<0.05){d='';t='s'}
			}
		}
	}
	return leng.p+' '+((d!='')?Math.round(d):'')+' '+leng[t];
}
function carga(d=[]){
	jQuery(function ($) { 
		$("#jmy_web").hide(250);
		$(".jmy_web_contador").hide(250);
			console.log('init jmy');
				$('body').prepend('<div id="jmy_web"></div><div id="jmy_web_tools"></div>');
			//img_op();
			jmy_web_div_click();
			favoritos_pop();
			/*
			jmy_web_categorias_click();
			jmy_web_contador_click();
			jmy_web_cargaSlider();
			jmy_web_html_contador();
			jmy_web_html_categorias();
			jmy_web_msk_add_blog();*/

		if($("#jmy_web").length){
			console.log('existe');
		}else{
		//	$("body").prepend('<div id="jmy_web"></div><div id="jmy_web_tools"></div>');
		}
		$("#jmy_web").draggable({
			cursor: "move",
			cursorAt: {
				top: 20,
				left: 20
			}
		});
	});
}
jQuery(function ($) { 
	$(document).ready(function () {
		carga();	
	});
});