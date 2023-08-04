# NodeJs Microservices
Author: Moshe Binieli<br>
Email: mmoshikoo@gmail.com

## Background
This project serves as a template for a Node.js Express monorepo microservices architecture. It consists of four microservices:
1. Shop Service
2. User Service
3. Products Service
4. Payment Service

Each service represents an isolated entity with its own routes, services, and data access layer. As this project is intended for microservice purposes, there is no specific database implementation.

## API Gateway
Each service operates on its own port, and there is an API Gateway in front of all of them that directs requests to the appropriate service.

## Services Communication (Swagger)
Services communicate with each other using the HTTP protocol, with each service exposing its own Swagger. This allows other services to utilize the exposed Swagger.

## Services Communication (Message Queue)
Services also communicate with each other by exchanging messages through a queue (Mesaage Queue).<br>
For this project, I opted to utilize [cloudAMQP](https://www.cloudamqp.com/). After creating an account, I obtained the connection string and placed it in the .env file at the project's root directory, under the key `MESSAGE_QUEUE_URL`.<br><br>
The current implementation is as follows: The Shop Service receives an HTTP request to delete user data from all services. It then sends a message via a Queue Message to both the Product Service and Payment Service. These two services listen to their own queues and receive the message from the Shop Service. Each service then deletes the necessary data from their respective databases.

## Project Structure (Libs)
There are shared libraries located at "libs".
1. Swagger
2. Utils

The Swagger library contains instances of all the services that are ready for HTTP communication. Add new Swaggers to this library.

## Project Structure (Applications)
As mentioned earlier, there are five applications: gateway, shop, users, products, and payments.

Each application is structured as follows:
- **Src**
  - Main file
  - Types file
  - **Factory**
    - Factory file
  - **Routes**
    - Route class
    - Route express file
  - **Service**
    - Service file
  - **Dal**
    - Dal file
  - **Queue Message**
    - Register Message Queues file
    - **Handler** (Only for Product & Payment)
      - Handler file
- **Swagger**
  - Swagger file

## Generate New Swagger
### Added New Swagger
If you have added a new application with a swagger file, navigate to the `package.json` file at the root level of the application. In the `scripts` section, you will find a script for each swagger file on how it should be generated. Add your new swagger script to this section and then modify the "swagger" script by including your new script. Finally, run the command `npm run swagger`.

### Modified Existing Swagger File
To regenerate the swagger files with the modified content, simply execute the command `npm run swagger`. This will delete the current swagger generated files and generate them again.

## Run The Project
To set up the Nx workspace globally, begin by installing the Nx extension on VSCode. Afterward, execute the command `npm install` to install all the required dependencies. Then, navigate to the project's root directory in the command prompt and run `npm run swagger`. Next, access the Nx terminal and choose the option `Generate & Run Target`. Finally, initiate the Payment Service, Product Service, User Service, Shop Service, and Gateway Service in development mode.

1. Install the Nx extension on VSCode.
2. Execute the command `npm install` to install all the required dependencies.
3. Navigate to the project's root directory in the command prompt.
3. Run `npm run swagger` to generate the necessary artifacts.
4. Navigate to the User application and open the .env file, generate a random `APP_SECRET` value.
5. Make sure you setup Queue Message server. (Follow the steps at: Services Communication (Message Queue))
6. Access the Nx terminal and choose the option `Generate & Run Target`.
7. Initiate the following services in development mode:
  * Gateway Service
  * Shop Service
  * User Service
  * Product Service
  * Payment Service
Following these steps will set up your Nx workspace and allow you to work on your project efficiently.

The gateway initiates on port 3000, while the shop, user, product, and payment modules are initiated on ports 3001, 3002, 3003 and 3004, respectively.

Open postman and navigate to:
* Shop service: http://localhost:3000/shop
* User service: http://localhost:3000/user
* Product service: http://localhost:3000/product
* Payment service: http://localhost:3000/payment

## Playground
Once you have completed the previous step "Run The Project", go to the root of the project and execute `start_servers.cmd`. This will initiate the bootstrapping process for all the microservices (Gateway, Shop, User, Product, and Payment).

Send an HTTP POST request to `http://localhost:3000/user/signup` using Postman application. Include email and password in the request, and the route will respond with a JWT token.<br>

Obtain the generated token and insert it into the Bearer Authorization field in Postman. Then, send a request to [Post Method]`localhost:3000/shop/`. This will add sample data to your account.

Send a request to [Get Method]`localhost:3000/shop/` and this endpoint will retrieve all the sample data that was created in the previous step.

Send a request to [Post Method]`localhost:3000/shop/`. This route will activate the message queue for the Product QueueMessage and Payment QueueMessage services. Each service will then proceed to delete your data. After that, run [Get Method]`localhost:3000/shop/` again and verify that all the data has been deleted.

### Keep in mind that all the requests are being sent to `localhost:3000` as it is the designated route for the Gateway. The Gateway then forwards these requests to the appropriate service.
