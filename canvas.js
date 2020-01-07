
if (window.navigator.standalone == true) {
    window.requestFullscreen();
};

let canvas = document.querySelector('canvas');
let row = document.querySelector('#row');
let left = document.querySelector('#left');
let right = document.querySelector('#right');

let selectedColorPicker = 0;

// let ul = document.querySelector('ul');

let menuToggleBtn = document.getElementById('menu-toggle');

let rightIsToggled = false;

menuToggleBtn.addEventListener("click", menuToggle);
window.addEventListener("keydown", toggleSpacebar);
window.addEventListener("keydown", toggleC);

let rowHeight = row.getBoundingClientRect();
let height = rowHeight.height;

let leftWidth = left.getBoundingClientRect();
let width = leftWidth.width;


canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

let mouse = {
    x: undefined,
    y: undefined
};


// SLIDERS:
// circles default colors:
let colorArray =
[
    "#2a152c", //this is the Background color
    "#00aeff",
    "#96ffa5",
    "#4dfcff",
];

// color picker:
let colorPickerContainer = document.querySelector('#color-picker-container');
let colorBtn = document.getElementsByClassName('color-btn');
let colorPickerIsToggled = false;

let visibilityHiddenTimout = 0;

let toggleColorsBtn = document.querySelector("#toggle-colors-btn");

toggleColorsBtn.addEventListener("click", function() {
    toggleColorPicker();
    if (canvas.width <= 500) {
        hideRight();
    };
});

for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function() {
        if (selectedColorPicker === i) {
            colorBtn[i].classList.remove('focus');
            hideColorPicker();
        } else {
            unfocus();
            focus(i);
            selectedColorPicker = i;
        };
        colorWheel.hex = colorArray[i];
    });
};

var colorWheel = new ReinventedColorWheel({
    // appendTo is the only required property. specify the parent element of the color wheel.
    appendTo: colorPickerContainer,
    hex: colorArray[0],
    wheelDiameter: 300,
    wheelThickness: 40,
    handleDiameter: 25,
    wheelReflectsSaturation: true,

    // handler
    onChange: function () {
        focusedColorBtn.style.background = colorWheel.hex;
        centerSample();
        colorArray[selectedColorPicker] = colorWheel.hex;
        if (selectedColorPicker === 0) {
            canvas.style.background = colorArray[0]
        };
    },
});

updateColorButtons();


// density:
let slider_density = document.getElementById("density");
let output_density = document.getElementById("densityValue");
output_density.innerHTML = slider_density.value; // Display the default slider value

slider_density.oninput = function() {
    output_density.innerHTML = this.value;
    density = this.valueAsNumber;
    init();
}

// max radius:
let slider_maxRadius = document.getElementById("maxRadius");
let output_maxRadius = document.getElementById("maxRadiusValue");
output_maxRadius.innerHTML = slider_maxRadius.value; // Display the default slider value

slider_maxRadius.oninput = function() {
    output_maxRadius.innerHTML = this.value;
    maxRadius = this.valueAsNumber;
    slider_minRadius.max = this.valueAsNumber;
    this.min = slider_minRadius.valueAsNumber;
    maxRadiusChange();
}

// min radius:
let slider_minRadius = document.getElementById("minRadius");
let output_minRadius = document.getElementById("minRadiusValue");
output_minRadius.innerHTML = slider_minRadius.value; // Display the default slider value

slider_minRadius.oninput = function() {
    output_minRadius.innerHTML = this.value;
    minRadius = this.valueAsNumber;
    this.max = slider_maxRadius.valueAsNumber;
    slider_maxRadius.min = this.valueAsNumber;
    maxRadiusChange();
}
slider_minRadius.max = slider_maxRadius.valueAsNumber;

// interactive radius:
let slider_interactiveRadius = document.getElementById("interactiveRadius");
let output_interactiveRadius = document.getElementById("interactiveRadiusValue");
output_interactiveRadius.innerHTML = slider_interactiveRadius.value; // Display the default slider value

