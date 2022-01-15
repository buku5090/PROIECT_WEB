const express = require('express');
const fs=require('fs');
const sharp=require('sharp');
const ejs=require('ejs');
const sass=require('sass');
const path = require('path');
const {Client}=require('pg');
const request=require('request');

var client = new Client({user:'buki',password:'buki', database:'postgres', host: 'localhost', port:5432});
client.connect();

app=express();



app.get("/produsele_noastre", function(req, res){
    console.log(req.query.tip);
    var conditie="where 1=1 ";
    if(req.query.tip)
    {
        conditie+=`and material='${req.query.tip}'`;
    }
    client.query(`SELECT * FROM produse ${conditie}`, function(err,rez){
        if(!err){
            console.log("test ",rez.rows);
            res.render("pagini/produsele_noastre",{produse:rez.rows})
        }
        else
            console.log(err);
    })
});

app.get("/produs/:id", function(req, res){
    client.query(`SELECT * FROM produse where id=${req.params.id}`, function(err,rez){
        if(!err){
            res.render("pagini/produs",{prod:rez.rows[0]})
        }
    })
});


app.get("*/galerie-animata.css", function(req,res){
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata.scss").toString("utf-8");
    nr_img=[9,12,15];
    let nr_aleator = nr_img[Math.floor(Math.random()*nr_img.length)];
    let rezScss=ejs.render(sirScss,{nr_imagini:nr_aleator});
    fs.writeFileSync("./resurse/temp/galerie-animata.scss",rezScss);

    let cale_css=path.join(__dirname,"resurse/temp","galerie-animata.css");//__dirname+"/temp/galerie-animata.css"
	let cale_scss=path.join(__dirname,"resurse/temp","galerie-animata.scss");

    sass.render({file: cale_scss, sourceMap:true}, function(err, rezCompilare) {
		if (err) {
            console.log(`eroare: ${err.message}`);
            //to do: css default
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
		fs.writeFileSync(cale_css, rezCompilare.css, function(err){
			if(err){console.log(err);}
		});
		res.sendFile(cale_css);
	});
})
app.get("*/galerie-animata.css.map",function(req, res){
    res.sendFile(path.join(__dirname,"resurse/temp/galerie-animata.css.map"));
});


app.get("*/ex.css",function(req, res){
    let cale_css=path.join(__dirname,"resurse/temp","ex.css");
    res.sendFile(cale_css);
});

app.set("view engine","ejs");
app.use("/resurse",express.static(__dirname+"/resurse"));

function creeaza_imagini()
{
    var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
    obImagini=JSON.parse(buf);
    var vector_imagini=[];
    for(let imag of obImagini.imagini)
    {
        let nume_imag, extensie;
        [nume_imag,extensie]=imag.fisier.split(".");
        console.log(nume_imag, extensie);

        let dim_mic=150;
        //imag.mic=nume_imag+"-"+dim_mic+".jpg";
        imag.mic=`${obImagini.cale_galerie}/${nume_imag}-${dim_mic}.jpg`;
        imag.mare=`${obImagini.cale_galerie}/${nume_imag}.jpg`;

        if (!fs.existsSync(imag.mic)){
            ;//sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);
        }
        

    }
}

creeaza_imagini();

app.get(["/","/home","/index"], function(req, res){
    var buf_an=fs.readFileSync(__dirname+"/resurse/json/galerie-animata.json").toString("utf-8");
    obImagini_an=JSON.parse(buf_an);
    var locatie="";
    request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', //se inlocuieste cu req.ip; se testeaza doar pe Heroku
            function (error, response, body) {
            if(error) {console.error('error:', error)}
            else{
                var obiectLocatie=JSON.parse(body);
                console.log(obiectLocatie);
                locatie=obiectLocatie.geobytescountry+" "+obiectLocatie.geobytesregion
            }

    res.render("pagini/index",{ip:req.ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie, 
        imagini_an:obImagini_an.imagini, cale_an:obImagini_an.cale_galerie, locatie:locatie})
    })
});

app.get("/ceva", function(req, res){
    console.log(req.url);
    
    res.end();
});

app.get("/*", function(req,res){
    
    res.render("pagini"+req.url, function(err, rezultatRender){
    

        if(err){
            res.render("pagini/404");
        }
        else
        {
            if(req.url.toString().includes(".ejs")){
                res.render("pagini/403");
            }
            else{
                res.send(rezultatRender);
            }
        }
    })
    
})

var s_port = process.env.PORT || 8080;
//app.listen(8080);
app.listen(s_port);

console.log("Serverul a pornit");
