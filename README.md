# Iniciar Proyecto

Este proyecto es una aplicación Node.js que utiliza Sequelize como ORM para interactuar con una base de datos. Además, utiliza JWT (jsonwebtoken), Express, bcryptjs, dotenv, express-validator, Moment, Morgan, Multer y PostgreSQL. Para poner en marcha el proyecto, sigue estos pasos:

## Requisitos Previos

Asegúrate de tener Node.js y npm (o yarn) instalados en tu sistema. También necesitarás una base de datos configurada y accesible. Este proyecto utiliza Sequelize con PostgreSQL como ejemplo, pero puedes ajustar la configuración para utilizar otro motor de base de datos si lo deseas.

## Configuración

1. **Clonar el Repositorio**: Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/David-Rosas/IONIXTest.git
    cd IONIXTest
    ```

2. **Instalar Dependencias**: Instala las dependencias del proyecto:

    ```bash
    npm install o npm i
    # o
    yarn install
    ```

3. **Configurar Variables de Entorno**: Modifica el archivo `.env` basado en el archivo de ejemplo `example.env`. Define las variables de entorno necesarias para la conexión a la base de datos y la configuración del servidor:

    ```plaintext
    DATABASE_NAME="IONIXTest"
    DATABASE_USER="root"
    DATABASE_PASSWORD="tuContraseña"
    DATABASE_HOST="localhost"
    DATABASE_PORT="3306"
    DATABASE_DIALECT="postgres"

    JWT_SECRET="rkAVi3w12fK8KLikANQIF0nZmGKdVBFAQJKYnfGV8dWAfhOWtXB4bR1SNn5mu90y6MM38N"

    PORT=4001
    SERVER_ROOT_URI="http://localhost:{PORT}"
    UI_ROOT_URI="http://localhost:3000"
    URL_FRONTEND="*"
    ```

    Asegúrate de configurar las variables de entorno según tu configuración específica.

4. **Ejecutar las Migraciones**: Las migraciones son scripts que definen la estructura de la base de datos. Ejecuta el siguiente comando para aplicar las migraciones y crear las tablas en la base de datos:

    ```bash
    npx sequelize-cli db:migrate
    # o
    yarn sequelize db:migrate
    ```

5. **Ejecutar los Seeders**: Los seeders son scripts que agregan datos iniciales a la base de datos, como roles, usuarios de prueba, etc. Ejecuta el siguiente comando para ejecutar los seeders y agregar datos iniciales:

    ```bash
    npx sequelize-cli db:seed:all
    # o
    yarn sequelize db:seed:all
    ```

6. **Iniciar la Aplicación**: Una vez configurada la base de datos y aplicadas las migraciones y los seeders, puedes iniciar la aplicación con:

    ```bash
    npm start
    # o
    yarn start
    ```

    ¡La aplicación ahora está en funcionamiento y lista para ser utilizada!

## Uso

Hay un archivo JSON que puedes importar a Postman para realizar pruebas con todas las solicitudes necesarias.

## Nota

La validación de usuarios se realiza a través de un middleware llamado `isAuth.js`, y hay rutas protegidas para las cuales debes enviar el token a través del encabezado como `Authorization: Bearer [token]`.