slider_interactiveRadius.oninput = function() {
    output_interactiveRadius.innerHTML = this.value;
    interactiveRadius = this.valueAsNumber;
    mouse.y = interactiveRadius + 40;
    // init();
}

// opacity:
let slider_opacity = document.getElementById("opacity");
let output_opacity = document.getElementById("opacityValue");
output_opacity.innerHTML = slider_opacity.value; // Display the default slider value

slider_opacity.oninput = function() {
    output_opacity.innerHTML = this.value;
    opacity = this.valueAsNumber;
}

// increase speed:
let slider_increaseSpeed = document.getElementById("increaseSpeed");
let output_increaseSpeed = document.getElementById("increaseSpeedValue");
output_increaseSpeed.innerHTML = slider_increaseSpeed.value; // Display the default slider value

slider_increaseSpeed.oninput = function() {
    output_increaseSpeed.innerHTML = this.value;
    increaseSpeed = this.valueAsNumber;
    slider_increaseSpeed.max = slider_maxRadius.valueAsNumber;
    // init();
}
slider_increaseSpeed.max = slider_maxRadius.valueAsNumber;

// decrease speed:
let slider_decreaseSpeed = document.getElementById("decreaseSpeed");
let output_decreaseSpeed = document.getElementById("decreaseSpeedValue");
output_decreaseSpeed.innerHTML = slider_decreaseSpeed.value; // Display the default slider value

slider_decreaseSpeed.oninput = function() {
    output_decreaseSpeed.innerHTML = this.value;
    decreaseSpeed = this.valueAsNumber;
    // init();
}

// xSpeed:
let slider_xSpeed = document.getElementById("xSpeed");
let output_xSpeed = document.getElementById("xSpeedValue");
output_xSpeed.innerHTML = slider_xSpeed.value; // Display the default slider value

slider_xSpeed.oninput = function() {
    output_xSpeed.innerHTML = this.value;
    xSpeed = this.valueAsNumber;
    xSpeedChange();
}

// ySpeed:
let slider_ySpeed = document.getElementById("ySpeed");
let output_ySpeed = document.getElementById("ySpeedValue");
output_ySpeed.innerHTML = slider_ySpeed.value; // Display the default slider value

slider_ySpeed.oninput = function() {
    output_ySpeed.innerHTML = this.value;
    ySpeed = this.valueAsNumber;
    ySpeedChange();
}

// VARIABLES:
let density = slider_density.valueAsNumber;
let initialRadius = 0;
let maxRadius = slider_maxRadius.valueAsNumber;
let minRadius = slider_minRadius.valueAsNumber;
let interactiveRadius = slider_interactiveRadius.valueAsNumber;
let opacity = slider_opacity.valueAsNumber;
let increaseSpeed = slider_increaseSpeed.valueAsNumber;
let decreaseSpeed = slider_decreaseSpeed.valueAsNumber;
let xSpeed = slider_xSpeed.valueAsNumber;
let ySpeed = slider_ySpeed.valueAsNumber;

var ongoingTouches = [];

function handleStart(evt) {
    evt.preventDefault();
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);

            mouse.x = ongoingTouches[idx].pageX;
            mouse.y = ongoingTouches[idx].pageY;

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        }

        if (colorPickerContainer.style.visibility === 'visible'){
            hideColorPicker();
            colorPickerIsToggled = true;
        };
    };

};

function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);

            mouse.x = ongoingTouches[idx].pageX;
            mouse.y = ongoingTouches[idx].pageY;

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record

            if (rightIsToggled) {
                right.style.width = '0px';
            };
        };
    };
};

function handleEnd(evt) {
    evt.preventDefault();
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);

            mouse.x = -250;
            mouse.y = -250;

            ongoingTouches.splice(idx, 1);  // remove it; we're done


            // this is designed for mobile devices, with vertical narrow screens:
            if (rightIsToggled || colorPickerIsToggled) {
                centerSample();
                if (colorPickerIsToggled) {
                    showColorPicker();
                } else showRight();
            };
        };
    };
};

