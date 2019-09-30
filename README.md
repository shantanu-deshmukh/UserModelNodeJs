# UserModel NodejS

A simple NodeJS application with User Registration, Login & Profile. [See Demo](https://user-model.herokuapp.com/)


Getting Started
=================
- Clone this repo
- Install dependencies
    ```bash
    npm install
    ```
- Set Environment variables: the project uses `process.env.VARIABLE_NAME` to access credentials
    - For development:
        - rename the `nodemon-example.json` file to `nodemon.json`
        - add mongodb connection string & SMTP credentials to `nodemon.json`
    - For Production:
        - Depending on the server configuration, you need to set environment variables

|  Env/ Variable       |  Description          |
| ------------- |:-------------:|
| `PORT`    |  Port which the app should use|
| `MONGO_URI`    | MongoDB connection string |
| `EMAIL_DOMAIN`    | Domain from which the email will be sent |
| `EMAIL_API_KEY`    | Mailgun api key, this project uses [mailgun](https://www.mailgun.com/) to send email. |
| `SMTP_FROM`    | Email address from which the mail is sent. |

- Run the Application
    - Development
        ```bash
        npm run dev
        ```
    - Production
        ```bash
        npm run start
        ```


See my other work at [shantanudeshmukh.com](https://shantanudeshmukh.com)