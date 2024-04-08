# TODO App Backend

This project is a simple TODO app built with the AWS Serverless framework.

The application is built by using the following technologies:

- **AWS Lambda**: The serverless computing service. In this application, the AWS Lambda service hosts the API endpoints, which are called by the client applications for their needs.

- **DynamoDB**: The NoSQL database offered by AWS for maintaining the data of the application. In our application, we use DynamoDB to store our TODO items.

- **API Gateway**: Works as an "entry point" for the client applications to the Lambda functions. In our application, we use it to route requests from clients to appropriate Lambda functions.

- **Cognito**: AWS service for adding authentication and user management into applications. In this application, we use Cognito to authenticate and authorize the users before providing access to the application resources.

## Project Setup

Before deploying your serverless application, you must follow the below steps:

1. Install the Serverless Framework globally by running `npm install -g serverless`

2. Install Node.js modules by running `npm install` in the project root

3. Deploy your application by running `serverless deploy`

4. The outputs should include your API gateway endpoints.

## Development Flow

### Local Development
To start locally have DynamoDB running locally, you could do that by running `docker-compose up` 

and then starting service locally by running `npm run dev` 

## API Reference
The app provides the following endpoints:

POST /todos: Create a new Todo item

GET /todos: Fetch all Todo items for a user

GET /todos/{id}: Fetch specific Todo item

PUT /todos/{id}: Update a specific Todo item

DELETE /todos/{id}: Delete a specific Todo item