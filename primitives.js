//for storing buffer objs and individual shape data (rot, pos, scale)
class shape {
  constructor(bvbo, bnbo, bibo, bnorm, btex, len, vertexCount, id, color1 = null, color2 = null) {
    this.vbo = bvbo;
    this.nbo = bnbo;
    this.ibo = bibo;
    this.normalBuffer = bnorm;
    this.texCoordBuffer = btex;
    this.length = len;
    this.vertexCount = vertexCount;
    this.id = id;
    this.pickColor = idToColor(id);
    this.color1 = color1;
    this.color2 = color2;
    this.material = {
      ambient: 0.3,
      diffuse: 0.8,
      specular: 1.0,
      shininess: 32.0
    };
    // Texture properties
    this.useTexture = false;
    this.texture = null;
    this.textureUrl = null;
    this.useBump = false;
    this.bumpTexture = null;
    this.bumpUrl = null;
    this.bumpStrength = 1.0;
  }
  posX = 0;
  posY = 0;
  posZ = 0;
  rotX = 0;
  rotY = 0;
  rotZ = 0;
  scaX = 1;
  scaY = 1;
  scaZ = 1;
  parent = null;
  children = [];
  nodeTransformMatrix = mat4Identity();

  canMove = false;
  timeDiff = 0.0;
  rotXSpeed = 0;
  rotYSpeed= 0;
  rotZSpeed = 0;

  color1;
  color2;

  getRotationMatrix() {
    const cx = Math.cos(this.rotY), sx = Math.sin(this.rotY);
    const cy = Math.cos(this.rotX), sy = Math.sin(this.rotX);
    const cz = Math.cos(this.rotZ), sz = Math.sin(this.rotZ);

    const rotXMat = [
      1, 0, 0, 0,
      0, cy, sy, 0,
      0, -sy, cy, 0,
      0, 0, 0, 1
    ];

    const rotYMat = [
      cx, 0, -sx, 0,
      0, 1, 0, 0,
      sx, 0, cx, 0,
      0, 0, 0, 1
    ];

    const rotZMat = [
      cz, sz, 0, 0,
      -sz, cz, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

    return multiplyMat4(multiplyMat4(rotYMat, rotXMat), rotZMat);
  }
  
  getTranslationMatrix() {
    return mat4Translate(mat4Identity(), [this.posX, this.posY, this.posZ]);
  }
  
  getScaleVector() {
    return [this.scaX, this.scaY, this.scaZ];
  }

  getFullTransformMatrix(canMove = true, timeDiff = 0.0) {
    this.canMove = canMove;
    this.timeDiff = timeDiff;

    this.nodeTransformMatrix = this.parent
      ? multiplyMat4(this.parent.getFullTransformMatrix(), this.getLocalTransformMatrix())
      : this.getLocalTransformMatrix();

    return this.nodeTransformMatrix;
  }
  
  getLocalTransformMatrix() {
    let rotCoeff = 0.1;
    if(this.canMove){
      this.rotX += this.rotXSpeed * (this.timeDiff * rotCoeff);
      this.rotY += this.rotYSpeed * (this.timeDiff * rotCoeff);
      this.rotZ += this.rotZSpeed * (this.timeDiff * rotCoeff);
    }

    const T = this.getTranslationMatrix();
    const R = this.getRotationMatrix();
    const S = mat4Scale(mat4Identity(), this.getScaleVector());

    return multiplyMat4(multiplyMat4(T, R), S);
  }
  
  setColors(c1, c2) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    this.color1 = c1;
    this.color2 = c2;
    let colors = interpolateColors(this.vertexCount, 0, c1, c2);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
  }
}

function idToColor(id) {
  return [
    (id & 0xFF) / 255,
    ((id >> 8) & 0xFF) / 255,
    ((id >> 16) & 0xFF) / 255
  ];
}

function colorToId([r, g, b]) {
  return r + (g << 8) + (b << 16);
}

// Cube
const cubePositions = new Float32Array([
  -1, -1, -1,  // 0
  1, -1, -1,  // 1
  1, 1, -1,  // 2
  -1, 1, -1,  // 3
  -1, -1, 1,  // 4
  1, -1, 1,  // 5
  1, 1, 1,  // 6
  -1, 1, 1   // 7
]);

const cubeIndices = new Uint16Array([
  4, 5, 6, 4, 6, 7,
  1, 0, 3, 1, 3, 2,
  3, 7, 6, 3, 6, 2,
  0, 1, 5, 0, 5, 4,
  1, 2, 6, 1, 6, 5,
  0, 4, 7, 0, 7, 3,
]);

const tetrahedronPositions = new Float32Array([
  1, 1, 1,
  -1, -1, 1,
  -1, 1, -1,
  1, -1, -1
]);

