
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEzSsgZ4yuuHM7iq2TP4N-4oE-3sS8cxY",
    authDomain: "financeapp2024-214da.firebaseapp.com",
    projectId: "financeapp2024-214da",
    storageBucket: "financeapp2024-214da.appspot.com",
    messagingSenderId: "747204166180",
    appId: "1:747204166180:web:cfa4bb03a6a125725f4eb1",
    measurementId: "G-WNKXEXT8XY"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById('GoogleInicioSesion');

const userSignIn = async() => {
  signInWithPopup(auth, provider)
  .then((result)=>{
    const user =result.user
    console.log(user);
  }).catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message
  })
}

onAuthStateChanged(auth, (user) =>{
  if(user) {

    window.location.href='main.html'
  } else{
  }
})

signInButton.addEventListener('click',userSignIn)



