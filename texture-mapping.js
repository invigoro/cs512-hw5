// SOURCE of original code for load texture: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
//(though I have modified it lol)
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//


    // Texture caches
    let textureCache = {};
let animatedTextures = [];

function loadTexture(gl, url, callback) {
      if (textureCache[url]) {
        if (callback) callback(textureCache[url]);
        return textureCache[url];
      }

      //possible todo: support other animated types i.e. video
      if (url.toLowerCase().endsWith('.gif')) {
        return loadAnimatedTexture(gl, url, callback);
      }

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([128, 128, 255, 255]);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        
        textureCache[url] = texture;
        if (callback) callback(texture);
      };
      image.onerror = () => {
        console.error('Failed to load texture:', url);
      };
      image.src = url;

      return texture;
    }

    function isPowerOf2(value) {
      return (value & (value - 1)) === 0;
    }

    //ONLY SUPPORT MP4S AT THE MOMENT
    function loadAnimatedTexture(gl, url, callback) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Create a video element
  const video = document.createElement('video');
  video.src = url.replace('.gif', '.mp4'); // try to use mp4 if available
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.play();

  const animation = { texture, video, url };
  animatedTextures.push(animation);
  textureCache[url] = texture;

  if (callback) callback(texture);
  return texture;
}

function updateAnimatedTextures() {
  for (let anim of animatedTextures) {
    const video = anim.video;
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      gl.bindTexture(gl.TEXTURE_2D, anim.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    }
  }
}
    
    const GHpref = 'https://raw.githubusercontent.com/invigoro/cs512-hw5/refs/heads/main/images/textures'; //i don't think this is dynamic. lel
    // Quick texture URLs
    const quickTextures = {
      'Dirt': `${GHpref}/dirt1.png`,
      'Fire': `${GHpref}/fire1.png`,
      'Stone Gray': `${GHpref}/stonegray1.png`,
      'Stone Red': `${GHpref}/stonered1.png`,
      'Farm Terrain': `${GHpref}/terrainfarms1.png`,
      'Farm Terrain Forested': `${GHpref}/terrainfarms2.png`,
      'Mars Terrain Craters':  `${GHpref}/terrainmars1.png`,
      'Mars Terrain Rocky':  `${GHpref}/terrainmars2.png`,
      'Rugged Terrain 1':  `${GHpref}/terrainrugged1.png`,
      'Rugged Terrain 2':  `${GHpref}/terrainrugged2.png`,
      'Islands Terrain':  `${GHpref}/terrainislands1.png`,
      'Water':  `${GHpref}/water1.png`,
      'Wood':  `${GHpref}/wood1.png`,
      'Metal': `${GHpref}/metal1.png`,
      'Austin Powers': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGxzNzV6bnZ0bWs3aW1tbjBvZGRwYWI3MnBzZ2QwcG5pMTY0c3BqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IykG0AM7911MrCM/giphy.gif'
    };



function loadQuickTexture(type) {
      if (!selectedObject) return;
      const url = quickTextures[type];
      document.getElementById("texture-url").value = url;
      loadTextureForSelected();
    }

    function loadTextureForSelected() {
      if (!selectedObject) return;
      const url = document.getElementById("texture-url").value;
      if (!url) return;
      
      selectedObject.textureUrl = url;
      loadTexture(gl, url, (tex) => {
        selectedObject.texture = tex;
        document.getElementById("texture-preview").src = url;
        document.getElementById("texture-preview").style.display = "block";
      });
    }

    function loadBumpForSelected() {
      if (!selectedObject) return;
      const url = document.getElementById("bump-url").value;
      if (!url) return;
      
      selectedObject.bumpUrl = url;
      loadTexture(gl, url, (tex) => {
        selectedObject.bumpTexture = tex;
        document.getElementById("bump-preview").src = url;
        document.getElementById("bump-preview").style.display = "block";
      });
    }


    function generateQuickTextureButtons() {
    let container = document.getElementById('quick-texture-buttons');
    let textureKeys = Object.keys(quickTextures);
    for(let i = 0; i < textureKeys.length; i++){
        container.innerHTML += `<button onclick="loadQuickTexture('${textureKeys[i]}')">${textureKeys[i]}</button>`
    }
    }
    generateQuickTextureButtons();