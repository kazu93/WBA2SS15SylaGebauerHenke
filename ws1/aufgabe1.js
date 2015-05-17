var fs = require('fs');

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) {
            if (err) throw err;

              var angaben = JSON.parse(data);

              fs.writeFile(__dirname+"/sorted_wolkenkratzer.json", JSON.stringify(angaben), function(err) {
                if (err) throw err;

                for(var i in angaben.wolkenkratzer) {
                  console.log('Name: ' + angaben.wolkenkratzer[i].name);
                  console.log('Stadt: ' + angaben.wolkenkratzer[i].stadt);
                  console.log('Höhe: ' + angaben.wolkenkratzer[i].hoehe);
                  console.log("===================================");
                }

            });

 });