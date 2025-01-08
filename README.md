# Asian Canadian Association uOttawa Web Application
Wiki Page: https://acao-website.atlassian.net/l/cp/sTAms0w1

## Run Dev Environment
To run the Dev environment first clone the repository into a folder of your liking:

`git clone https://github.com/ZeyuShao-uOttawa/ACAO-Website`

Then cd into both the client and server folders install all the node modules by running:

`npm install`

After installing all the node modules, create a .env file in the server directory with the following information:

`MONGODB_URI=<mongodb_url>` <br>
`JWT_SECRET=<JWT_token>` <br>
`PORT=3000` <br>

Then create a .env file in the client directory with the following information:

`VITE_API_BASE_URL=http://localhost:3000`<br>

After cd into the server folder and run either:

`npm run start:server` to start the server only<br>
`npm run start:client` to start the client only<br>
`npm run dev` to run both the server and client concurrently<br>
