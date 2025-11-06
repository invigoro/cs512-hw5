function drawPlanets() {
    //Main Planet, actually the sun lol
    let p1 = createShape("Sphere");
    p1.rotX = -.1;
    p1.scaX = 0.5;
    p1.scaY = 0.5;
    p1.scaZ = 0.5;
    p1.rotZSpeed = 5.0;
    p1.rotYSpeed = 1.0;
    p1.rotXSpeed = 1.0;
    p1.setColors([.98, .57, 0], [1, .9, 0]);
    p1.material.shininess = 128;
    p1.material.specular = 1.0;
    p1.material.diffuse = .50;
    p1.material.ambient = .65;

    //sunspots
    for(let i = 0; i < 6; i++) {
        let sp = createShape("Cylinder", p1);
        sp.scaY = 1;
        let width = 0.05 + (Math.random() * 0.2);
        sp.scaX = width;
        sp.scaZ = width;
        sp.setColors([.95, .54, 0], [.97, .87, 0]);
        sp.rotX = Math.random() * 2 * Math.PI;
        sp.rotY = Math.random() * 2 * Math.PI;
        sp.rotZ = Math.random() * 2 * Math.PI;
        sp.material.ambient = 0.4;
        sp.material.specular = .16;
        sp.material.diffuse = .5;
        sp.material.shininess = 3;
    }

    //stars
    const STAR_COUNT = 100;
    const xRange = 25;
    const yRange = 20;
    for(let i = 0; i < STAR_COUNT; i++){
        let star = createShape("Sphere", null);
        star.posZ = -10 - (Math.random() * 5);
        star.posX = -(xRange / 2.0) + (Math.random() * xRange);
        star.posY = -(yRange / 2.0) + (Math.random() * yRange);
        star.scaX = 0.05;
        star.scaY = 0.05;
        star.scaZ = 0.05;
        star.setColors([1,1,1], [1 - (Math.random() * 0.4), 1 - (Math.random() * 0.4), 1 - (Math.random() * 0.4)])
        star.rotXSpeed = Math.random() * 30;
        star.material.shininess = 120;
        star.material.ambient = .5;

    }

    //Planet 2
    let p2 = createShape("Sphere", p1);
    p2.posX = 3;
    p2.scaX = 0.3;
    p2.scaY = 0.3;
    p2.scaZ = 0.3;
    p2.rotZSpeed = 10;
    p2.setColors([.0, .25, 1], [0, .97, .96]);

    //Planet 2 rings
    let t1 = createShape("Torus", p2);
    t1.rotX = 90;
    t1.scaX = 2;
    t1.scaZ = 2;
    t1.scaY = .2;
    t1.setColors([.72, .85, 1], [.49, .63, .95]);
    //t1.rotZSpeed = 5;

    //Planet 2 Moon
    let p2m1 = createShape("Sphere", p2);
    p2m1.posX = 4;
    p2m1.scaX = 0.5;
    p2m1.scaY = 0.5;
    p2m1.scaZ = 0.5;
    p2m1.rotZSpeed = 10;
    p2m1.setColors([.65, .31, .03], [.49, .03, .65]);

    //Planet 2 Moon orbital satellite
    let p2m1s1 = createShape("Tetrahedron", p2m1);
    p2m1s1.scaX = 0.25;
    p2m1s1.scaY = 0.25;
    p2m1s1.scaZ = 0.25;
    p2m1s1.posX = 2;
    p2m1s1.setColors([.95, .38, .99], [1, 1, 1]);

    //Planet 3
    let p3 = createShape("Sphere", p1)
    p3.posX = 1;
    p3.posY = 5;
    p3.scaX = 0.2;
    p3.scaY = 0.2;
    p3.scaZ = 0.2;
    p3.rotX = Math.PI;
    p3.rotYSpeed = 5;
    p3.setColors([
    0.8705882352941177,
    0.47058823529411764,
    0.47058823529411764
], [
    0.6392156862745098,
    0.42745098039215684,
    0.058823529411764705
])
    //Planet 3 Moon1
    let p3m1 = createShape("Sphere", p3);
    p3m1.posX = 4;
    p3m1.scaX = 0.5;
    p3m1.scaY = 0.5;
    p3m1.scaZ = 0.5;
    p3m1.rotZSpeed = 10;
    //Planet 3 Moon2
    let p3m2 = createShape("Sphere", p3);
    p3m2.posX = -2.5;
    p3m2.poxY = 1;
    p3m2.scaX = 0.5;
    p3m2.scaY = 0.5;
    p3m2.scaZ = 0.5;
    p3m2.rotZSpeed = 50;
    //Planet 3 Moon orbital satellite
    let p3m2s1 = createShape("Cube", p3m2);
    p3m2s1.scaX = 0.25;
    p3m2s1.scaY = 0.25;
    p3m2s1.scaZ = 0.25;
    p3m2s1.posX = 2;

    //Planet 4
    let p4 = createShape("Sphere", p1)
    p4.posX = -3.5;
    p4.posY = -2;
    p4.scaX = .15;
    p4.scaY = 0.15;
    p4.scaZ = 0.15;
    p4.rotX = Math.PI;
    p4.rotYSpeed = 15;
    p4.setColors([
        0.4392156862745098, 0.8117647058823529, 1], [
        0.023529411764705882,
        0.5176470588235295,
        0.14901960784313725
    ])

    //Planet 4 Moon1
    let p4m1 = createShape("Sphere", p4);
    p4m1.posX = 4;
    p4m1.scaX = 0.5;
    p4m1.scaY = 0.5;
    p4m1.scaZ = 0.5;
    p4m1.rotZSpeed = 10;
    p4m1.setColors([.9, .9, .9], [.85, .85, .85])

    //Space Station
    let st1 = createShape("Torus", p1);
    st1.posX = -3;
    st1.posY = 3;
    //st1.rotX = Math.PI /2;
    st1.scaX = 0.2;
    st1.scaY = 0.2;
    st1.scaZ = 0.2;
    st1.rotYSpeed = 30;
    st1.rotZSpeed = 0;
    st1.rotXSpeed = 0;
    st1.setColors([1, 1, 1], [1, 1, 1])
       st1.material.diffuse = 0.3;
        st1.material.ambient = 0.3;
        st1.material.shininess = 100;
        st1.material.specular = .13;

    //Space Station center cylinder
    let st1cyl1 = createShape("Cylinder", st1);
    st1cyl1.scaX = 0.4;
    st1cyl1.scaY = 1;
    st1cyl1.scaZ = 0.4;
    st1cyl1.setColors([.9, .9, .9], [.8, .8, .8])
       st1cyl1.material.diffuse = 0.3;
        st1cyl1.material.ambient = 0.3;
        st1cyl1.material.shininess = 100;
        st1cyl1.material.specular = .13;

    // Space station ring cylinders
    let nCylinders = 8;
    let torusRadius = 1.4;

    for (let i = 0; i < nCylinders; i++) {
        let angle = (i / nCylinders) * 2 * Math.PI;
        let cx = torusRadius * Math.cos(angle);
        let cy = torusRadius * Math.sin(angle);

        let cyl = createShape("Cylinder", st1);
        cyl.posX = cx;
        cyl.posZ = cy;
        cyl.posY = 0;
        cyl.scaX = 0.2;
        cyl.scaY = 0.6;
        cyl.scaZ = 0.2;
        cyl.setColors([1, 1, 1], [.9, .9, .9])
        cyl.material.diffuse = 0.3;
        cyl.material.ambient = 0.3;
        cyl.material.shininess = 100;
        cyl.material.specular = .13;
    }

    //planet 5
    let p5 = createShape("Sphere", p1)
    p5.posX = -8;
    p5.posY = -7;
    p5.scaX = .1;
    p5.scaY = 0.1;
    p5.scaZ = 0.11;
    p5.rotY = Math.PI;
    p5.rotYSpeed = 5;

    let p5m1 = createShape("Cube", p5);
    p5m1.posX = -3;
    p5m1.posY = 2.5;
    p5m1.scaX = 0.5;
    p5m1.scaY = 0.5;
    p5m1.scaZ = 0.5;
}