function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    };
};

function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
};

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        };
    };
    return -1;    // not found
};

canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);

let mouseDown = false;

canvas.addEventListener("mousedown", mousedownAction);

canvas.addEventListener("mousemove" , mousemoveAction);

canvas.addEventListener("mouseup", mouseupAction);

let rightFullWidth = 200;

window.addEventListener("resize", resize);


let circleArray = [];
let savesArray = [];
init();
animate();


// SAVE
let loadElement = document.createElement('div');
let loads = document.getElementsByClassName('load-element');
let name = "";
let loadScreenOpened = false;


let btnSave = document.getElementById("btn-save");

btnSave.addEventListener("click", save);

// LOAD

let btnLoad = document.getElementById("btn-load");
let loadScreen = document.getElementById("load-screen");
let loadScreenHeight = '0px';


btnLoad.addEventListener("click", showLoadScreen);
btnLoad.addEventListener("click", saveTemp);

let closeLoadScreenBtn = document.getElementById('close-load-screen-btn');
closeLoadScreenBtn.addEventListener("click", closeLoadScreen);

let temp = {};















// FUNCTIONS:

function mousemoveAction(event) {
    if (mouseDown) {
        mouse.x = event.x;
        mouse.y = event.y;
    } else if (!rightIsToggled && !colorPickerIsToggled) {
        mouse.x = -250;
        mouse.y = -250;
    };
};

function mouseupAction() {
    mouseDown = false;

    if (canvas.width <= 500) {
        if (colorPickerIsToggled) {showColorPicker()}
        else if (rightIsToggled) {showRight()}
        else {
            mouse.x = -250;
            mouse.y = -250;
        };
    }
    else {
        if (colorPickerIsToggled || rightIsToggled) {
            if (colorPickerIsToggled) {showColorPicker()};
            if (rightIsToggled) {showRight()};
        } else {
            if (!rightIsToggled && !colorPickerIsToggled) {
                mouse.x = -250;
                mouse.y = -250;
            };
        };
    };
};

function showRight() {
    right.style.width = '200px';
    rightIsToggled = true;
    centerSample();
    centerColorPicker();
};

function hideRight() {
    right.style.width = '0px';
    rightIsToggled = false;
    centerColorPicker();
    if (colorPickerIsToggled) {
        centerSample();
    } else {
        mouse.x = -250;
        mouse.y = -250;
    };
};

function centerSample() {
    if (rightIsToggled) {
        mouse.x = (canvas.width - rightFullWidth) / 2;
        mouse.y = interactiveRadius + 40;
    } else {
        mouse.x = canvas.width / 2;
        mouse.y = interactiveRadius + 40;
    };
};

function centerColorPicker() {
    if (rightIsToggled){
        colorPickerContainer.style.left = (canvas.width - rightFullWidth) / 2 - 150 + 'px';
    } else {
        colorPickerContainer.style.left = canvas.width / 2 - 150 + 'px';
    };
};

function Circle(x, y, dx, dy, r, colorIndex, radiusFactor, dxFactor, dyFactor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.radiusFactor = radiusFactor;
    this.maxRadius = maxRadius - radiusFactor * (maxRadius - minRadius);
    this.dxFactor = dxFactor;
    this.dyFactor = dyFactor;

    this.draw = function(context) {
        context.globalAlpha = opacity;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        // context.strokeStyle = "white";
        // context.stroke();
        context.fillStyle = colorArray[colorIndex];
        context.fill();

        this.update();
    };

    this.update = function() {
        if (this.x + this.r >= canvas.width || this.x - this.r <= 0) {this.dx = -this.dx};
        this.x += this.dx;

        if (this.y + this.r >= canvas.height || this.y - this.r <= 0) {this.dy = -this.dy};
        this.y += this.dy;

        // interactivity:
        // Pithagoras to calculate distance between pointer and Circle:
        if (Math.hypot((mouse.x - this.x),(mouse.y - this.y)) <= interactiveRadius) {
            if (this.r + increaseSpeed > this.maxRadius) {this.r = this.maxRadius}
            else {this.r += increaseSpeed};
        } else if (this.r >= initialRadius + decreaseSpeed) {
            this.r -= decreaseSpeed;
        } else if (this.r < decreaseSpeed) {
            this.r = initialRadius;
        };
    };
};

