const express = require('express')
const http = require("http");
// const app= require("./v1/parcels");

const port = 3000;
const app = require("./app")

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
