
// if (window.navigator.standalone == true) {
//     window.requestFullscreen();
// };

let canvas = document.querySelector('canvas');
let row = document.getElementById('row');
let left = document.getElementById('left');
let right = document.getElementById('right');

let ul = document.querySelector('ul');

let menuToggle = document.getElementById('menu-toggle');

let toggled = false;

let toggle = function(){
    if (right.style.width != "222px") {
        right.style.width = "222px";
        toggled = true;
    } else {
        right.style.width = "0px";
        toggled = false;
    };
};

menuToggle.addEventListener("click", toggle);

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

// canvas background color:
let parent = document.querySelector('#parent');
    // You can do what you want with the chosen color using two callbacks: onChange and onDone.
let picker = new Picker(parent);

picker.setOptions({
    popup: 'left',
    color: 'rgb(161, 103, 179)',
    editor: false,
    alpha: false,
    onOpen: function()
    {
        right.style.overflowY = 'visible';
    },
    onClose: function(color)
    {
        right.style.overflowY = 'scroll';
    },
    onChange: function(color) {
        canvas.style.background = color.rgbaString;
        parent.style.background = color.rgbaString;
    }
});

// circles colors:
let colorArray =
[
    "rgb(255, 0, 149)",
    "rgb(0, 0, 0)",
    "rgb(13, 197, 200)",
];

let colorA = document.querySelector('#colorA');
let pickerA = new Picker(colorA);

pickerA.setOptions
({
    popup: 'left',
    color: 'rgb(255, 0, 149)',
    editor: false,
    alpha: false,
    onOpen: function()
    {
        right.style.overflowY = 'visible';
    },
    onClose: function(color)
    {
        right.style.overflowY = 'scroll';
        colorArray[0] = color.rgbaString;
        init();
    },
    onChange: function(color)
    {
        colorA.style.background = color.rgbaString;
    }
});

let colorB = document.querySelector('#colorB');
let pickerB = new Picker(colorB);

pickerB.setOptions
({
    popup: 'left',
    color: 'rgb(13, 197, 200)',
    editor: false,
    alpha: false,
    onOpen: function()
    {
        right.style.overflowY = 'visible';
    },
    onClose: function(color)
    {
        right.style.overflowY = 'scroll';
        colorArray[1] = color.rgbaString;
        init();
    },
    onChange: function(color)
    {
        colorB.style.background = color.rgbaString;
    }
});

let colorC = document.querySelector('#colorC');
let pickerC = new Picker(colorC);

pickerC.setOptions
({
    popup: 'left',
    color: 'rgb(0, 0, 0)',
    editor: false,
    alpha: false,
    onOpen: function()
    {
        right.style.overflowY = 'visible';
    },
    onClose: function(color)
    {
        right.style.overflowY = 'scroll';
        colorArray[2] = color.rgbaString;
        init();
    },
    onChange: function(color)
    {
        colorC.style.background = color.rgbaString;
    }
});


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
    init();
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
    init();
}
slider_minRadius.max = slider_maxRadius.valueAsNumber;

// interactive radius:
let slider_interactiveRadius = document.getElementById("interactiveRadius");
let output_interactiveRadius = document.getElementById("interactiveRadiusValue");
output_interactiveRadius.innerHTML = slider_interactiveRadius.value; // Display the default slider value

slider_interactiveRadius.oninput = function() {
    output_interactiveRadius.innerHTML = this.value;
    interactiveRadius = this.valueAsNumber;
    init();
}

// opacity:
let slider_opacity = document.getElementById("opacity");
let output_opacity = document.getElementById("opacityValue");
output_opacity.innerHTML = slider_opacity.value; // Display the default slider value

slider_opacity.oninput = function() {
    output_opacity.innerHTML = this.value;
    opacity = this.valueAsNumber;
    init();
}

// increase speed:
let slider_increaseSpeed = document.getElementById("increaseSpeed");
let output_increaseSpeed = document.getElementById("increaseSpeedValue");
output_increaseSpeed.innerHTML = slider_increaseSpeed.value; // Display the default slider value

slider_increaseSpeed.oninput = function() {
    output_increaseSpeed.innerHTML = this.value;
    increaseSpeed = this.valueAsNumber;
    slider_increaseSpeed.max = slider_maxRadius.valueAsNumber;
    init();
}
slider_increaseSpeed.max = slider_maxRadius.valueAsNumber;

// decrease speed:
let slider_decreaseSpeed = document.getElementById("decreaseSpeed");
let output_decreaseSpeed = document.getElementById("decreaseSpeedValue");
output_decreaseSpeed.innerHTML = slider_decreaseSpeed.value; // Display the default slider value

slider_decreaseSpeed.oninput = function() {
    output_decreaseSpeed.innerHTML = this.value;
    decreaseSpeed = this.valueAsNumber;
    init();
}

// xSpeed:
let slider_xSpeed = document.getElementById("xSpeed");
let output_xSpeed = document.getElementById("xSpeedValue");
output_xSpeed.innerHTML = slider_xSpeed.value; // Display the default slider value

slider_xSpeed.oninput = function() {
    output_xSpeed.innerHTML = this.value;
    xSpeed = this.valueAsNumber;
    init();
}

// ySpeed:
let slider_ySpeed = document.getElementById("ySpeed");
let output_ySpeed = document.getElementById("ySpeedValue");
output_ySpeed.innerHTML = slider_ySpeed.value; // Display the default slider value

