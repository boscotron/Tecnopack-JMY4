function filtro(t="",d={type:""}) {
    switch (d.type) {
        case 'imagen_perfil':
            t='<img style="width: 40px;height: 40px;border-radius: 100%;" src="'+t+'" >';
        break;        
        default:
            if (typeof t == 'string') {
                t=t.replace(/_/g, " ");
                t=t.replace(/\,/g, ", ");
                t=t.charAt(0).toUpperCase() + t.slice(1);
            }
            break;
    }
    return t;
}