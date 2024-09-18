    const fs = require('fs');
    const fsp = require('fs/promises');
    const cors = require('cors');
    const path = require('path');
    const express = require('express');

    const app = express();
    const port = 8081;

    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/initial_info', (req, res) => {

        if(fs.existsSync('save_file.txt')){
            fs.createReadStream('save_file.txt', 'utf-8')
                .pipe(res)
                .on('finish', () => {res.end();})
        }
        else{
            const defaultInfo = {
                x: 15,
                y: 6,
                direction: 'south',
                pokedex: {}
            };
            res.json(defaultInfo);
            res.end()
        }

 
    });
    // This conditional will be true on 80% of the cases: Math.random() < 0.8

    const Game = function() {
        this.enterGrass = function() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(); 
                }, 4000);
                this.leaveGrass=()=>{
                    resolve();
                }

            });
        };

        
        this.capturePokemon = function() {
            return new Promise((resolve,reject)=>{
                let tries=0
                function recursiveCapture(){
                    setTimeout(() => {
                        if(Math.random() < 0.8){
                            tries++;
                            if(tries == 3){
                            resolve();
                            }else{
                            recursiveCapture();
                            }
                        }else{
                            reject();
                        }
                    }, 1000);
                    
                }
                recursiveCapture();
            })
        };
    };

    const gameObj = new Game();
    app.get('/enter_grass', async (req, res) => {
        try {
            await gameObj.enterGrass();
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(400);
            return;
        }
    });
    app.get('/leave_grass', async (req, res) =>{
        try {
            await gameObj.leaveGrass();
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(200);
        }
    });
    app.get('/capture',async (req,res) =>{
        try {
            await gameObj.capturePokemon();
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(400);
            return;
        }

    });

    app.post('/save', express.json(), async (req, res) => {
        let saveInfo = req.body;
        let saveString = JSON.stringify(saveInfo);
    
        try {
            await fs.promises.writeFile('save_file.txt', saveString);
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(200);
        }
    });

    app.get('/my_status_code_is_unknown', (req,res) =>{
        res.sendStatus(201);
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
        //internalTests();
    });

    /***************************
     ********* TESTS ***********
    ****************************/
    const internalTests = () => {

        const baseUrl = `http://localhost:${port}`;

        const test_enterGrassReject = () => {
            // Game.enterGrass -> Testing the promise rejects at 4 seconds.
            try {
                const start = Date.now();
                gameObj.enterGrass().then(_ => {
                    console.error(`test_enterGrassReject KO: enterGrass should not resolve, but reject if the promise has not been resolved before.`);
                }).catch(_ => {
                    const end = Date.now();
                    const diff = end - start;
                    if (diff < 3500 || diff > 4500) {
                        console.error(`test_enterGrassReject KO: enterGrass should reject after 4 seconds, not before or after.`);
                    }
                }).finally(() => {
                    console.log('test_enterGrassReject finished.');
                    test_enterGrassResolve();
                });
            } catch(e) {
                console.error(`test_enterGrassReject KO: catch -> ${e.toString()}`);
            }
        };

        const test_enterGrassResolve = () => {
            // Game.enterGrass -> Testing the promise does not reject at 4 seconds if we have resolved it before.
            try {
                gameObj.enterGrass().catch(_ => {
                    console.error(`test_enterGrassResolve KO: Promise should not reject because it has been resolved before.`);
                }).finally(() => {
                    console.log('test_enterGrassResolve finished.');
                    test_capturePokemon();
                });
                fetch(`${baseUrl}/leave_grass`);
            } catch(e) {
                console.error(`test_enterGrassResolve KO: catch -> ${e.toString()}`);
            }
        };

        const test_capturePokemon = () => {
            // Game.capturePokemon -> Testing the promise resolves after 3 seconds, or rejects in between 1 and 3 seconds.
            try {
                const start = Date.now();
                gameObj.capturePokemon().then(() => {
                    const resolveEnd = Date.now();
                    const resolveDiff = resolveEnd - start;
                    if (resolveDiff < 2500 || resolveDiff > 4500) {
                        console.error(`test_capturePokemon KO: Promise should resolve after 3 seconds, not before or after.`);
                    }
                }).catch(() => {
                    const catchEnd = Date.now();
                    const catchDiff = catchEnd - start;
                    if (catchDiff < 800 || catchDiff > 3500) {
                        console.error(`test_capturePokemon KO: Promise should reject in between 1 and 3 seconds, not before or after.`);
                    }
                }).finally(() => {
                    console.log('test_capturePokemon finished.');
                    test_saveAndInitialInfo();
                });
            } catch(e) {
                console.error(`test_capturePokemon KO: catch -> ${e.toString()}`);
            }
        };

        const test_saveAndInitialInfo = () => {
            const checkInitalInfoResponse = json => {
                if (!json || Object.prototype.toString.call(json) !== '[object Object]') {
                    return "Invalid response.";
                }
                if (!('x' in json) || !('y' in json) || !('direction' in json) || !('pokedex' in json)) {
                    return "Missing attributes.";
                }
                const pokedex = json['pokedex'];
                if (Object.prototype.toString.call(pokedex) !== '[object Object]') {
                    return "'pokedex' attribute is not a dictionary.";
                }
                const playerDirection = json['direction'];
                if (typeof playerDirection !== "string" || ["north", "south", "west", "east"].indexOf(playerDirection) < 0) {
                    return "'direction' attribute invalid.";
                }
                let intX = -1;
                let intY = -1;
                try {
                    //console.log('json', json);
                    intX = parseInt(json['x']);
                    intY = parseInt(json['y']);
                    if (intX < 0 || intY < 0 || isNaN(intX) || isNaN(intY)) {
                        return "'x' and 'y' attributes must be positive integers.";
                    }
                } catch(e) {
                    return `Error parsing to integer 'x' and 'y' attributes: ${e.toString()}`;
                }
            };
            // Saving random info using /save and checking it is correctly returned on /initial_info
            try {
                const initialInfo = {
                    x: parseInt(Math.random() * 10),
                    y: parseInt(Math.random() * 10),
                    direction: Math.random() < 0.5 ? 'south' : 'north',
                    pokedex: {}
                };
                fetch(`${baseUrl}/save`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(initialInfo)
                }).then(response => {
                    if (!response || response.status !== 200) {
                        console.error(`test_saveAndInitialInfo KO: /save -> invalid response or status code.`);
                        return;
                    }
                    fetch(`${baseUrl}/initial_info`).then(response => response.json()).then(json => {
                        const error = checkInitalInfoResponse(json);
                        if (error) {
                            console.error(`test_saveAndInitialInfo KO: /initial_info -> ${error}`);
                            return;
                        }
                        if (json['x'] !== initialInfo['x'] || json['y'] !== initialInfo['y'] || json['direction'] !== initialInfo['direction'] || JSON.stringify(json['pokedex']) !== JSON.stringify(initialInfo['pokedex'])) {
                            console.error(`test_saveAndInitialInfo KO: /initial_info -> Retrieved information is different from previously saved initialInfo dict.`);
                            return;
                        }
                        console.log('Tests finished.');
                    }).catch(err => console.error(`test_saveAndInitialInfo KO: /initial_info promise catch -> ${err.toString()}`));
                }).catch(err => console.error(`test_saveAndInitialInfo KO: /save promise catch -> ${err.toString()}`));
            } catch(e) {
                console.error(`test_saveAndInitialInfo KO: catch -> ${e.toString()}`);
            }
        };

        test_enterGrassReject();
    };
