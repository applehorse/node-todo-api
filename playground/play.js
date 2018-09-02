const argv = require("yargs").argv;

var power = (x, y) => {
    var ret = x;
    for (i = 1; i < y; i++) {
        ret *= x;
    }
    console.log(`The power result of ${x}^${y} = ${ret}`);
};

// console.dir(argv._);
// console.log(argv);

if (argv.base) {
    power(argv.base, argv.index);
} else {
    power(argv._[0], argv._[1]);
}

var a = 23 % 10;
var b = (23 - a) / 10;

console.log(`a=${a} and b=${b}`);



var x = 2, y = 3;

power(x, y);


