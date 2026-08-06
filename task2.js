const path = require("path");
function getCurrentPath() {
  console.log({
    File: __filename,
    Dir: __dirname,
  });
}
getCurrentPath();

function basefile(base) {
  return path.basename(base);
}
console.log(basefile("/Tasks/task2.js"));

function buildPath(obj) {
  return path.join(obj.dir, obj.name + obj.ext);
}
console.log(
  buildPath({
    dir: "/folder",
    name: "app",
    ext: ".js",
  }),
);

function fileExtension(filepath) {
  return path.extname(filepath);
}
console.log(fileExtension("/Tasks/task2.js"));

function fileparse(filepath) {
  return path.parse(filepath);
}
console.log(
  "Name:" +
    fileparse("/Tasks/task2.js").name +
    "\n" +
    "Ext:" +
    fileparse("/Tasks/task2.js").ext,
);

function isAbosulte(filepath) {
  return path.isAbsolute(filepath);
}
console.log(isAbosulte("/Tasks/task2.js"));



function joinSegments(a,b,c) {
  return path.join(a,b,c);
}
console.log(joinSegments("src","components", "App.js"));


function resolvePath(relativePath) {
    return path.resolve(relativePath);
}
console.log(resolvePath("./task2.js"));



function joinSegments(a,b) {
  return path.join(a,b);
}
console.log(joinSegments("folder1","folder2/file.txt"));



const fs=require('node:fs')
const fsPromise=require('node:fs/promises');

 
// async function deleteFile(){
// try{
//     await fsPromise.unlink("./try1.txt");
//     console.log("File removed")
// }catch(Hossam){
// console.log(Hossam)
// }
// }
// deleteFile();


function createFile(){
    try {
        fs.writeFileSync("test1.txt", "Ya hala");
        console.log("Message was written successfully in the new created file");
    } catch(error) {
        console.log("Error " + error);
    }
}
createFile();


const EventEmitter = require('events');
const emitter= new EventEmitter();
var  name;
function startEvent(){
 return emitter.on("start",(data)=>{
     console.log("Welcome  "+data)
  })
}
startEvent()
emitter.emit("start","hossam")



emitter.on("Login",(data)=>{
  console.log("User logged in: "+data)
})
emitter.emit("Login","Perfecto")




try {
    const data = fs.readFileSync("./test1.txt");
    console.log( "File content: "+ data);
} catch (error) {
    console.log("Error:", error.message);
}


async function writeFileAsync(name){
try{
 await fsPromise.writeFile("./test1.txt",name)
 console.log("name has been added successfully")
}catch(error){
  console.log("error is: "+error)
}
}

writeFileAsync("ya Perfecto")


if(fs.existsSync("./test1.txt")){
  console.log("true")
}else{
  console.log("false")
}

const os=require("node:os")
function OsPlatform(){
try{
console.log("Platform: "+os.platform()+ "\n" +"Arch: "+os.arch())
}catch(error){
  console.log("Error is "+error)
}
}
OsPlatform();


const readableSteam=fs.createReadStream("test1.txt")
const writeStream=fs.createWriteStream("test2.txt")
readableSteam.on("data",(chunk)=>{
  console.log("Recieved data : "+chunk)
})

readableSteam.pipe(writeStream); // ta7dyd bel zabt reading ba3dyha al info aly tat2ry tro7 lel writing stream 
writeStream.on("finish",()=>{
  console.log("data has been moved")
})




const writeStreamm=fs.createWriteStream("test2.txt.gz")
const zlib=require("node:zlib")
const gzip=zlib.createGzip();

readableSteam.pipe(gzip).pipe(writeStreamm)

writeStreamm.on("finish",()=>{
  console.log("File has been compressed and copied ")
})

