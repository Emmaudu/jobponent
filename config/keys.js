// dbPassword = 'mongodb+srv://localhost:5000'+ encodeURIComponent('YOUR_PASSWORD_HERE') + '@CLUSTER_NAME_HERE.mongodb.net/test?retryWrites=true';

dbPassword = 'mongodb://localhost:27017/data-base'


module.exports = {
    mongoURI: dbPassword
};
