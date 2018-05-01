//inputs
var startsWith;
var endsWith;

var yee;

//states

var count;
var states;

//inputs2

var inputs = []; //list of fields
var fieldsCont;
var buttonContains;
var buttonContainsOptional;
var buttonContainsNTimesOptional;
var buttonContainsAtLeastOnce;
var buttonContainsOneOfThese;
var clear;

var container;

var green = "#00994d";
var red = "#ff3300";
var grey = "#5c5c8a";
var textDiv;


function init() {
    console.log("init");
    startsWith = document.getElementById("startsWith");
    endsWith = document.getElementById("endsWith");
    yee = document.getElementById("yee");
    yee.addEventListener("click", launch);

    container = document.getElementById("container");
    textDiv = document.getElementById("text");

    fieldsCont = document.getElementById("fieldsCont")
    buttonContains = document.getElementById("buttonContains");
    buttonContains.addEventListener("click", function () {
        addField("contains", 1);
    });
    buttonContainsOptional = document.getElementById("buttonContainsOptional");
    buttonContainsOptional.addEventListener("click", function () {
        addField("containsOptional", 1);
    });
    buttonContainsNTimesOptional = document.getElementById("buttonContainsNTimesOptional");
    buttonContainsNTimesOptional.addEventListener("click", function () {
        addField("containsNTimesOptional", 1);
    });
    buttonContainsAtLeastOnce = document.getElementById("buttonContainsAtLeastOnce");
    buttonContainsAtLeastOnce.addEventListener("click", function () {
        addField("containsAtLeastOnce", 1);
    });
    buttonContainsOneOfThese = document.getElementById("buttonContainsOneOfThese");
    buttonContainsOneOfThese.addEventListener("click", function () {
        addField("containsOneOfThese", 10);
    });






}



function launch() {
    states = null;
    count = 0;
    states = [];


    console.log("launch");


    //start
    states[count] = new State(true, false, 0, 0);

    var startsWithValue = startsWith.value;
    startsWithValue.split("");
    for (var i = 0; i < startsWithValue.length; i++) {
        states[count].setDest("Q" + (count + 1), startsWithValue[i]);
        count++;
        states[count] = new State(false, false, 1, 0);
    }



    for (var i = 0; i < inputs.length; i++) {
        switch (inputs[i].className) {
            case "contains":
                handleContains(inputs[i].value);
                break;
            case "containsOptional":
                handleContainsOptional(inputs[i].value);
                break;
            case "containsNTimesOptional":
                handleContainsNTimesOptional(inputs[i].value);
                break;
            case "containsAtLeastOnce":
                handleContainsAtLeastOnce(inputs[i].value);
                break;
            case "containsOneOfThese":
                handleContainsOneOfThese(inputs[i].value);
                break;

        }

    }
    //ends

    var endsWithValue = endsWith.value || "#";
    endsWithValue.split("");
    for (var i = 0; i < endsWithValue.length; i++) {
        states[count].setDest("Q" + (count + 1), endsWithValue[i]);
        count++;
        console.log(i);
        if (i == endsWithValue.length - 1) {
            states[count] = new State(false, true, 1, 0);
        } else {
            states[count] = new State(false, false, 1, 0);
        }

    }





    g = post_traitement();
    console.log(g);
    create_graph(g);


    textDiv.innerHTML = JSON.stringify(states);
    console.log(states);

}

function handleContains(val) { // 1 time
    states[count].setDest("Q" + (count + 1), val);
    count++;
    states[count] = new State(false, false, 1, 0);

}

function handleContainsOptional(val) { //  0 to 1 times
    states[count].setDest("Q" + (count + 1), val);
    states[count].setDest("Q" + (count + 2), "#");
    count++;
    states[count] = new State(false, false, 1, 0);
    states[count].setDest("Q" + (count + 1), "#");
    count++;
    states[count] = new State(false, false, 1, 0);

}

function handleContainsAtLeastOnce(val) { // 1 to n times
    states[count].setDest("Q" + count, val);
    states[count].setDest("Q" + (count + 1), val);
    count++;
    states[count] = new State(false, false, 1, 0);
}

function handleContainsNTimesOptional(val) { // 0 to n times
    states[count].setDest("Q" + count, val);
    states[count].setDest("Q" + (count + 1), "#");
    count++;
    states[count] = new State(false, false, 1, 0);


}

function handleContainsOneOfThese(val) {
    var choices = val;
    choices.split("");
    for (var i = 0; i < choices.length; i++) {
        states[count].setDest("Q" + (count + 1 + i), choices[i]);
    }
    var afterStateNumber = count + choices.length + 1;

    for (var i = 0; i < choices.length; i++) {
        xPos = i == 0 ? 1 : 0;
        count++;
        states[count] = new State(false, false, xPos, -i);
        states[count].setDest("Q" + afterStateNumber, "#");
    }
    count++
    states[count] = new State(false, false, 1, 0);


}

function addField(type, maxLength) {
    console.log("new " + type);
    var input = document.createElement("input");

    input.type = "text";
    input.placeholder = type;
    //input.name = "member" + i;
    input.className = type;
    input.maxLength = maxLength;
    fieldsCont.appendChild(input);
    fieldsCont.appendChild(document.createElement("br"));

    inputs.push(input);

}

function clearCont() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    while (fieldsCont.firstChild) {
        fieldsCont.removeChild(fieldsCont.firstChild);
    }
    startsWith.value = "";
    endsWith.value = "";

    inputs = [];
    textDiv.innerHTML = "";

}

function post_traitement() {
    var g = {
        nodes: [],
        edges: []
    };
    var eIteration = 0;
    var totalX = 0;
    var ncolor;
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        ncolor = state.starts ? green : state.ends ? red : grey;
        console.log(ncolor);
        totalX += state.xAddedGraphicPosition;
        //console.log(state);
        g.nodes.push({
            size: 1,
            id: 'n' + i,
            label: state.id,
            //x: i * (0.3 / states.length),
            x: totalX * (0.3 / states.length),
            y: 0.03 * state.yGraphicPosition,
            color: ncolor
        });
    }

    for (var i = 0; i < states.length; i++) {
        var state = states[i]
        for (var y = 0; y < state.nextStates.length; y++) {
            //console.log(y);
            //console.log(state.nextStates[y]);
            //console.log(state.nextStates[y].charAt(1));
            //console.log(i);
            g.edges.push({

                id: 'e' + eIteration,
                label: state.nextPathsValues[y],
                source: 'n' + i,
                target: 'n' + state.nextStates[y].substr(1),
                type: 'curvedArrow',
                size: 100,
                color: '#666'
            });

            eIteration++
        }
    }
    return g;
}

function create_graph(g) {
    var s = new sigma({
        graph: g,
        renderer: {
            container: container,
            type: 'canvas'
        },

    });
}


function State(start, finish, xAddedGraphicPosition, yGraphicPosition) {
    this.id = "Q" + count;

    this.starts = start;
    this.ends = finish;

    this.xAddedGraphicPosition = xAddedGraphicPosition;
    this.yGraphicPosition = yGraphicPosition;

    this.nextStates = [];
    this.nextPathsValues = [];

    State.prototype.setDest = function (s, p) {
        this.nextStates.push(s);
        this.nextPathsValues.push(p);
    };
}


window.addEventListener("load", init);