const tetrahedronIndices = new Uint16Array([
  0, 1, 2,
  0, 3, 1,
  0, 2, 3,
  1, 3, 2
]);

function interpolateColors(count = 1, minBrightness = 0.1, color1 = null, color2 = null) {
  const colors = [];
  
  let [r1, g1, b1] = color1 ?? randomBrightColor(minBrightness);
  let [r2, g2, b2] = color2 ?? randomBrightColor(minBrightness);

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const r = r1 + t * (r2 - r1);
    const g = g1 + t * (g2 - g1);
    const b = b1 + t * (b2 - b1);
    colors.push(r, g, b);
  }

  return new Float32Array(colors);
}

function randomBrightColor(minBrightness = 0.1) {
  let r, g, b;
  do {
    r = Math.random();
    g = Math.random();
    b = Math.random();
  } while ((r + g + b) / 3 < minBrightness);
  return [r, g, b];
}

function scale(array, factor = 1) {
  return array.map(x => x * factor);
}

function createCube(radius = 1) {
  const positions = scale(cubePositions, radius);
  const indices = cubeIndices;
  const colors = interpolateColors(positions.length / 3);
  const normals = computeNormals(positions, indices);
  
  // Generate texture coordinates for cube (unwrapped)
  const texCoords = new Float32Array([
    0, 0,  // 0
    1, 0,  // 1
    1, 1,  // 2
    0, 1,  // 3
    0, 0,  // 4
    1, 0,  // 5
    1, 1,  // 6
    0, 1   // 7
  ]);
  
  return { positions, colors, indices, normals, texCoords };
}

function createTetrahedron(radius = 1) {
  const positions = scale(tetrahedronPositions, radius);
  const indices = tetrahedronIndices;
  const colors = interpolateColors(positions.length / 3);
  const normals = computeNormals(positions, indices);
  
  // Simple planar texture coordinates
  const texCoords = new Float32Array([
    0.5, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    0.5, 0.5
  ]);
  
  return { positions, colors, indices, normals, texCoords };
}

function createCylinder(radius = 1, height = 2, segments = 32) {
  const positions = [];
  const indices = [];
  const texCoords = [];
  
  // Side vertices
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    const u = i / segments;
    
    positions.push(x, height / 2, z);
    texCoords.push(u, 1);
    
    positions.push(x, -height / 2, z);
    texCoords.push(u, 0);
  }
  
  const topCenterIndex = positions.length / 3;
  positions.push(0, height / 2, 0);
  texCoords.push(0.5, 0.5);
  
  const bottomCenterIndex = positions.length / 3;
  positions.push(0, -height / 2, 0);
  texCoords.push(0.5, 0.5);
  
  // Side faces
  for (let i = 0; i < segments; i++) {
    let p1 = i * 2, p2 = p1 + 1;
    let p3 = ((i + 1) % segments) * 2, p4 = p3 + 1;
    indices.push(p1, p3, p2);
    indices.push(p3, p4, p2);
  }
  
  // Top cap
  for (let i = 0; i < segments; i++) {
    let p1 = ((i + 1) % segments) * 2;
    let p2 = i * 2;
    indices.push(topCenterIndex, p1, p2);
  }
  
  // Bottom cap
  for (let i = 0; i < segments; i++) {
    let p1 = i * 2 + 1;
    let p2 = ((i + 1) % segments) * 2 + 1;
    indices.push(bottomCenterIndex, p1, p2);
  }
  
  const positionsF = new Float32Array(positions);
  const indicesF = new Uint16Array(indices);
  const texCoordsF = new Float32Array(texCoords);
  const colors = interpolateColors(positions.length / 3);
  const normals = computeNormals(positionsF, indicesF);
  
  return { positions: positionsF, colors, indices: indicesF, normals, texCoords: texCoordsF };
}

function createSphere(radius = 1, latBands = 24, longBands = 24) {
  const positions = [];
  const indices = [];
  const texCoords = [];
  
  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    
    for (let lon = 0; lon <= longBands; lon++) {
      const phi = (lon * 2 * Math.PI) / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      
      const x = radius * cosPhi * sinTheta;
      const y = radius * cosTheta;
      const z = radius * sinPhi * sinTheta;
      
      positions.push(x, y, z);
      
      // Spherical UV mapping
      const u = lon / longBands;
      const v = lat / latBands;
      texCoords.push(u, v);
    }
  }
  
  for (let lat = 0; lat < latBands; lat++) {
    for (let lon = 0; lon < longBands; lon++) {
      const first = lat * (longBands + 1) + lon;
      const second = first + longBands + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }
  
  const positionsF = new Float32Array(positions);
  const indicesF = new Uint16Array(indices);
  const texCoordsF = new Float32Array(texCoords);
  const colors = interpolateColors(positions.length / 3);
  const normals = computeNormals(positionsF, indicesF);
  
  return { positions: positionsF, colors, indices: indicesF, normals, texCoords: texCoordsF };
}