slider_ySpeed.oninput = function() {
    output_ySpeed.innerHTML = this.value;
    ySpeed = this.valueAsNumber;
    init();
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

let mousedown = false;

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
    }

  }

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

        if (toggled === true) {
            right.style.width = 0;
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

        if (toggled === true) {
            right.style.width = '222px';
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
    }
  }

//   function colorForTouch(touch) {
//     var r = touch.identifier % 16;
//     var g = Math.floor(touch.identifier / 3) % 16;
//     var b = Math.floor(touch.identifier / 7) % 16;
//     r = r.toString(16); // make it a hex digit
//     g = g.toString(16); // make it a hex digit
//     b = b.toString(16); // make it a hex digit
//     var color = "#" + r + g + b;
//     console.log("color for touch with identifier " + touch.identifier + " = " + color);
//     return color;
//   }

  function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
  }

  function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
      var id = ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }

canvas.addEventListener("mousemove" , (event) => {
    if (mousedown === true) {
        mouse.x = event.x;
        mouse.y = event.y;
        if (toggled === true) {
            right.style.width = 0;
        };
    } else {
        mouse.x = -250;
        mouse.y = -250;
    }
});

canvas.addEventListener("mouseup", () => {
    mousedown = false;
    mouse.x = -250;
    mouse.y = -250;
    if (toggled === true) {
        right.style.width = '222px';
    };
});

canvas.addEventListener("mousedown", () => {
    mousedown = true;
});

let resize = function(){
    canvas.width = left.getBoundingClientRect().width;
    canvas.height = row.getBoundingClientRect().height;
    init();
}

window.addEventListener("resize", resize);

function Circle(x, y, dx, dy, r, ga) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.maxRadius = maxRadius - Math.random() * (maxRadius - minRadius);
    this.ga = ga;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function(context) {
        context.globalAlpha = this.ga;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        // context.strokeStyle = "white";
        // context.stroke();
        context.fillStyle = this.color;
        context.fill();

        this.update();
    };

    this.update = function() {
        if (this.x + this.r >= canvas.width || this.x - this.r <= 0) {this.dx = -this.dx}
        this.x += this.dx;

        if (this.y + this.r >= canvas.height || this.y - this.r <= 0) {this.dy = -this.dy}
        this.y += this.dy;

        // interactivity:
        // Pithagoras to calculate distance between pointer and Circle:
        if (Math.hypot((mouse.x - this.x),(mouse.y - this.y)) <= interactiveRadius) {
            if (this.r + increaseSpeed > this.maxRadius) {this.r = this.maxRadius}
            else {this.r += increaseSpeed};
        } else if (this.r >= initialRadius + decreaseSpeed) {
            this.r -= decreaseSpeed;
            // if (this.ga > 0) {this.ga -= 0.1};
        } else if (this.r < decreaseSpeed) {
            this.r = 0
        };
    };
};

let circleArray = [];


function init() {
    circleArray = [];

    for (let i = 0; i < density; i++) {
        let r = initialRadius;
        let x = Math.random() * (canvas.width - 2 * r) + r;
        let y = Math.random() * (canvas.height - 2 * r) + r;
        let dx = (Math.random() - 0.5) * xSpeed;
        let dy = (Math.random() -0.5) * ySpeed;
        let ga = opacity;
        circleArray.push(new Circle(x, y, dx, dy, r, ga));
    };

    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
};

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < circleArray.length; i++) {
        circleArray[i].draw(ctx);
    };
};


init();
animate();



// first LOAD (for when there already are saved profiles)
let savesArray = [];


for (let i = 0; i < savesArray.length; i++) {
    loads[i].addEventListener('click', load);
};





// SAVE
let loadElement = document.createElement('div');
let loads = document.getElementsByClassName('load-element');
let name = "";
let loadScreenOpened = false;

let save = function() {
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
            ySpeed
        ]
    };

    if (name === "") {
        alert("The name was empty. Try again.")
    } else if (name != null) {
        newSave.name = name;
        savesArray.push(newSave);
        let loadsNumber = savesArray.length - 1;
        console.log(loadsNumber);
        loadElement = document.createElement('div');
        loadElement.classList.add('load-element');
        loadElement.id = 'load' + (savesArray.length - 1);
        loadScreen.appendChild(loadElement);
        loads = document.getElementsByClassName('load-element');
        loads[loadsNumber].addEventListener('click', load);

        loads[loadsNumber].innerHTML = newSave.name;

        if (loadScreenOpened == true) {
            loadScreen.style.height = 60 * savesArray.length + 30 + 'px';
        };
    }
};

let btnSave = document.getElementById("btn-save");

btnSave.addEventListener("click", save);

// LOAD

let load = function() {
    let id = this.id;

    console.log(id);
    id = id.slice(4);
    idNumber = id;

    console.log(idNumber);

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

    loadScreen.style.height = '0px';

    init();

};

let btnLoad = document.getElementById("btn-load");

let loadScreen = document.getElementById("load-screen");

let showLoadScreen = function() {

    if (savesArray.length == 0) {
        alert("There's no saved profiles");
    } else if (loadScreen.style.height != 60 * savesArray.length + 30 + 'px') {
        loadScreen.style.height = 60 * savesArray.length + 30 + 'px';
        loadScreenOpened = true;
    } else {
        loadScreen.style.height = '0px';
        loadScreenOpened = false;
    };
};

btnLoad.addEventListener("click", showLoadScreen);

let closeLoadScreen = document.getElementById('close-load-screen');
closeLoadScreen.addEventListener("click", showLoadScreen);

