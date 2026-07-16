// 1
let str = "123";
let num = Number(str);

console.log(num + 7);


// 2
let value = 0;

if (!value) {
    console.log("Invalid");
}


// 3
for (let i = 1; i <= 10; i++) {

    if (i % 2 == 0) {
        continue;
    }

    console.log(i);
}


// 4
let numbers = [1, 2, 3, 4, 5];

let even = numbers.filter(function(number){
    return number % 2 == 0;
});

console.log(even);


// 5
let array1 = [1,2,3];
let array2 = [4,5,6];

let result = [...array1, ...array2];

console.log(result);


// 6
let day = 2;

switch(day){

    case 1:
        console.log("Sunday");
        break;

    case 2:
        console.log("Monday");
        break;

    case 3:
        console.log("Tuesday");
        break;

    case 4:
        console.log("Wednesday");
        break;

    case 5:
        console.log("Thursday");
        break;

    case 6:
        console.log("Friday");
        break;

    case 7:
        console.log("Saturday");
        break;

    default:
        console.log("Invalid");
}


// 7
let words = ["a", "ab", "abc"];

let lengths = words.map(function(word){
    return word.length;
});

console.log(lengths);


// 8
let number = 15;

if(number % 3 == 0 && number % 5 == 0){
    console.log("Divisible by both");
}
else{
    console.log("Not divisible");
}

// 9. 

let square = (number) => {
    return number * number;
};

console.log(square(5));


// 10. 

let person = {
    name: "John",
    age: 25
};

let {name, age} = person;

console.log(name + " is " + age + " years old");


// 11. 

function sum(a, b, c, d, e){

    return a + b + c + d + e;
}

console.log(sum(1,2,3,4,5));


// 12. 

function getMessage(){

    return new Promise(function(resolve){

        setTimeout(function(){

            resolve("Success");

        }, 3000);

    });
}

getMessage().then(function(message){

    console.log(message);

});


// 13. 

let nums = [1,3,7,2,4];

let largest = nums[0];

for(let i = 1; i < nums.length; i++){

    if(nums[i] > largest){

        largest = nums[i];
    }
}

console.log(largest);


// 14. 

let user = {
    name: "John",
    age: 30
};

let keys = Object.keys(user);

console.log(keys);


// 15. 

let text = "The quick brown fox";

let wordsArray = text.split(" ");

console.log(wordsArray);




/* TASK 2
1. Difference between forEach and for...of

forEach is used to loop through array elements and execute a function.
for...of is used to loop through values and it allows break and continue. 

2. Hoisting and Temporal Dead Zone (TDZ)

Hoisting means JavaScript moves declarations to the top before running the code.
TDZ is the time before declaring let or const where we cannot use the variable.

3. Difference between == and ===

== compares values and converts the type automatically.
=== compares values and types without conversion.

4. try-catch

try-catch is used to handle errors and prevent the program from stopping
5. Type conversion and coercion

Type conversion means we manually change the type of a value.
Type coercion means JavaScript automatically changes the type.
*/
