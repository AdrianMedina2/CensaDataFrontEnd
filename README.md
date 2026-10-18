# CensaData

Aplicación web desarrollada destinada al análisis y gestión de información censal histórica del INIDE.

## Tecnologías usadas
- React (Frontend)
- Vite (bundler y servidor de desarrollo)
- Bootstrap (UI y estilos)
- Axios (consumo de APIs)
- Visual Studio Code
- GitHub

---

## Instalación

### Requerimientos
- Node.js 18+
- npm o yarn

### Setup Frontend
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AdrianMedina2/CensaDataFrontEnd.git
   cd CensaDataFrontEnd
2. Configurar el archivo `.env`:

Copiar el archivo `.env.example` y renombrarlo a `.env`.  
Luego ajustar las variables según el entorno:

    ```env
    VITE_API_BASE=URL_DEL_BACKEND
    VITE_APP_VERSION=1.0.0
4. Instalar dependencias:
   ```bash
   npm install
5. Ejecutar servidor de desarrollo (local):
   ```bash
   npm start

## Estructura del proyecto.
```plaintext
CensaData
|   .gitignore
|   eslint.config.js
|   estructura.txt
|   index.html
|   package-lock.json
|   package.json
|   README.md
|   vercel.json
|   vite.config.js
|          
+---public
|       Censadata.ico
|       CensaData.png
|       CensaDataCD.png
|       CensaDataCDWhite.png
|       CensaDataWhite.png
|       
\---src
    |   App.jsx
    |   main.jsx
    |   
    +---assets
    +---components
    |   +---Auth
    |   |       AuthRole.jsx
    |   |       RequireAuth.jsx
    |   |       
    |   +---ConfirmModal.jsx
    |   |       ConfirmModal.jsx
    |   |       
    |   +---EditableTable
    |   |       EditableTable.jsx
    |   |       
    |   +---Encuestas
    |   |       CasaForm.jsx
    |   |       PersonaEmpadronadoForm.jsx
    |   |       
    |   +---Footer
    |   |       Footer.css
    |   |       Footer.jsx
    |   |       
    |   +---Navbar
    |   |       Navbar.css
    |   |       Navbar.jsx
    |   |       
    |   +---Sidebar
    |   |       Sidebar.css
    |   |       Sidebar.jsx
    |   |       
    |   +---TiltCard
    |   |       TiltCard.css
    |   |       TiltCard.jsx
    |   |       
    |   +---ToastMessage
    |   |       ToastMessage.jsx
    |   |       
    |   \---ValidatedInput
    |           ValidatedInput.jsx
    |           
    +---context
    |       AuthContext.jsx
    |       
    +---layouts
    |   +---AuthLayout
    |   |       AuthLayout.css
    |   |       AuthLayout.jsx
    |   |       
    |   +---MainLayout
    |   |       MainLayout.jsx
    |   |       
    |   \---SectionsLayout
    |           SectionsLayout.jsx
    |           
    +---pages
    |   +---Censos
    |   |       Censos.jsx
    |   |       
    |   +---Dashboard
    |   |       dashboard.css
    |   |       Dashboard.jsx
    |   |       
    |   +---Encuestas
    |   |       Encuestas.css
    |   |       Encuestas.jsx
    |   |       
    |   +---Home
    |   |       Home.jsx
    |   |       
    |   +---Infraestructura
    |   |       Infraestructura.jsx
    |   |       MaterialesConstruccionSection.jsx
    |   |       TiposPisosSection.jsx
    |   |       TiposTechosSection.jsx
    |   |       
    |   +---Investigadores
    |   |       Investigadores.jsx
    |   |       
    |   +---Login
    |   |       Login.css
    |   |       Login.jsx
    |   |       
    |   +---Personal
    |   |       Discapacidades.jsx
    |   |       EmpleoSection.jsx
    |   |       EstadosCivilesSection.jsx
    |   |       NivelesEducativosSection.jsx
    |   |       ParentescoSection.jsx
    |   |       Personal.jsx
    |   |       
    |   +---RecuperarContrase±a
    |   |       RecuperarContrase±a.css
    |   |       RecuperarContrase±a.jsx
    |   |       
    |   \---Ubicaciones
    |           BarriosSection.jsx
    |           DepartamentosSection.jsx
    |           MunicipiosSection.jsx
    |           Ubicaciones.jsx
    |           
    +---services
    |       administradoresApi.js
    |       authApi.js
    |       censosApi.js
    |       encuestasApi.js
    |       estadisticasApi.js
    |       index.js
    |       InfraestructuraApi.js
    |       investigadoresApi.js
    |       personalApi.js
    |       recuperacionApi.js
    |       reportesApi.js
    |       ubicacionesApi.js
    |       
    +---styles
    |       animations.css
    |       globals.css
    |       variables.css
    |       
    \---utils
            axiosInstance.js
```

## Despliegue
El proyecto se encuentra desplegado en Vercel:  
[https://censadata.vercel.app](https://censadata.vercel.app)

## Autores.
- Adrian Antonio Medina Cubillo.
- Francisco Jose Moncada Mejia.
- Josiel Benavidez Morales.

