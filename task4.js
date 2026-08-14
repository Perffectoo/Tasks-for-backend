const express=require('express');
const app =express();
const port=3000;
const fs=require("fs")
app.use(express.json());



app.post("/user",(req,res)=>{
    const users=JSON.parse(fs.readFileSync("users.json"))
const user=users.find(user=>user.email=== req.body.email);
if(user){
    res.status(404).json({message:"User Existed ,, 8ayr al email bitte"})
}

users.push(req.body)
fs.writeFileSync(
    "users.json",JSON.stringify(users,null,2)
)
    res.status(201).json({message:"User Added succussfully ya 3am perfecto"})

})

app.patch("/user/:id",(req,res)=>{
const users=JSON.parse(fs.readFileSync("users.json"))
const user=users.find(user=>user.id===Number(req.params.id))
if(user===false){
    res.status(404).json({message:"Id is not existed"})
}
Object.assign(user, req.body); 
    fs.writeFileSync("users.json",JSON.stringify(users,null,2))
    res.status(201).json({message:"Info has been updated"})

})


app.delete("/user{/:id}",(req,res)=>{
    const users=JSON.parse(fs.readFileSync("users.json"))
    const user=users.findIndex(user=>user.id===Number(req.body.id))

    if(!user){
        res.status(404).json({message:"User not found"})
    }

users.splice(user,1)
fs.writeFileSync("users.json",
    JSON.stringify(users,null,2)
)
    res.status(201).json({message:`User ${req.body.id}  has been deleted`})
})


app.get("/user/getByName",(req,res)=>{
    const users=JSON.parse(fs.readFileSync("users.json"))
    const{name}=req.query
    const ExactName=users.find(user=>user.name===name)
    if(!ExactName){
    res.status(404).json({message:"Name not found"})
    }

res.status(201).json({ExactName})
})


app.get("/users",(req,res)=>{
    const users=JSON.parse(fs.readFileSync("users.json"))
    res.status(201).json({users})
})


app.get("/user/filter",(req,res)=>{
    const users=JSON.parse(fs.readFileSync("users.json"))
    const {minAge}=req.query
    const BiggerValues=users.filter(user=>user.age>Number(minAge))
if(BiggerValues.length===0){
    res.status(404).json({message:"User not found"})
}   

res.status(201).json({BiggerValues})
})




app.get("/user/:id",(req,res)=>{
    const users=JSON.parse(fs.readFileSync("users.json"));
    const {id}=req.params;
    const certainId=users.find(user=>user.id===Number(id))
if(!certainId){
    res.status(404).json({message:"User not found with this id"})
}
res.status(201).json({certainId})
})






app.listen(port,()=>{
    console.log("server is running ya 7ag")
})


