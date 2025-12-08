/// ternary operators

let age = 25;
console.log(age>18 ? 'welcome' : 'not eligible');

// spread operator

const number = [1,2,3];
const newNumber = [4,5,6];
const allNumber = [0,...number,...newNumber];
console.log(allNumber);

const person = {
    name:'hema',
    age:25
}
const city = 'tirupur';
const newPerson = {...person,city};
console.log(newPerson);

//destructing operator

const num = [1,2,3];
const [a,b,c] = num;
console.log(a,b,c)

const [first, ,third] = num;
console.log(first,third)

const [x,y,...rest] = num;
console.log(x,y)
console.log(rest)

