var fs = require('fs');
var chalk = require('chalk');

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) {
    
    if (err) throw err;

    var angaben = JSON.parse(data.toString());
    
    angaben.wolkenkratzer.sort(function(a,b) {
                  return a.hoehe - b.hoehe;
              });

    fs.writeFile(__dirname+"/sorted_wolkenkratzer.json", JSON.stringify(angaben), function(err) {
        if (err) throw err;

            for(var i in angaben.wolkenkratzer) {
                console.log(chalk.blue('Name: ') + chalk.cyan(angaben.wolkenkratzer[i].name));
                console.log(chalk.blue('Stadt: ') + chalk.red(angaben.wolkenkratzer[i].stadt));
                console.log(chalk.blue('Höhe: ') + chalk.green(angaben.wolkenkratzer[i].hoehe));
                console.log(chalk.blue("==================================="));
                }

        });

 });