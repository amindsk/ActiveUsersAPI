/*
File: utils/index.js
Includes: Utility functions to fetch and manipulate data in the required format
*/
//To connect and extract data from the database
const db = require('../db/index');

//Fetch data required to form a topActiveUser's page from database.
//Parameters: page[Number] - Number of the page for which the details of the users required.
exports.getTopActiveUsers = async (page) => {
    let topActiveUsers, data, userIds;
    try {
        //Fetch the users of the specified page
        data = await db.getUsersByPageNumber(page);

        //If a user exists on the page.
        if (data.rows.length > 0) {
            topActiveUsers = data.rows;
            //Fetch array of Ids of all of the users on the page.
            userIds = data.rows.map(item => item.id);
            
            //Fetch counts of application (In last 7 days) of all of the users on the page
            const applicationCountsPromise = db.getApplicationsCount(userIds).then(applicationCounts => {
                //Fetch applications count of each user and add it to the appropriate field of specific user on the page.
                topActiveUsers.map(item => {
                    //Filter applications count of a specific user
                    let count = applicationCounts.rows.filter(rowItem => rowItem.user_id === item.id).map(count => count.count);
                    //Add a new field [count] in appropriate user
                    item['count'] = count[0] ? parseInt(count[0]) : 0;
                });
            });
            //Fetch 3 most recent listings of all of the users on the page
            const userListingsPromise = db.getMostRecentListings(userIds).then(userListings => {
                //Fetch names of the listings of each user and add it to the appropriate field of specific user on the page.
                topActiveUsers.map(item => {
                    //Filter names of the listings of a specific user
                    let listings = userListings.rows.filter(rowItem => rowItem.created_by === item.id).map(name => name.name);
                    //Add a new field [listings] in appropriate user
                    item['listings'] = listings;
                });
            });
            //Wait for all promises to finish
            await Promise.all([applicationCountsPromise, userListingsPromise]);
        }
        //returns to active users of specified page
        return topActiveUsers;
    }
    catch (err) {
        //returns the error if any of the db call failed
        return err;
    }

}

//Fetch data required to form a user with all of its details from database.
//Parameters: id[Number] - Id of the user for which the details required
exports.getUserDetails = async (id) => {
    let User, data;
    try {
        //Fetch basic details of a user of specified Id
        data = await db.getUserById(id);
        User = data.rows[0];
        //If user exists
        if (User) {
            //Fetch companies of the user
            const companiesPromise = db.getCompaniesByUser(id).then(data => {
                //Add a new field [companies] to the User object
                User['companies'] = data.rows;
            });
            //Fetch all of the listings created by the user
            const listingsPromise = db.getListingsCreatedByUser(id).then(data => {
                //Add a new field [createdListings] to the User object.
                User['createdListings'] = data.rows;
            });

            //Fetch all of the applications of the specified user with their associated listings
            const appsPromise = db.getApplicationsByUser(id).then(data => {
                //Fetch details of applications and the listings of each application and add a new field [applications] in the User object.
                User['applications'] = data.rows.map(item => {
                    //Restructure each application to nest its appropriate listing in it.
                    return {
                        id: item['id'],
                        createdAt: item['created_at'],
                        listing: {
                            id: item['listid'],
                            name: item['name'],
                            description: item['description']
                        },
                        coverLetter: item['cover_letter']
                    }
                });
            });
            //Wait for all promises to finish
            await Promise.all([companiesPromise, listingsPromise, appsPromise]);
        }
        //Return User object with all of the details associated.
        return User;

    } catch (err) {
        //returns the error if any of the db call failed
        return err;
    }
};