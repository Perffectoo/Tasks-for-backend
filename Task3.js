/* Part 1

1. What is the Node.js Event Loop?

The Event Loop is a mechanism in Node.js that allows it to handle many tasks without waiting. It checks if asynchronous tasks are finished and moves their callbacks to the Call Stack to be executed.

2. What is Libuv and What Role Does It Play in Node.js?

Libuv is a library used by Node.js. It provides the Event Loop and helps Node.js handle asynchronous operations like file reading, network requests, and timers.

3. How Does Node.js Handle Asynchronous Operations Under the Hood?

Node.js sends asynchronous tasks to Libuv. Libuv handles these tasks using the operating system or the Thread Pool. When the task finishes, the callback is added to the Event Queue, and the Event Loop executes it.

4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?

Call Stack: Executes the current JavaScript code.
Event Queue: Stores completed asynchronous tasks waiting to be executed.
Event Loop: Checks the Call Stack and moves tasks from the Event Queue to the Call Stack when it is empty.

5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?

The Thread Pool is a group of threads used by Node.js to handle some heavy tasks like file system operations and encryption.

The size can be changed using:

UV_THREADPOOL_SIZE=8

6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?

Node.js executes non-blocking code asynchronously, 
so it can continue running other tasks. Blocking code stops the execution until the task is finished,
 which can slow down the application
 */







/* Part 2 */
const http =require("node:http");
const fs = require("node:fs");

const PORT=8080;



const server=http.createServer((request,response)=>{
    const {url,method}=request;
response.setHeader("Content-Type","application/json")
if(url==="/user" && method==="POST"){
    let cartona="";
    request.on("data",(chunck)=>{
        cartona += chunck.toString();
    });
    request.on("end",()=>{
        try{
            const data=JSON.parse(cartona);
            const users = JSON.parse(
                    fs.readFileSync("users.json", "utf8")
                );
                const existingUser = users.find(
                    (user) => user.email === data.email
                );

                if (existingUser) {
                    response.writeHead(400);
                    return response.end(
                        JSON.stringify({
                            message: "Email already exists",
                        })
                    );
                }
                users.push(data);

fs.writeFileSync(
    "users.json",
    JSON.stringify(users, null, 2)
);
            response.end(
                JSON.stringify({
                    message:'User added successfully'
                })
            )
        }catch(err){
    console.log(err);

    response.writeHead(401);

    response.end(
        JSON.stringify({
            err: err.message
        })
    );
}
    })
}else if(url.startsWith("/user/") && method==="PATCH"){

    const id = url.split("/")[2];
    let cartona = ""; 
    request.on("data",(chunk)=>{
        cartona += chunk.toString();
    });

    request.on("end",()=>{

        try{

            const updatedData = JSON.parse(cartona);

            const users = JSON.parse(
                fs.readFileSync("users.json","utf8")
            );


            const userIndex = users.findIndex(
                (user)=> user.id == id
            );


            if(userIndex === -1){
                response.writeHead(404);

                return response.end(
                    JSON.stringify({
                        message:"User not found"
                    })
                );
            }


            users[userIndex] = {
                ...users[userIndex],
                ...updatedData
            };


            fs.writeFileSync(
                "users.json",
                JSON.stringify(users,null,2)
            );


            response.end(
                JSON.stringify({
                    message:"User updated successfully"
                })
            );


        }catch(err){

            response.writeHead(400);

            response.end(
                JSON.stringify({
                    error:err.message
                })
            );
        }

    });

}else if(url.startsWith("/user/") && method==="DELETE"){


    const id = url.split("/")[2];


    try{
        const users = JSON.parse(
            fs.readFileSync("users.json","utf8")
        );


        const userIndex = users.findIndex(
            (user)=> user.id == id
        );


        if(userIndex === -1){

            response.writeHead(404);

            return response.end(
                JSON.stringify({
                    message:"User not found"
                })
            );
        }


        users.splice(userIndex,1);


        fs.writeFileSync(
            "users.json",
            JSON.stringify(users,null,2)
        );


        response.end(
            JSON.stringify({
                message:"User deleted successfully"
            })
        );


    }catch(err){

        response.writeHead(400);

        response.end(
            JSON.stringify({
                error:err.message
            })
        );
    }

}else if(url==="/user" && method==="GET"){

    try{

        const users = JSON.parse(
            fs.readFileSync("users.json","utf8")
        );

        response.end(
            JSON.stringify(users)
        );

    }catch(err){

        response.writeHead(400);

        response.end(
            JSON.stringify({
                error:err.message
            })
        );
    }

}else if(url.startsWith("/user/") && method==="GET"){

    const id = url.split("/")[2];

    try{

        const users = JSON.parse(
            fs.readFileSync("users.json","utf8")
        );


        const user = users.find(
            (user)=> user.id == id
        );


        if(!user){

            response.writeHead(404);

            return response.end(
                JSON.stringify({
                    message:"User not found"
                })
            );
        }


        response.end(
            JSON.stringify(user)
        );


    }catch(err){

        response.writeHead(400);

        response.end(
            JSON.stringify({
                error:err.message
            })
        );
    }

}
else{
    response.writeHead(404);
    response.end(JSON.stringify({
        error:`route ${url} not found `
    }))
}
})

server.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
})
