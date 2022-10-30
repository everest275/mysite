import { saveComent, getComents, getProyects, deleteComent,app } 
from './firebase.js'
import { getAuth,createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, GoogleAuthProvider,
   signInWithPopup, FacebookAuthProvider,
   GithubAuthProvider} 
   from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js"
import { showMessage } from './showMessage.js'
const proyectsList = document.getElementById('proyects-list')
const comentsList = document.getElementById('coments-list')
const openLogin = document.querySelector('.open-login')
const loginVentana = document.querySelector('.modal-login')
const closeLogin = document.querySelector('.modalLogin-close')
const formCreate = document.querySelector('.form-create')
const formLogin = document.querySelector('.form-login')
const botonGoogle = document.querySelector('.boton-login-google')
const botonFacebook = document.querySelector('.boton-login-facebook')
const botonGitHub = document.querySelector('.boton-login-github')
const comentForm = document.getElementById('comentarios-form')
const indiceBotonLogin=document.querySelector('.btn-login-direction')

var btnString=''
var indiceCreate=false
var user=localStorage.getItem('name')
window.addEventListener('DOMContentLoaded', async () => {


//Catching and Settnig All
  const cargarDatos = async () => {
    document.querySelector('.form-create-container').style.visibility='hidden'
    if(user!==null){
      document.querySelector('.open-login').style.background='red'
      document.querySelector('.open-login').innerHTML='Log Out'

    }
    let querySanpshotComents = await getComents()
    let querySnapshotProyects = await getProyects()
    let proyects=[]
let comentarios=[]

    querySanpshotComents.forEach(doc=>{
      let dato=doc.data()
      let idDato=doc.id
      comentarios.push({
        id:idDato,
        user:dato.user,
        date:dato.date,
        coment:dato.coment
      })
    })

    querySnapshotProyects.forEach(doc=>{
      let dato=doc.data()
      proyects.push({
        name:dato.name,
        url:dato.url,
        startDate:dato.startDate,
        back:dato.back,
        front:dato.front,
        state:dato.state
      })

    })
    
    comentarios.sort(function(a, b) {
      let date1= new Date(a.date)
      let date2=new Date(b.date)

      if (date2 > date1) {
    return 1;
  }
  if (date2 < date1) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
console.log(comentarios)
      cargarComentsTabla(comentarios)
      cargarProyectsTabla(proyects)
}

//Setting Proyects
const cargarProyectsTabla=(lista)=>{

  let htmlProyects = ''

  lista.forEach(dato => {
    htmlProyects += `
  <div class="card">
  <div class="content">
      <h3 class="proyect-title">${dato.name}</h3>
      <picture class="proyect-ImageCont">
          <img class="proyect-image"src=${dato.url} alt="Portafolio-Portada">
      </picture>
      <h5 class="proyect-description">${dato.back}</h5>
      <h5 class="proyect-description">${dato.front}</h5>
      <div class="links-proyects">
      <div class="link-page">
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
      <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
    </svg>
      </div>
      <div class="link-git">
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
      </div>
      </div>
  </div>
</div>
  `
  })
  proyectsList.innerHTML = htmlProyects
}

//Setting Coments
  const cargarComentsTabla=(lista)=>{
  let htmlComents = ''
  lista.forEach(dato => {
    let date =new Date(dato.date)
    let eliminar=` <li><button class="dropdown-item eliminar" data-id="${dato.id}">Eliminar</button></li>`
    let reportar=`<li><button class="dropdown-item reportar" data-id="${dato.id}">Reportar</button></li>`
    
    
    htmlComents += `
        <tr class="tabla-row">
            <td class="tabla-campo">

            <div class="card-coment">
            <div class="user-section-coment">
            <h3 class="userChatDesign">${dato.user}</h3>
            <div class="conectedVisible">
             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="green" class="bi bi-circle-fill" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8"/>
          </svg></div>
          <div class="editComent">
          
          <div class="dropdown">
          <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <div class="contenedor">
          </button>
          <ul class="dropdown-menu">
          ${user==dato.user?(eliminar):(reportar)}
                
          </ul>
        </div>
        </div>
          </div>
          <div class="coment-section-coment">
          <h7 class="dateDesign">${date.toDateString()}</h7>
            <h5 class="comDesi">${dato.coment}</h5>
          </div>
            </td>
        </tr>
 `
  })
  
  comentsList.innerHTML = htmlComents
  assignDeleteButton()
  assignReportButton()
}

const assignDeleteButton=()=>{
  let botones =document.querySelectorAll('.eliminar')
  botones.forEach(boton=>{
    boton.onclick=eliminarComent
  })
}
const assignReportButton=()=>{
  let botones =document.querySelectorAll('.reportar')
  botones.forEach(boton=>{
    boton.onclick=reportarComent
  })
}
const eliminarComent=(e)=>{
  let control=e.target
  console.log(control.dataset.id)
  deleteComent(control.dataset.id)
  showMessage('coment deleted','success')



}
const reportarComent=(e)=>{
  let control=e.target
  console.log(control.dataset.id)
 
}

  //All Buttons
 
  indiceBotonLogin.addEventListener('click',(e)=>{
    e.preventDefault()
    var btnCrLog=document.querySelector('.btn-login-direction')

    if(btnCrLog.innerHTML=='Create New Account'){
      document.querySelector('.form-login-container').style.visibility='hidden'
      document.querySelector('.form-create-container').style.visibility='visible'
      
      btnCrLog.innerHTML="Go Back to Login"
    }
    else if(btnCrLog.innerHTML=='Go Back to Login'){
      document.querySelector('.form-create-container').style.visibility='hidden'
      document.querySelector('.form-login-container').style.visibility='visible'
      btnCrLog.innerHTML='Create New Account'
    }
      
    

   

  })
  botonFacebook.addEventListener('click', async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const provider = new FacebookAuthProvider()
    try {
      const credentials = await signInWithPopup(auth, provider)
      console.log(credentials)
    } catch (error) {
      console.log(error)
    }
  })
  botonGoogle.addEventListener('click', async (e) => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider()
    try {
      const credentials = await signInWithPopup(auth, provider)
      console.log(credentials)
      console.log(credentials.user.accessToken,
        credentials.user.email,credentials.user.displayName)
        localStorage.setItem('token',credentials.user.accessToken)
        localStorage.setItem('name',credentials.user.displayName)


        user=credentials.user.displayName
    } catch (error) {
      console.log(error)
    }

  })
  botonGitHub.addEventListener('click',async (e) => {
    e.preventDefault();
    console.log('Vamos a iniciar sesion con github')
    const auth = getAuth(app);
    const provider = new GithubAuthProvider()
    try {
      const credentials = await signInWithPopup(auth, provider)
      console.log(credentials)
    } catch (error) {
      console.log(error)
    }
    
  })
  openLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginVentana.classList.add('modalLogin--show')
    console.log('hola')
    console.log(loginVentana)
  })
  closeLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginVentana.classList.remove('modalLogin--show')
  })

  comentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(user===null){
      showMessage('Please Login firstly!', 'error')
    }else{
      let time=Date.now();
   let date=new Date(time)
console.log(date.toISOString())

    let coment = comentForm['comentario']
    saveComent(user,date.toISOString(),coment.value)
    showMessage('Message sent correctly!', 'success')
    comentForm.reset()
    cargarDatos()

    }

  })
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('logeando')
    let email = formLogin['user'].value
    let password = formLogin['password'].value

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password)
      console.log(credentials)
      showMessage('Welcome ' + credentials.user.email, 'success')
      loginVentana.classList.remove('modalLogin--show')
      localStorage.setItem('token',credentials.user.accessToken)
     
      localStorage.setItem('image','default')

    } catch (error) {
      console.log(error.code)
      if (error.code === 'auth/network-request-failed') {
        showMessage('Email or Password No Exist ', 'error')
      }
    }

  })
  formCreate.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = formCreate['user'].value
    let password = formCreate['password'].value
    let confirm = formCreate['confirm'].value

    if(confirm === password){
      try {
      
        const auth = getAuth(app);
        const userCredentials = await
          createUserWithEmailAndPassword(auth, email, password)
        console.log(userCredentials)
        showMessage('Welcome ' + userCredentials.user.email, 'success')
        loginVentana.classList.remove('modalLogin--show')
  
      } catch (error) {
        console.log(error)
        console.log(error.code)
        if (error.code === 'auth/email-already-in-use') {
          showMessage('Address exists', 'error')
        } else if (error.code === 'ath/invalid-email') {
          showMessage('Invalid address', 'error')
        } else if (error.code === 'auth/weak-password') {
          showMessage('Weak password', 'error')
        }
        else if (error.code === 'auth/network-request-failed') {
          showMessage('Error email & password', 'error')
        }
      }
    }else{
      showMessage('Error confirm password', 'error')
    }

  })
//Finish All buttons

cargarDatos()
 
})
// setInterval(async()=>Data(),3000)

