const express = require("express");
const app = express();
const joi = require("joi");
const orders = require("./api/v1/orders")


app.get("/parcels", (req, res, next) => {
    res.send({
        orders: orders
    })
});



app.get("/parcels/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    orders.map((order) => {
        if (order.id === id) {
            return res.status(200).send({
                order: order
            });
        }

    });
    req.setTimeout(500);
});

app.get('/users/:u_id/parcels', (req, res, next)=>{
    const u_id= req.params.u_id;
    const result = orders.filter(u=>u.client_id==u_id);
    if(result.client_id===u_id){
        return result
    }
     res.status(200).json({
         orders:result
     });
 });

app.put("/parcels/:id/cancel", (req, res, next)=>{
    const order = orders.find(o=>o.id===parseInt(req.params.id));
    if(!order){
        res.status(404).send("Order not found");
    }
    const {err}= validateOrder(req.body);
    if(err){
        res.status(400).send(err.details[0].message);
        return;
    }
    order.status= 'canceled';
    res.send(order);
});

app.post("/parcels", (req, res, next)=>{
    // var u = req.body.type;
    // console.log(u);
    // res.end("end over")
    const{err}= validateOrder(req.body);
    if(err){
        res.status(400).send(err.details[0].message);
        return;
    }
    const order ={
        id: orders.length+1,
        client_id:req.body.client_id,
        type: req.body.type,
        destination: req.body.destination,
        comment: req.body.comment,
        date: req.body.date,
        status: req.body.status
    };
    orders.push(order);
    res.send(order);
});

function validateOrder(order){
    const schema = {
        id: joi.number().required(),
        client_id: joi.string(),
        title: joi.string().min(3).max(60).required(),
        destination: joi.string().required(),
        comment: joi.string().min(10).max(1000),
        date: joi.date(),
        state: joi.string().required()
    };
    return joi.validate(order, schema);
}

module.exports = app;