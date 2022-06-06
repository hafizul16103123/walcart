
# Walcart Category CRUD

Simple CRUD opeartion of Category tree with active and deactive functionality.
I also used redis for caching frequently called APIs.


## Tech Stack

**Server:** Node, Express

**Others:** Typescript,redis

**DB:** Mongoose 


## Documentation

[Swagger API Documentation](http://localhost:3000/api/)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` 
`DB_HOST` 
`DB_PORT` 
`DB_USER` 
`DB_PASSWORD` 
`DB_NAME` 
`DEFAULT_CACHE__EXPIRATION`


## Dependencies

Typescript, nodejs, npm, Mongoose and redis

## Redis 

Need to install Redis with default port 6379


## Deployment

To deploy this project run

```bash
  npm run build
```
```bash
  npm run start
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/hafizul16103123/walcart.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```
Run redis with default port
Need to mongodb install on your pc with auth

Start the server

```bash
  npm run build
```
```bash
  npm run dev
```

Project will run  http://localhost:3000/


