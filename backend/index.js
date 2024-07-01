const express = require('express');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const User = require('./db');
const secret = require('./config');
const userMiddleware = require('./middlewares');
const app = express();
app.use(express.json());
const todoSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    completed: zod.boolean(),
});

app.post('/signup',async (req,res)=>{
    const {username,password} = req.body;
    const user = User.create({username,password,todos:[]});
    res.json({
        'message':'User created'
    })
});
app.post('/login',async (req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username:username});
    if(user.password === password){
        const token = jwt.sign({username},secret);
        res.json({
            'token':token
        });
    }
    else{
        res.status(401).send('Unauthorized');
    }
});
app.get('/todos',userMiddleware,async (req,res)=>{
    const token = req.headers.authorization;
    const words = token.split(' ');
    const tokenValue = words[1];
    const decoded = jwt.verify(tokenValue,secret);
    const user = await User.findOne({username:decoded.username});
    res.json(user.todos);
});
app.post('/todos',userMiddleware,async (req,res)=>{
    const token = req.headers.authorization;
    const words = token.split(' ');
    const tokenValue = words[1];
    const decoded = jwt.verify(tokenValue,secret);
    const user = await User.findOne({username:decoded.username});
    const check = todoSchema.safeParse(req.body.todo);
    if(check.success == false){
        res.status(400).send('Bad Request');
        return;
    }
    user.todos.push(req.body);
    await user.save();
    res.json({
        'message':'Todo added'
    });
});
app.listen(3000,()=>{
    console.log('Server started');
});