let fruits = ["apple", "banana", "mango"];
for (let i=0;i<fruits.length;i++){
    console.log(fruits[i])
}

let car = {
    name: "BMW",
    model: "X5",
    year: 2020
}

car.name = "Audi"
console.log(car.name)


var x;   // var can be redeclared and updated
console.log(x);
var x = 5;

let y;
console.log(y);
//let y = 10;      // let cannot be redeclared but can be updated
y = 15; // updated
console.log(y);


let person = {
    name:'hema',
    age: 21,
    city : 'tirupur'
}

for(let i in person){
    console.log(i + ":"+person[i])
}