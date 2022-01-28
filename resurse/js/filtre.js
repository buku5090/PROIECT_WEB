window.onload= function(){
    var range=document.getElementById("input_diagonala_id");
    range.onchange=function()
    {
        var infoRange=document.getElementById("info-range");
        if(!infoRange){
            infoRange=document.createElement("span");
        
            infoRange.id="info-range";
            this.parentNode.appendChild(infoRange);
        }
        

        infoRange.innerHTML="("+this.value+")";
    }

    var btn=document.getElementById("buton_filtrare");
    btn.onclick=function(){
    var articole=document.getElementsByClassName("produs");
    var input_model=document.getElementById("input_model_id").value;
    

    for(let art of articole){
        var model_prod=art.getElementsByClassName("val-model")[0];
        var diag_produs=art.getElementsByClassName("val-diagonala")[0];
        art.style.display="none";
        var conditie_model=model_prod.innerHTML.includes(input_model);
        var conditie_diagonala=parseFloat(diag_produs.innerHTML)>=
            parseFloat(document.getElementById("input_diagonala_id").value);
        var radbtns = document.getElementsByName("alegere");
        for(let rad of radbtns){
            if(rad.checked){
                var valRad = rad.value;//poate fi 1, 2 sau 3
                break;
            }
        }
        var rezistentaSoc = art.getElementsByClassName("rez_soc")[0].innerHTML;
        var conditie_radio_btn;
        switch(valRad){
            case "1":{
                conditie_radio_btn = (rezistentaSoc == 'Da');
                break;
            }
            case "2":{
                conditie_radio_btn = (rezistentaSoc == 'Nu');
                break;
            } 
            case "3":{
                conditie_radio_btn = true;
                break;
            }              
        }
        
        var conditie_checkbox_marca;
        var checkboxes = document.getElementsByName("marca_ckb");
        var marca = art.getElementsByClassName("val-marca")[0].innerHTML;
        var sir_marci = "";
        
        for(let ch of checkboxes)
        {
            if(ch.checked)
            {
                sir_marci+=ch.value;
            }
        }
        conditie_checkbox_marca = sir_marci.includes(marca);

        var conditie_data_an;
        var simple_selects = document.getElementById("select-an");
        var data_an_ap = art.getElementsByClassName("data")[0].innerHTML;
        conditie_data_an = data_an_ap.includes(simple_selects.value);
      
        var culori_disponibile = art.getElementsByClassName("val-culori-disponibile")[0].innerHTML;
        var conditie_culoare = false;

        var opMultiple = Array.prototype.slice.call(document.querySelectorAll('#select-multiplu-culoare-husa option:checked'),0).map(function(v,i,a) { 
            return v.value;
        });

        

        var l_culori=culori_disponibile.split(",");

        console.log(l_culori, l_culori[0]);
        for(let i of l_culori) {
            if(opMultiple.includes(i) || opMultiple.includes("toate"))
                conditie_culoare = true;
        }

        var txt_area_element = document.getElementById("textarea-d");
        var txt_area_val = document.getElementById("textarea-d").value;
        var descriere_art = art.getElementsByClassName("val-descriere")[0].innerHTML;
        var conditie_descriere;
        if(txt_area_val.includes("1") || txt_area_val.includes("2") || 
                            txt_area_val.includes("3") || txt_area_val.includes("4") 
                            || txt_area_val.includes("5") || txt_area_val.includes("6") 
                            || txt_area_val.includes("7") || txt_area_val.includes("8") || txt_area_val.includes("9")){
            
            txt_area_element.value = "";
            alert("Nu introduceti cifre in textarea!");
        }
        else{
            conditie_descriere = descriere_art.includes(txt_area_val);

            if(conditie_diagonala && conditie_model && conditie_radio_btn && conditie_checkbox_marca 
                    && conditie_data_an && conditie_culoare && conditie_descriere)
            art.style.display="grid";
        }        

    }
    }
    var btn_order_asc=document.getElementById("buton_asc");
    btn_order_asc.onclick=function()
    {
        var articole_sort=document.getElementsByClassName("produs");
        var v_articole=Array.from(articole_sort);
        var val_sortare=document.getElementsByClassName("val-sortat")[0];
        var ok=0;
        console.log(val_sortare);
        v_articole.sort(function(a,b){
        let val_a;
        let val_b;
        val_a=a.getElementsByClassName("val-nume")[0].innerHTML;
        val_b=b.getElementsByClassName("val-nume")[0].innerHTML;
        if(val_a.localeCompare(val_b) == 0) {
            val_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            val_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);

            return val_a-val_b;
        }
        return val_a.localeCompare(val_b);
            
        });
        for(let art of v_articole)
        {
            art.parentNode.appendChild(art);
        }
    }
    var btn_order_desc=document.getElementById("buton_desc");
    btn_order_desc.onclick=function()
    {
        var articole_sort=document.getElementsByClassName("produs");
        var v_articole=Array.from(articole_sort);
        var val_sortare=document.getElementsByClassName("val-sortat")[0];
        var ok=0;
        console.log(val_sortare);
        v_articole.sort(function(a,b){
            let val_a;
            let val_b;
            val_a=a.getElementsByClassName("val-nume")[0].innerHTML;
            val_b=b.getElementsByClassName("val-nume")[0].innerHTML;
            if(val_a.localeCompare(val_b) == 0) {
                val_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
                val_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
    
                return val_b-val_a;
            }
            return val_b.localeCompare(val_a);
            
        });
        for(let art of v_articole)
        {
            art.parentNode.appendChild(art);
        }
    }
}
window.onkeydown=function(e){
    //console.log(e);
    if(e.key=="c" && e.altKey==true){
        var suma=0;
        var articole=document.getElementsByClassName("produs");
        for(let art of articole){
            if(art.style.display!="none")
                suma+=parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
        }

        var spanSuma;
        spanSuma=document.getElementById("numar-suma");
        if(!spanSuma){
            spanSuma=document.createElement("span");
            spanSuma.innerHTML=" Suma:"+suma;//<span> Suma:...
            spanSuma.id="numar-suma";//<span id="..."
            document.getElementById("p-suma").appendChild(spanSuma);
            setTimeout(function(){document.getElementById("numar-suma").remove()}, 1500);
        }
    }
 }