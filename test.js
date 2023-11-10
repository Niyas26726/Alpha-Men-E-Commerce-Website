// // function somemethod() {
// //   console.log(counter1); 
// //   console.log(counter2); 
// //   var counter1 = 1;
// //   let counter2 = 2;
// //   }

// //   somemethod();

// var myfunction="welcome";
// var myfunction="Hello mr";

//   function something(name){
//     function greeting(message){
//       console.log(message+" "+name);
//     }
//     return greeting(myfunction);
//   }

//   var myfunction=something("John");

//   // something()

function sample(str1,str2){
  let x=new Set();
  let y=new Set();
  let m= Array.from(str1)
  let n= Array.from(str2)
  for(i of m){
    x.add(i);
  }
  for(j of n){
    y.add(j);
  }
  for(char1 of x){
      if(y.has (char1)){
        var flag=1;
      }else{
        return"no"
      }
    }
    if(flag===1){
      return str2
    }
  }
console.log(sample("AACBCAACBCAACBCAACBC","AACBCAACBCAACBC"));