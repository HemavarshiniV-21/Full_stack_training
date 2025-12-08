function isAge(age){
    if(age>18){
         console.log("Major")
    }
    else{
        console.log("Minor")
    }
}
isAge(18)
isAge(20)


function Operation(a,b,operation){
    switch(operation){
        case "+":
            console.log(a+b)
            break;
        case "-":
            console.log(a-b)    
}}

Operation(5,4,'+')
Operation(10,6,'-')