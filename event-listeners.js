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


    // Texture controls
    document.getElementById('use-texture').addEventListener('change', function() {
      if(selectedObject) {
        selectedObject.useTexture = this.checked;
        document.getElementById('texture-controls').style.display = this.checked ? 'block' : 'none';
      }
    });

    document.getElementById('load-texture').addEventListener('click', loadTextureForSelected);

    // Bump map controls
    document.getElementById('use-bump').addEventListener('change', function() {
      if(selectedObject) {
        selectedObject.useBump = this.checked;
        document.getElementById('bump-controls').style.display = this.checked ? 'block' : 'none';
      }
    });

    document.getElementById('load-bump').addEventListener('click', loadBumpForSelected);

    document.getElementById('bump-strength').addEventListener('input', function() {
      let value = this.value / 50;
      document.getElementById('bump-strength-value').textContent = value.toFixed(2);
      if(selectedObject) {
        selectedObject.bumpStrength = value;
      }
    });



    function rgbToHex(rgbArray) {
      const r = Math.round(rgbArray[0] * 255);
      const g = Math.round(rgbArray[1] * 255);
      const b = Math.round(rgbArray[2] * 255);
      const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    function hexToRgbArray(hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16) / 255.0,
        parseInt(result[2], 16) / 255.0, 
        parseInt(result[3], 16) / 255.0 
      ] : null;
    }

    
    function setShapeHtmlProperties(s) {
      document.getElementById("rot-x-speed").value = s.rotXSpeed;
      document.getElementById("rot-y-speed").value = s.rotYSpeed;
      document.getElementById("rot-z-speed").value = s.rotZSpeed;
      document.getElementById("color-1").value = rgbToHex(s.color1);
      document.getElementById("color-2").value = rgbToHex(s.color2);
      
      let mat = s.material || {ambient: 0.3, diffuse: 0.8, specular: 1.0, shininess: 32.0};
      document.getElementById("ambient").value = mat.ambient * 100;
      document.getElementById("ambient-value").textContent = mat.ambient.toFixed(2);
      document.getElementById("diffuse").value = mat.diffuse * 100;
      document.getElementById("diffuse-value").textContent = mat.diffuse.toFixed(2);
      document.getElementById("specular").value = mat.specular * 100;
      document.getElementById("specular-value").textContent = mat.specular.toFixed(2);
      document.getElementById("shininess").value = mat.shininess;
      document.getElementById("shininess-value").textContent = mat.shininess.toFixed(0);
      
      // Texture properties
      document.getElementById("use-texture").checked = s.useTexture || false;
      document.getElementById("texture-controls").style.display = s.useTexture ? "block" : "none";
      document.getElementById("texture-url").value = s.textureUrl || "";
      
      // Bump map properties
      document.getElementById("use-bump").checked = s.useBump || false;
      document.getElementById("bump-controls").style.display = s.useBump ? "block" : "none";
      document.getElementById("bump-url").value = s.bumpUrl || "";
      document.getElementById("bump-strength").value = (s.bumpStrength || 1.0) * 50;
      document.getElementById("bump-strength-value").textContent = (s.bumpStrength || 1.0).toFixed(2);
    }