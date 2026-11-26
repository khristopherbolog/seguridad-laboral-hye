# Reglas de Seguridad de Firestore — MiMenú

Copia estas reglas exactamente en:
Firebase Console → Firestore → Reglas

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Helpers ─────────────────────────────────────────────────
    function isAuth() {
      return request.auth != null;
    }
    function isOwner(uid) {
      return isAuth() && request.auth.uid == uid;
    }
    function isAdmin() {
      return isAuth() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // ── Restaurantes ─────────────────────────────────────────────
    // Lectura pública (cualquier visitante puede ver el menú)
    // Escritura solo por el dueño (uid == doc id) o admin
    match /restaurantes/{uid} {
      allow read: if true;
      allow write: if isOwner(uid) || isAdmin();
    }

    // ── Usuarios ─────────────────────────────────────────────────
    // El usuario solo puede leer/escribir su propio documento
    // Admin puede leer todos; no puede escribir directamente (usa panel)
    match /users/{uid} {
      allow read:  if isOwner(uid) || isAdmin();
      allow write: if isOwner(uid) || isAdmin();
    }

    // ── Admins ───────────────────────────────────────────────────
    // Solo lectura por admins (para verificar si un UID es admin)
    // NUNCA escribible desde el cliente; solo desde Firebase Console
    match /admins/{uid} {
      allow read:  if isAdmin();
      allow write: if false;
    }
  }
}
```

## Cómo convertirte en Admin Maestro

1. Entra a tu aplicación con tu correo y contraseña
2. Ve a Firebase Console → Authentication → Users
3. Copia tu UID (columna "User UID")
4. Ve a Firestore → Colecciones → (si no existe "admins", créala)
5. Crea un documento con:
   - **ID del documento:** tu UID copiado
   - **Campo:** `email` → tu correo electrónico
6. Cierra sesión y vuelve a entrar → serás redirigido a `/admin/`

## Índices necesarios en Firestore

Crea estos índices en Firebase Console → Firestore → Índices:

| Colección      | Campo 1    | Orden | Campo 2     | Orden |
|----------------|------------|-------|-------------|-------|
| `restaurantes` | `slug`     | ASC   | —           | —     |
| `users`        | `createdAt`| DESC  | —           | —     |
