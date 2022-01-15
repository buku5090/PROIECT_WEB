window.addEventListener("load",function(){
// 	var myHeaders = new Headers();
// myHeaders.append();
	var vect_ids=localStorage.getItem("produse_selectate").split(",");
	fetch("/produse_cos", {		

		method: "POST",
		headers:{'Content-Type': 'application/json'},
		
		mode: 'cors',		
		cache: 'default',
		body: JSON.stringify({
			ids_prod: vect_ids,
			a:10
		})
    })
	.then(function(rasp){ console.log(rasp); return rasp.json()})
    .then(function(objson) {
   
        console.log(objson);
		for (let prod of objson){
			let divCos=document.createElement("div");
			divCos.classList.add("cos-virtual")
			let divImagine=document.createElement("div");
			let imag=document.createElement("img");
			imag.src="/resurse/imagini/produse/"+prod.imagine;
			divImagine.appendChild(imag);
			divCos.appendChild(divImagine);
			let divInfo=document.createElement("div");
			divInfo.innerHTML=`<p><b>${prod.nume}</b></p><p>Pret: ${prod.pret}</p><p>Gramaj: ${prod.gramaj}</p>`;
			divCos.appendChild(divInfo);
			document.getElementsByTagName("main")[0].insertBefore(divCos, document.getElementById("cumpara"));
		}
   
    }
	).catch(function(err){console.log(err)});
	
	
	document.getElementById("cumpara").onclick=function(){
		var vect_ids=localStorage.getItem("produse_selectate").split(",");
		fetch("/cumpara", {		

			method: "POST",
			headers:{'Content-Type': 'application/json'},
			
			mode: 'cors',		
			cache: 'default',
			body: JSON.stringify({
				ids_prod: vect_ids,
				a:10
			})
		})
		.then(function(rasp){ console.log(rasp); return rasp.text()})
		.then(function(raspunsText) {
	   
			console.log(raspunsText);

			let p=document.createElement("p");
			p.innerHTML=raspunsText;
			document.getElementsByTagName("main")[0].innerHTML="";
			document.getElementsByTagName("main")[0].appendChild(p)
			localStorage.removeItem("produse_selectate");
	   
		}
		).catch(function(err){console.log(err)});
	}
	
});