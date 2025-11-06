    // WebGL setup
    const canvas = document.getElementById("glcanvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL2 not supported");

    let vertEditor = document.getElementById("vertEditor");
    let fragEditor = document.getElementById("fragEditor");
    vertEditor.value = document.getElementById("vertex-shader").textContent;
    fragEditor.value = document.getElementById("fragment-shader").textContent;

canvas.addEventListener('mousedown', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const pickedId = pickObjectAt(mouseX, mouseY);

      selectedObject = findShapeById(pickedId, shapesGlobal);
      selectedObjectIndex = selectedObject ? selectedObject.id : null;
      console.log("Picked object:", selectedObject ? selectedObject.id : "none");

      if (selectedObject) {
        document.getElementById("primitive-insert").innerText = "Add Child";
        document.getElementById("shape-properties").style = "display:block;";
        setShapeHtmlProperties(selectedObject);
      }
      else {
        document.getElementById("primitive-insert").innerText = "Add New Shape";
        document.getElementById("shape-properties").style = "display:none;";
      }

      mouseDown = true; lastX = e.clientX; lastY = e.clientY;
    });
    canvas.addEventListener('mouseup', () => mouseDown = false);
    canvas.addEventListener('mousemove', e => {
      if (!mouseDown) return;
      if (!selectedObject) return;
      let dx = e.clientX - lastX;
      let dy = e.clientY - lastY;
      if (mode == "rotate") {
        selectedObject.rotY += dx * 0.01;
        selectedObject.rotX += dy * 0.01;
      }
      else if (mode == "translate") {
        let dxWorld = dx * 0.01;
        let dyWorld = -dy * 0.01;

        let parentMatrix = selectedObject.parent ? selectedObject.parent.getFullTransformMatrix() : mat4Identity();
        let invParent = mat4Inverse(parentMatrix);

        let deltaVec = [dxWorld, dyWorld, 0, 0];

        let localDelta = [
          invParent[0] * deltaVec[0] + invParent[4] * deltaVec[1] + invParent[8] * deltaVec[2],
          invParent[1] * deltaVec[0] + invParent[5] * deltaVec[1] + invParent[9] * deltaVec[2],
          invParent[2] * deltaVec[0] + invParent[6] * deltaVec[1] + invParent[10] * deltaVec[2],
        ];

        selectedObject.posX += localDelta[0];
        selectedObject.posY += localDelta[1];
        selectedObject.posZ += localDelta[2];
      }
      else if (mode == "scale") {
        const scaleDiff = 1 - dy * 0.01;

        selectedObject.scaX *= scaleDiff;
        selectedObject.scaY *= scaleDiff;
        selectedObject.scaZ *= scaleDiff;
      }
      lastX = e.clientX; lastY = e.clientY;
    });

    document.addEventListener('keydown', e => {
      const step = 0.2;
      switch (e.key) {
        case 'ArrowUp': camY -= step; break;
        case 'ArrowDown': camY += step; break;
        case 'ArrowLeft': camX += step; break;
        case 'ArrowRight': camX -= step; break;
        case 'w': camZ += step; break;
        case 's': camZ -= step; break;
      }
    });

    //shape properties input
    const rotXSpeed = document.getElementById('rot-x-speed');
    const rotYSpeed = document.getElementById('rot-y-speed');
    const rotZSpeed = document.getElementById('rot-z-speed');

    rotXSpeed.addEventListener('input', function() {
        let rotXSpeedVal = this.value;
        if(selectedObject) {
          selectedObject.rotXSpeed = rotXSpeedVal;
        }
    });
    rotYSpeed.addEventListener('input', function() {
        let rotYSpeedVal = this.value;
        if(selectedObject) {
          selectedObject.rotYSpeed = rotYSpeedVal;
        }
    });
    rotZSpeed.addEventListener('input', function() {
        let rotZSpeedVal = this.value;
        if(selectedObject) {
          selectedObject.rotZSpeed = rotZSpeedVal;
        }
    });
    
    const color1Input = document.getElementById('color-1');
    const color2Input = document.getElementById('color-2');
    color1Input.addEventListener('input', function() {
        let c1 = hexToRgbArray(this.value);
        let c2 = hexToRgbArray(color2Input.value);
        if(selectedObject) {
          selectedObject.setColors(c1, c2);
        }
    });
    
    color2Input.addEventListener('input', function() {
        let c2 = hexToRgbArray(this.value);
        let c1 = hexToRgbArray(color1Input.value);
        if(selectedObject) {
          selectedObject.setColors(c1, c2);
        }
    });

    // Material property inputs
    const ambientInput = document.getElementById('ambient');
    const diffuseInput = document.getElementById('diffuse');
    const specularInput = document.getElementById('specular');
    const shininessInput = document.getElementById('shininess');

    ambientInput.addEventListener('input', function() {
        let value = this.value / 100;
        document.getElementById('ambient-value').textContent = value.toFixed(2);
        if(selectedObject) {
          if(!selectedObject.material) {
            selectedObject.material = {ambient: 0.3, diffuse: 0.8, specular: 1.0, shininess: 32.0};
          }
          selectedObject.material.ambient = value;
        }
    });

    diffuseInput.addEventListener('input', function() {
        let value = this.value / 100;
        document.getElementById('diffuse-value').textContent = value.toFixed(2);
        if(selectedObject) {
          if(!selectedObject.material) {
            selectedObject.material = {ambient: 0.3, diffuse: 0.8, specular: 1.0, shininess: 32.0};
          }
          selectedObject.material.diffuse = value;
        }
    });

    specularInput.addEventListener('input', function() {
        let value = this.value / 100;
        document.getElementById('specular-value').textContent = value.toFixed(2);
        if(selectedObject) {
          if(!selectedObject.material) {
            selectedObject.material = {ambient: 0.3, diffuse: 0.8, specular: 1.0, shininess: 32.0};
          }
          selectedObject.material.specular = value;
        }
    });

    shininessInput.addEventListener('input', function() {
        let value = parseFloat(this.value);
        document.getElementById('shininess-value').textContent = value.toFixed(0);
        if(selectedObject) {
          if(!selectedObject.material) {
            selectedObject.material = {ambient: 0.3, diffuse: 0.8, specular: 1.0, shininess: 32.0};
          }
          selectedObject.material.shininess = value;
        }
    });