function densityIncrease() {
    for (let i = circleArray.length; i < density; i++) {
        let r = initialRadius;
        let x = Math.random() * (canvas.width - 2 * r) + r;
        let y = Math.random() * (canvas.height - 2 * r) + r;
        let dxFactor = Math.random() - 0.5;
        let dyFactor = Math.random() - 0.5;
        let dx = dxFactor * xSpeed;
        let dy = dyFactor * ySpeed;
        let colorIndex = Math.floor(Math.random() * (colorArray.length) + 1);
        let radiusFactor = Math.random();
        circleArray.push(new Circle(x, y, dx, dy, r, colorIndex, radiusFactor, dxFactor, dyFactor));
    };
};

function densityDecrease() {
    circleArray.splice(density);
};

function init() {
    // circleArray = [];
    if (circleArray.length < density) {
        densityIncrease();
    } else
    if (circleArray.length > density) {
        densityDecrease();
    };
};

function maxRadiusChange() {
    for (let i = 0; i < density; i++) {
        circleArray[i].maxRadius = maxRadius - circleArray[i].radiusFactor * (maxRadius - minRadius);
    };
};

function xSpeedChange() {
    for (let i = 0; i < density; i++) {
        circleArray[i].dx = circleArray[i].dxFactor * xSpeed;
    };
};
function ySpeedChange() {
    for (let i = 0; i < density; i++) {
        circleArray[i].dy = circleArray[i].dyFactor * ySpeed;
    };
};

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < circleArray.length; i++) {
        circleArray[i].draw(ctx);
    };
};

function save() {
    name = prompt("Choose a name");

    let newSave = {
        name: "",
        valuesArray: [
            density,
            initialRadius,
            maxRadius,
            minRadius,
            interactiveRadius,
            opacity,
            increaseSpeed,
            decreaseSpeed,
            xSpeed,
            ySpeed,
            colorArray[0],
            colorArray[1],
            colorArray[2],
            colorArray[3]
        ]
    };

    if (name === "") {
        alert("The name was empty. Try again.")
    } else if (name != null) {
        newSave.name = name;
        savesArray.push(newSave);
        let loadsNumber = savesArray.length - 1;
        loadElement = document.createElement('div');
        loadElement.classList.add('load-element');
        loadElement.id = 'load' + (savesArray.length - 1);
        loadScreen.appendChild(loadElement);
        loads = document.getElementsByClassName('load-element');
        loads[loadsNumber].innerHTML = newSave.name;
        loadScreenHeightAuto();
        if (loadScreenOpened === false) {
            closeLoadScreen();
        }
    }
};

