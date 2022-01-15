window.addEventListener("load",function(){
    document.getElementById("form_inreg").onsubmit=function(){
    
        if (document.getElementById("parl").value!=document.getElementById("rparl").value){
            alert("Nu ai reintrodus bine parola!");
            return false;
        }
        return true;
    }
});