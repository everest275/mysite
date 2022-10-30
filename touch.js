

(function(){
    
   
const $= selector => document.querySelector(selector)


const ticket = $('.ticket')

const{width,height}=document.body.getBoundingClientRect()
const halfWidth=width/6
const halfHeight=height/6

window.addEventListener('mousemove', event =>{
    ticket.style.transition='none'
    const {pageX,pageY}= event

    const rotationx = ((pageX-halfWidth)/halfWidth)*8
    const rotationy= ((pageY-halfHeight)/halfHeight)*8
       
    ticket.style.transform=`rotateX(${rotationx}deg) rotateY(${rotationy}deg)`

})




})();
