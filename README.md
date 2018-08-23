# ActiveUsersAPI
Dashboard for top active users

## Active Users API
Active Users API is the NodeJS API develped for a dashboard displaying top active users, using this API you can get the details of the users including
* user details
* applied listings
* connected companies
* created listings

you can also get details of the top active users including
* user details
* number of applications in past 7 days
* names of three most recent listings applied by user

Top active users are paginated means you can get 10 users per page, you only need to provide page number and you will get details of the 10 users appeared on that specific page.  

Note: All of the top users are listed and ordered by total activity(Total activity is a measure of total count of listings applied to the user).

## Getting Started

### Cloning the repositry
Clone the repository on your local machine or run following command on git bash or your favourite command line tool in your desired directory.  
Note: Make sure you have git installed on your machine otherwise command will not work.

```
git clone https://github.com/amindsk/ActiveUsersAPI.git
```

### Installing npm dependencies
In the command line tool navigate into the project directory and run following command to install all of the dependencies of the project.  
Note: Make sure you have NodeJS installed on your machine otherwise command will not work.
```
npm install
```

### Updating connection string and the port
In the project open [default.json](https://github.com/amindsk/ActiveUsersAPI/blob/master/config/default.json) placed in configs direcotry and change the database connection string to connect it to your desired database, you can also change the port number where API shall listen for requests and send its responses.  
NOTE: Please skip this step if you want to fetch connection string and the port number from environment variable.

### Starting the API
In the command line tool navigate into the project directory and run following command to run the API
```
npm run start
```
  
##### Hooray! You have started the API successfully, now you can access its routes, the most common tool to acccess and check API routes is postman, go ahead, download the tool and install it, [here](https://www.getpostman.com/) is the link to its download page along with the documentation on how to use this tool.
  
## API Routes 
API has following two routes
```
GET    /users?id={userId}
GET    /topActiveUsers?page={pageNumber}
```

### /users?id={userId}
Takes an id of the user as a query parameter and returns the details of the user assoiated with provided user.
Note: Id must be a number

### /topActiveUsers?page={pageNumber}
Takes a page number as a query parameter and returns the top ten active users appeared on that page.
Note: pageNumber must be a number.
