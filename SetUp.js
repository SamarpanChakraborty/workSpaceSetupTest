var fs = require('fs'),
    nrc = require('node-run-cmd'),
    program = require('commander'),
    pkg = require('./package.json'),
    exec = require('child_process').exec;
var ProgressBar = require('progress');
console.log("\n *STARTING* \n");
// Get content from file
var contents = fs.readFileSync("./config.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);

var moveTo = 'cd ./' + jsonContent.pathToCreateWorkSpace;
var gitclonecmd = "git clone " + jsonContent.gitURL;
nrc.run(moveTo).then(function(exitCodes) {
        nrc.run(gitclonecmd).then(function(exitCodes) {
                console.log('*CLONING DONE*');
                console.log('CHECKING for Node Module && package.json');
                nrc.run('cd ./' + jsonContent.pathToCreateWorkSpace + '/' + jsonContent.checkNpm).then(function(exitCodes) {
                        var fld1 = fileExists(jsonContent.pathToCreateWorkSpace + '/' + jsonContent.checkNpm + '/node_modules');
                        var fld2 = fileExists(jsonContent.pathToCreateWorkSpace + '/' + jsonContent.checkNpm + '/package.json');
                        debugger;
                        if (fld1 && fld2) {
                            console.log('Node Module Already exit !!');
                        } else if (!fld1 && fld2) {
                            nrc.run('npm install').then(function(exitCodes) {
                                program
                                    .version(pkg.version)
                                    .action(cmd(jsonContent.pathToCreateWorkSpace + '/' + jsonContent.checkNpm));

                                program.parse(process.argv); // notice that we have to parse in a 
                            }, function(err) {
                                console.err('Command failed to run with error: git cloning failed ', err);
                            });
                        }
                    },
                    function(err) {
                        console.err('Command failed to run with error: Nodule INstallation Failed cloning failed ', err);
                    });
            },
            function(err) {
                console.err('Command failed to run with error: git cloning failed ', err);
            });
    },
    function(err) {
        console.err('Command failed to run with error: ', err);
    });


function fileExists(s) {
    try {
        return fs.realpathSync(s);
    } catch (e) {
        return false;
    }
}

function cmd(directory) {
    var cmd = 'npm install --prefix ' + directory + '/package.json';
    var execCallback = function(error, stdout, stderr) {
        if (error) console.log("exec error: " + error);
        if (stdout) console.log("Result: " + stdout);
        if (stderr) console.log("shell error: " + stderr);
    };
    exec(cmd, execCallback);

    var bar = new ProgressBar(':bar :current/:total', {
        total: 100
    });
    var timer = setInterval(function() {
        bar.tick();
        if (bar.complete) {
            clearInterval(timer);
        }
    }, 1000);

    exec('code ' + directory, execCallback);
}