function createCone(radius = 1, height = 2, segments = 32) {
  const positions = [];
  const indices = [];
  const texCoords = [];
  
  const apexIndex = 0;
  positions.push(0, height / 2, 0);
  texCoords.push(0.5, 1.0);
  
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    const u = (Math.cos(theta) + 1) / 2;
    const v = (Math.sin(theta) + 1) / 2;
    
    positions.push(x, -height / 2, z);
    texCoords.push(u, 0);
  }
  
  const baseCenterIndex = positions.length / 3;
  positions.push(0, -height / 2, 0);
  texCoords.push(0.5, 0.5);
  
  // Side faces
  for (let i = 1; i <= segments; i++) {
    const next = i % segments + 1;
    indices.push(apexIndex, i, next);
  }
  
  // Base
  for (let i = 1; i <= segments; i++) {
    const next = i % segments + 1;
    indices.push(baseCenterIndex, next, i);
  }
  
  const positionsF = new Float32Array(positions);
  const indicesF = new Uint16Array(indices);
  const texCoordsF = new Float32Array(texCoords);
  const colors = interpolateColors(positions.length / 3);
  const normals = computeNormals(positionsF, indicesF);
  
  return { positions: positionsF, colors, indices: indicesF, normals, texCoords: texCoordsF };
}

function createTorus(majorRadius = 1, minorRadius = 0.3, majorSegments = 32, minorSegments = 16) {
  const positions = [];
  const indices = [];
  const texCoords = [];
  
  for (let i = 0; i <= majorSegments; i++) {
    const theta = (i / majorSegments) * 2 * Math.PI;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    
    for (let j = 0; j <= minorSegments; j++) {
      const phi = (j / minorSegments) * 2 * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      
      const x = (majorRadius + minorRadius * cosPhi) * cosTheta;
      const y = minorRadius * sinPhi;
      const z = (majorRadius + minorRadius * cosPhi) * sinTheta;
      
      positions.push(x, y, z);
      
      // Torus UV mapping
      const u = i / majorSegments;
      const v = j / minorSegments;
      texCoords.push(u, v);
    }
  }
  
  for (let i = 0; i < majorSegments; i++) {
    for (let j = 0; j < minorSegments; j++) {
      const first = i * (minorSegments + 1) + j;
      const second = first + minorSegments + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }
  
  const positionsF = new Float32Array(positions);
  const indicesF = new Uint16Array(indices);
  const texCoordsF = new Float32Array(texCoords);
  const colors = interpolateColors(positions.length / 3);
  const normals = computeNormals(positionsF, indicesF);
  
  return { positions: positionsF, colors, indices: indicesF, normals, texCoords: texCoordsF };
}

function computeNormals(positions, indices) {
  const normals = new Float32Array(positions.length);
  
  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i] * 3;
    const i1 = indices[i + 1] * 3;
    const i2 = indices[i + 2] * 3;

    const v0 = [positions[i0], positions[i0 + 1], positions[i0 + 2]];
    const v1 = [positions[i1], positions[i1 + 1], positions[i1 + 2]];
    const v2 = [positions[i2], positions[i2 + 1], positions[i2 + 2]];

    const edge1 = [
      v1[0] - v0[0],
      v1[1] - v0[1],
      v1[2] - v0[2]
    ];
    const edge2 = [
      v2[0] - v0[0],
      v2[1] - v0[1],
      v2[2] - v0[2]
    ];

    const nx = edge1[1] * edge2[2] - edge1[2] * edge2[1];
    const ny = edge1[2] * edge2[0] - edge1[0] * edge2[2];
    const nz = edge1[0] * edge2[1] - edge1[1] * edge2[0];

    normals[i0] += nx; normals[i0 + 1] += ny; normals[i0 + 2] += nz;
    normals[i1] += nx; normals[i1 + 1] += ny; normals[i1 + 2] += nz;
    normals[i2] += nx; normals[i2 + 1] += ny; normals[i2 + 2] += nz;
  }

  for (let i = 0; i < normals.length; i += 3) {
    const nx = normals[i];
    const ny = normals[i + 1];
    const nz = normals[i + 2];
    const len = Math.hypot(nx, ny, nz) || 1.0;
    normals[i] = nx / len;
    normals[i + 1] = ny / len;
    normals[i + 2] = nz / len;
  }

  return normals;
}