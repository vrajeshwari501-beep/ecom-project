const mssql = require('mssql');

const config = {
    server: 'LAPTOP-OHQM6TMM\\SQLEXPRESS01', // Unga laptop server name
    database: 'EcomDB',                     // Nama create panna database peyar
    user: 'sa',                             // Ippo nama active panna 'sa' user
    password: 'EcomPassword123',            // Azure Data Studio-la nama set panna password
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new mssql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('SQL Server Connected Successfully! ✅');
        return pool;
    })
    .catch(err => {
        console.log('Database Connection Failed! ❌ ', err);
    });

module.exports = { mssql, poolPromise };