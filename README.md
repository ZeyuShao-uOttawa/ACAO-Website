# Asian Canadian Association uOttawa Web Application
Wiki Page: https://acao-website.atlassian.net/l/cp/sTAms0w1<br>
Jira: https://acao-website.atlassian.net/jira/software/projects/KAN/boards/1

## Running the Dev Environment
To run the Dev environment first clone the repository into a folder of your liking:

`git clone https://github.com/ZeyuShao-uOttawa/ACAO-Website`

Then cd into both the client and server folders install all the node modules by running:

`npm install`

In both folders. After installing all the node modules, create a .env file in the server directory with the following information:

`MONGODB_URI=<mongodb_url>` <br>
`JWT_SECRET=<JWT_token>` <br>
`PORT=3000` <br>
`AWS_ACCESS_KEY_ID=<aws_access_key>` <br>
`AWS_SECRET_ACCESS_KEY=<aws_secret_key>` <br> 
`AWS_REGION=us-east-1` <br>
`AWS_S3_BUCKET=<aws_bucket>` <br>

Then create a .env file in the client directory with the following information:

`VITE_API_BASE_URL=http://localhost:3000`<br>

After cd into the server folder and run either:

`npm run start:server` to start the server only<br>
`npm run start:client` to start the client only<br>
`npm run dev` to run both the server and client concurrently

### Creating Dev Admin Account
After you have set up the dev environment, to create a admin account for the website, you must cd into the server directory and run:

`node createAdmin.js`

Which will create a admin account in your test db with the following credentials:

`email: admin@admin.com`<br>
`password: admin`

## Running Tests

### Back-end Tests
To run back-end unit/endpoint tests, cd into the `server` directory and create a .env.test with the following information:

`JWT_SECRET=test-secret` <br>
`PORT=3000` <br>
`AWS_REGION=us-east-1` <br>
`AWS_S3_BUCKET=test-bucket` <br>

After creating the .env.test, run:

`npm run test` or<br>
`npm run test-coverage` for a test coverage report

### Front-end Tests
To run front-end unit tests, cd into the `client` directory and run:

`npm run test` or<br>
`npm run test:coverage` for a test coverage report

To run front-end end to end tests first go into the root directory and run:

`npm run dev`

Next open another cmd and go into the `client` directory and run:

`npm run cy:open`

And follow the instructions in the GUI to run the tests