function load() {
    id = this.id;
    idNumber = id.slice(4);

    density = savesArray[idNumber].valuesArray[0];
    initialRadius = savesArray[idNumber].valuesArray[1];
    maxRadius = savesArray[idNumber].valuesArray[2];
    minRadius = savesArray[idNumber].valuesArray[3];
    interactiveRadius = savesArray[idNumber].valuesArray[4];
    opacity = savesArray[idNumber].valuesArray[5];
    increaseSpeed = savesArray[idNumber].valuesArray[6];
    decreaseSpeed = savesArray[idNumber].valuesArray[7];
    xSpeed = savesArray[idNumber].valuesArray[8];
    ySpeed = savesArray[idNumber].valuesArray[9];
    canvas.style.background = savesArray[idNumber].valuesArray[10];
    colorArray[0] = savesArray[idNumber].valuesArray[10];
    colorArray[1] = savesArray[idNumber].valuesArray[11];
    colorArray[2] = savesArray[idNumber].valuesArray[12];
    colorArray[3] = savesArray[idNumber].valuesArray[13];

    output_density.innerHTML = density;
    slider_density.value = density;
    // output_initialRadius.innerHTML = initialRadius;
    // slider_initialRadius.value = initialRadius;
    output_maxRadius.innerHTML = maxRadius;
    slider_maxRadius.value = maxRadius;
    output_minRadius.innerHTML = minRadius;
    slider_minRadius.value = minRadius;
    output_interactiveRadius.innerHTML = interactiveRadius;
    slider_interactiveRadius.value = interactiveRadius;
    output_opacity.innerHTML = opacity;
    slider_opacity.value = opacity;
    output_increaseSpeed.innerHTML = increaseSpeed;
    slider_increaseSpeed.value = increaseSpeed;
    output_decreaseSpeed.innerHTML = decreaseSpeed;
    slider_decreaseSpeed.value = decreaseSpeed;
    output_xSpeed.innerHTML = xSpeed;
    slider_xSpeed.value = xSpeed;
    output_ySpeed.innerHTML = ySpeed;
    slider_ySpeed.value = ySpeed;

    updateColorButtons();
    if (selectedColorPicker > -1) {
        colorWheel.hex = colorArray[selectedColorPicker];
    };

    circleArray = [];
    init();

};

function loadScreenHeightAuto() {
    loadScreenHeight = 55 * savesArray.length + 35 + 'px';
    loadScreen.style.height = loadScreenHeight;
    loadScreenHeight = 55 * savesArray.length + 35 + 60 + 'px';
};

function showLoadScreen() {
    if (savesArray.length === 0) {
        alert("There's no saved profiles");
    } else if (loadScreen.style.bottom !== '0px') {
        loadScreenHeightAuto();
        openLoadScreen();
        for (let i = 0; i < loads.length; i++) {
            loads[i].addEventListener('click', showLoadScreen);
            loads[i].addEventListener('mouseover', load);
            loads[i].addEventListener('mouseout', loadTemp);
            loads[i].addEventListener('click', load);
        };
    } else {
        for (let i = 0; i < loads.length; i++) {
            loads[i].removeEventListener('mouseover', load);
            loads[i].removeEventListener('mouseout', loadTemp);
        };
        closeLoadScreen();
    };
};

function closeLoadScreen() {
    loadScreen.style.bottom = '-' + loadScreenHeight;
    loadScreenOpened = false;
};
function openLoadScreen() {
    loadScreen.style.bottom = '0px';
    loadScreenOpened = true;
};
function toggleLoadScreen() {
    if (loadScreenOpened) {
        loadScreen.style.bottom = '-' + loadScreenHeight;
        loadScreenOpened = false;
    } else {
        loadScreen.style.bottom = '0px';
        loadScreenOpened = true;
    }
};

function saveTemp() {
    temp = {
        name: "temp",
        valuesArray: [
            density,
            initialRadius,
            maxRadius,
            minRadius,
            interactiveRadius,
            opacity,
            increaseSpeed,
            decreaseSpeed,
            xSpeed,
            ySpeed,
            colorArray[0],
            colorArray[1],
            colorArray[2],
            colorArray[3]
        ]
    };
};

