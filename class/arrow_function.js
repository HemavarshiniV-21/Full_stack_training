const hello = (greeting) => {
    let age = 20;
    if(age>=18){
        console.log(greeting);
    }
    else{
        console.log("Not eligible");
    }
}
greeting = "Hello, welcome to the site!";
hello(greeting)