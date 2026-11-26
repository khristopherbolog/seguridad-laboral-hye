/* ================================================================
   CONFIGURACIÓN DE FIREBASE — MiMenú
   ================================================================
   INSTRUCCIONES:
   1. Ve a https://console.firebase.google.com
   2. Crea un proyecto nuevo (ej: "mimenupanama")
   3. Ve a Configuración del proyecto → Tus apps → Web (</>)
   4. Registra la app y copia los valores aquí abajo
   5. En Firebase: activa Authentication (Email/Password)
   6. En Firebase: crea una base de datos Firestore
   7. En Firestore: copia las reglas de seguridad de REGLAS.md

   PARA HACERTE ADMIN MAESTRO:
   Después de tu primer login, crea manualmente en Firestore
   la colección "admins" con un documento cuyo ID sea tu UID.
   El UID lo ves en Authentication → Users de Firebase Console.
   ================================================================ */

const FIREBASE_CONFIG = {
  apiKey:            "REEMPLAZA_CON_TU_API_KEY",
  authDomain:        "REEMPLAZA.firebaseapp.com",
  projectId:         "REEMPLAZA_CON_TU_PROJECT_ID",
  storageBucket:     "REEMPLAZA.appspot.com",
  messagingSenderId: "REEMPLAZA_CON_TU_SENDER_ID",
  appId:             "REEMPLAZA_CON_TU_APP_ID"
};

/* NO MODIFIQUES DEBAJO DE ESTA LÍNEA */
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
