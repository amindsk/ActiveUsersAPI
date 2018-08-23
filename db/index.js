/*
File: db/index.js
Includes: Queries and functions to get data from database
P.S: Avoiding Temporary tables and Joins to make response efficient in production with larger data.
*/

//A "batteries included" SQL query builder.
const knexJS = require('knex');
//Organizes hierarchical configurations for your app deployments.
const config = require('config');
//Initializing the knex Library
const knex = knexJS({
    client: 'pg',
    //Extract connection URI from environement variable or from configuration file if not exists in environment variable.
    connection: process.env.POSTGRES_DB || config.get('connectionString'),
    pool: {
        min: 0,
        max: 10
    }
});

//Get the details of a single user.
//Parameters: id[Number] - Id of the user for which the details required
exports.getUserById = (id) => {
    return knex.raw(`select id, name, created_at as createdAt from users where id = ${id}`);
}
//Get the details of the companies of the user and also check if user contacted.
//Parameters: id[Number] - Id of the user for which details of the companies required
exports.getCompaniesByUser = (id) => {
    return knex.raw(`select c.id, c.created_at as createdAt, c.name, t.contact_user as isContacted from companies c join teams t on t.company_id = c.id where t.user_id = ${id} limit 5`);
}
//Get listings created by the user
//Parameters: id[Number] - Id of the user for which details of the listings required
exports.getListingsCreatedByUser = (id) => {
    return knex.raw(`select id, created_at as createdAt, name, description from listings where created_by = ${id} limit 5`);
}
//Get applications of the user and the details of the listing of the application as well
//Parameters: id[Number] - Id of the user for which details of the application and its associated listing required
exports.getApplicationsByUser = (id) => {
    return knex.raw(`select a.id, a.created_at, l.id as listid, l.name, l.description, a.cover_letter from applications a join listings l on a.listing_id = l.id where a.user_id = ${id} limit 5`);
}
//Sort the user in descending order based on the number of the listings applied on him and extract details of 10 users of a specific page.
//Parameters: page[Number] - Number of the page for which the details of the users required.
exports.getUsersByPageNumber = (page) => {
    return knex.raw(`select u.* from users u join listings l on u.id = l.created_by group by u.id order by count(l.id) desc offset ${(page-1)*10} limit 10;`);
}
//Get the total counts of application (created withing last 7 days) of the users
//Parameter: userIds[Array of numbers] - IDs of the users for which total counts of the applications required.
exports.getApplicationsCount = (usersIds) => {
    return knex.raw(`select user_id, count(id) from applications where user_id IN (${usersIds}) AND DATE_PART('day', now() - created_at) > 8 GROUP BY user_id`);
}
//Get the names of the 3 most recent listings of the users
//Parameters: userIds[Array of numbers] - Ids of the users for which names of the most recent lisitngs required.
exports.getMostRecentListings = (usersIds) => {
    return knex.raw(`select created_by, name from listings where created_by IN (${usersIds}) order by created_at desc limit 3`);
}   