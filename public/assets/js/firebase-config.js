
console.log('Iniciando configuração do Firebase');

const firebaseConfig = {
  apiKey: "AIzaSyCNYOse4N1MCRkqEz7koSadpu8s5D6jNYg",
  authDomain: "voleidquinta.firebaseapp.com",
  projectId: "voleidquinta",
  storageBucket: "voleidquinta.appspot.com",
  messagingSenderId: "71470670144",
  appId: "1:71470670144:web:f2b30de5f44f332ba4daa5",
  measurementId: "G-KN36WXTJJN"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase inicializado com sucesso');

// Inicializar o Firestore e atribuir à variável `db`
const db = firebase.firestore();
console.log('Firestore inicializado: ', db);

// Exportar a variável `db` para ser usada em outros arquivos
export { db };