function loadTemp() {
    density = temp.valuesArray[0];
    initialRadius = temp.valuesArray[1];
    maxRadius = temp.valuesArray[2];
    minRadius = temp.valuesArray[3];
    interactiveRadius = temp.valuesArray[4];
    opacity = temp.valuesArray[5];
    increaseSpeed = temp.valuesArray[6];
    decreaseSpeed = temp.valuesArray[7];
    xSpeed = temp.valuesArray[8];
    ySpeed = temp.valuesArray[9];
    canvas.style.background = temp.valuesArray[10];
    colorArray[0] = temp.valuesArray[10];
    colorArray[1] = temp.valuesArray[11];
    colorArray[2] = temp.valuesArray[12];
    colorArray[3] = temp.valuesArray[13];

    output_density.innerHTML = density;
    slider_density.value = density;
    // output_initialRadius.innerHTML = initialRadius;
    // slider_initialRadius.value = initialRadius;
    output_maxRadius.innerHTML = maxRadius;
    slider_maxRadius.value = maxRadius;
    output_minRadius.innerHTML = minRadius;
    slider_minRadius.value = minRadius;
    output_interactiveRadius.innerHTML = interactiveRadius;
    slider_interactiveRadius.value = interactiveRadius;
    output_opacity.innerHTML = opacity;
    slider_opacity.value = opacity;
    output_increaseSpeed.innerHTML = increaseSpeed;
    slider_increaseSpeed.value = increaseSpeed;
    output_decreaseSpeed.innerHTML = decreaseSpeed;
    slider_decreaseSpeed.value = decreaseSpeed;
    output_xSpeed.innerHTML = xSpeed;
    slider_xSpeed.value = xSpeed;
    output_ySpeed.innerHTML = ySpeed;
    slider_ySpeed.value = ySpeed;

    updateColorButtons();
    circleArray = [];
    init();
};

function toggleRight(){
    if (!rightIsToggled) {
        showRight();
        if (canvas.width <= 500) {
            hideColorPicker();
        };
    } else {
        hideRight();
    };
};

function menuToggle() {
    if (rightIsToggled) {
        hideRight();
        hideColorPicker();
        mouse.x = -250;
        mouse.y = -250;
    } else {
        showRight();
        if (canvas.width <= 500) {
            hideColorPicker();
        }
    };
};

function toggleSpacebar(e) {
    if (e.keyCode === 32) {
        toggleRight();
    };
};

function toggleC(e) {
    if (e.keyCode === 67) {
        toggleColorPicker();
    };
};

function focus(i) {
    colorBtn[i].classList.add('focus');
    focusedColorBtn = document.querySelector('.focus');
}

function unfocus() {
    for (let i = 0; i < colorBtn.length; i++) {
        colorBtn[i].classList.remove('focus');
    };
};

function showColorPicker() {
        if (canvas.width <= 500) {
            hideRight();
        };
        clearTimeout (visibilityHiddenTimout);
        centerColorPicker();
        centerSample();
        colorPickerContainer.style.visibility = 'visible';
        colorPickerContainer.style.opacity = 1;
        colorPickerIsToggled = true;
        focus(selectedColorPicker);
};

function hideColorPicker() {
    colorPickerContainer.style.opacity = 0;
    visibilityHiddenTimout = setTimeout(delayVisibilityHidden, 220);
    colorPickerIsToggled = false;
    if (!rightIsToggled) {
        mouse.x = -250;
        mouse.y = -250;
    };

    function delayVisibilityHidden() {
        colorPickerContainer.style.visibility = 'hidden';
    };
};

function toggleColorPicker() {
    if (colorPickerIsToggled) {
        hideColorPicker();
    } else {showColorPicker()};
};

function updateColorButtons() {
    canvas.style.background = colorArray[0];
    colorBG.style.background = colorArray[0];
    colorA.style.background = colorArray[1];
    colorB.style.background = colorArray[2];
    colorC.style.background = colorArray[3];
};

function mousedownAction(event) {
    mouseDown = true;
    if (rightIsToggled) {
        hideRight();
        rightIsToggled = true; // so it comes back on mouseup.
    };
    if (colorPickerIsToggled) {
        hideColorPicker();
        colorPickerIsToggled = true; // so it comes back on mouseup.
    };
    mouse.x = event.x;
    mouse.y = event.y;
};

function rightWidth() {
    return right.getBoundingClientRect().width;
};

function resize(){
    canvas.width = left.getBoundingClientRect().width;
    canvas.height = row.getBoundingClientRect().height;
    if (rightIsToggled || colorPickerIsToggled) {
        centerSample();
        centerColorPicker();
    };
    if (canvas.width <= 500 && rightIsToggled) {
        if (colorPickerIsToggled) {
            hideColorPicker();
        };
    };
    // init();
};
