// import minimist from "minimist";

// const options = {
//     alias: {
//       c: 'CANTIDAD'
//     }
//   }

// const args = minimist(process.argv.slice(2), options); 

export const random = (cant) => {
    let numArr = [];

    for (let i = 0; i < cant; i++) {
        let randomNum = Math.floor(Math.random() * 1000) + 1;
        numArr.push(randomNum)
    }
    return numArr;
}

export const calc = (args) => {
    let x = [];

    for (let i = 0; i < args.length; i++) {
        if (x.some(elem => elem.numero === args[i])) {
            x.forEach(elem => {
                if (elem.numero === args[i]) {
                    elem.apariciones += 1;
                }
            })
        } else {
            x.push({numero: args[i], apariciones: 1})
        }
    }
    return x;
}


// process.on('message', nums => {
//     console.log("arrancando")
//  })

//   process.send(calc(random(args.CANTIDAD)))
 
