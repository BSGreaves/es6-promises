// Use AJAX | Promises to load all 3 JSON files
// Iterate over all JSON files and match the human with their appropriate pet(s)
// ES6-ify it all!

$(document).ready(function() {

    var myHumans = [];
    var myAnimals = [];

    function loadJSON(filepath) {
        return new Promise(function(resolve, reject) {
            $.ajax(filepath)
                .done(function(data) {
                    resolve(data);
                }).fail(function(error) {
                    reject(error);
                });
        });
    }

    var outputContainer = $("#output");

    var writeToDOM = function(humanArray) {
        var domString = ""
        for (var i = 0; i < humanArray.length; i++) {
            domString += `<div class="human row">`
            domString += `<div class="col-sm-4">`
            domString += `<img src="${humanArray[i].image}">`
            domString += `<p>${humanArray[i].name}</p>`
            domString += `</div>`
            domString += `<div class="col-sm-8 overflow-row">`
            for (var j = 0; j < humanArray[i].matches.length; j++) {
                domString += `<div class="animal">`
                domString += `<img src="${humanArray[i].matches[j].image}">`
                domString += `<p>${humanArray[i].matches[j].name}</p>`
                domString += `<p>${humanArray[i].matches[j].description}</p>`
                domString += `</div>`
            }
            domString += `</div>`
            domString += `</div>`
        }
        outputContainer.append(domString)
    }

    Promise.all([loadJSON("./database/humans.json"), loadJSON("./database/dinos.json"), loadJSON("./database/dogs.json"), loadJSON("./database/cats.json")])
        .then(function(data) {
            data[0] = data[0].humans;
            data[0].forEach(function(each) {
                each.matches = [];
                myHumans.push(each);
            })
            data[1] = data[1].dinos;
            data[2] = data[2].dogs;
            data[3] = data[3].cats;
            data[1].forEach(function(each) {
                myAnimals.push(each);
            });
            data[2].forEach(function(each) {
                myAnimals.push(each);
            });
            data[3].forEach(function(each) {
                myAnimals.push(each);
            });
            for (let i = 0; i < myHumans.length; i++) {
                for (let j = 0; j < myAnimals.length; j++) {
                    if (checkForTypeMatch(myHumans[i], myAnimals[j]) && checkForKidFriendly(myHumans[i], myAnimals[j])) {
                        myHumans[i].matches.push(myAnimals[j]);
                    }
                }
            }
            writeToDOM(myHumans);
        }).catch(function(error) {
            console.log(error);
        });

    var checkForTypeMatch = function(human, pet) {
        var interestedInArray = human["interested-in"];
        var isMatchNumber = interestedInArray.indexOf(pet.type);
        if (isMatchNumber === -1) {
            return false;
        } else {
            return true;
        }
    }

    var checkForKidFriendly = function(human, pet) {
        var hasKids = human["has-kids"]; //true or false
        var isKidFriendly = pet["kid-friendly"];
        var isMatched = true;
        if (hasKids && !isKidFriendly) {
            isMatched = false;
        }
        return isMatched;
    }
});