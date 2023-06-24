#  Loan Enquiry Nest.js Services
This repository hosts the Loan Enquiry Nest.js Services, which encompass a suite of RESTful APIs specifically designed for managing loan inquiries. These services are meticulously crafted using the Nest.js framework and are seamlessly integrated with MySQL, serving as the underlying database. Notably, an API Gateway service is implemented to handle incoming HTTP requests and efficiently facilitate the retrieval of data from the loan service.

##  Quick Start
To quickly get started with the Loan Enquiry Nest.js Services, you can follow these steps:

1. Ensure you have Docker installed on your machine.
2. Open a terminal or command prompt.
3. Run the following command to start the services in Docker:
    ```bash
    docker-compose up
    ```
  Use the -d flag if you want to run the services in the background.
  This command will create a MySQL database, migrate the loan table, and seed CSV data into the table.
  
4. To stop the services and tear down the Docker containers, you can use the following command:
     ```bash
      docker-compose down
      ```
If you make any changes to the code and need to rebuild the services, you can use the following command:
     ```bash
      docker-compose build
     ```

##  Manual Setup
If you prefer to set up the services manually, you can follow these steps:

1. Create a MySQL database.
2. Navigate to the loan service directory and run the following commands:
    ```bash
    # Install dependencies
    yarn install (or npm install)
    
    # Start the service
    yarn start
    ```
3. Navigate to the API gateway service directory and run the following commands:
    ```bash
    # Install dependencies
    yarn install (or npm install)
    
    # Start the service
    yarn start
    ```
##  API Gateway
The API Gateway acts as the entry point for the Loan Enquiry services and is accessible on port 4000. You can access the Swagger documentation for the APIs at http://localhost:4000/api.

Please refer to the Swagger documentation for detailed information on the available endpoints and their usage.
