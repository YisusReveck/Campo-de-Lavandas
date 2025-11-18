/* ----- Funciones generales ----- */

// Función auxiliar para generar valores aleatorios en un rango
const randomInRange = (min, max) => Math.random() * (max - min) + min;

// Función que te devuelve el angulo tangente en cierto punto
const getAngleAtPointSVG = (path, point) => {
    const totalLength = path.getTotalLength();
    const delta = 0.5;

    const prev = path.getPointAtLength(Math.max(point - delta, 0));
    const next = path.getPointAtLength(Math.min(point + delta, totalLength));

    return Math.atan2(next.y - prev.y, next.x - prev.x) * (180 / Math.PI);
};

// Función que te devuelve un punto especifico del path siguiendo el trayecto de la funcion Log
const getPointAtStepLog = (i) => {
    return i * Math.log(i + 1.5) * 2;
};

/* ----- Cesped ----- */

const temporizadorGrass = (delay, id) => {
    setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) elem.classList.add("visible");
    }, delay * 1000);
}

const createGrass = (id, { left = "0%", depth = 0, bladesCount = 4 } = {}) => {
    const field = document.getElementById("grass-field");
    if (!field) return console.warn("No existe #grass-field");

    // --- contenedor principal ---
    const container = document.createElement("div");
    container.classList.add("grass-container");
    container.id = id;

    // estilos dinámicos mínimos
    container.style.left = left;
    container.style.setProperty("--depth", depth);

    const variants = [
        { delay: "1.2s", time: "4s", angle: "-4deg", transform: "translate(20px,12px) rotate(-15deg) scale(-0.6,0.8)" },
        { delay: "0s", time: "3.5s", angle: "-6deg", transform: "translate(0,0) rotate(-5deg) scale(-1,1.2)" },
        { delay: "0.5s", time: "4s", angle: "7deg", transform: "translate(0,-12px) rotate(0deg) scale(1.3,1.5)" },
        { delay: "0.8s", time: "3.5s", angle: "5deg", transform: "translate(-20px,5px) rotate(10deg) scale(0.9,1.1)" }
    ];

    // --- crear múltiples hojas ---
    for (let i = 0; i < bladesCount; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("grass-wrapper");

        const v = variants[i % variants.length];
        wrapper.style.setProperty("--sway-delay-grass", v.delay);
        wrapper.style.setProperty("--sway-time-grass", v.time);
        wrapper.style.setProperty("--sway-angle-grass", v.angle);
        wrapper.style.transform = v.transform;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("grass-blade");

        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", "#grass-blade-symbol");

        svg.appendChild(use);
        wrapper.appendChild(svg);
        container.appendChild(wrapper);
    }

    field.appendChild(container);
    return container;
};

// Función para crear el campo de pasto con efecto 3D
const createGrassField = () => {
    const grassIds = [];

    const isMobile = window.innerWidth < 800;

    const layers = [
        { count: isMobile ? 6 : 15, depthRange: [0.7, 1.0] },
        { count: isMobile ? 4 : 10, depthRange: [0.4, 0.7] },
        { count: isMobile ? 3 : 7, depthRange: [0.2, 0.4] },
        { count: isMobile ? 2 : 4, depthRange: [0.0, 0.2] }
    ];

    let grassCounter = 1;

    layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            const id = `grass-${grassCounter}`;
            grassIds.push(id);
            grassCounter++;

            const depth = randomInRange(...layer.depthRange);

            const maxWidth = 30 + depth * 60;
            const minLeft = 50 - maxWidth / 2;
            const maxLeft = 50 + maxWidth / 2;
            const left = randomInRange(minLeft, maxLeft);

            createGrass(id, {
                depth,
                left: `${left}%`,
                bladesCount: 4
            });

            const appearTime = (1 - depth) * 2;
            const randomDelay = randomInRange(0, 0.4);
            temporizadorGrass(appearTime + randomDelay, id);
        }
    });

    return grassIds;
};


// Ejecutar
const grassIds = createGrassField();

/* ----- Lavandas ----- */

const temporizadorLavender = (delay, id) => {
    setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) elem.classList.add("visible");
        const lavenderPath = document.getElementById("lavender-stem-shape");

        if (lavenderPath) {
            const totalLength = lavenderPath.getTotalLength();
            const lavenderStemSVG = elem.querySelector(".lavender-stem");

            const lavenderPathPointsCount = 10;
            let lavenderPathPointsMid = [];
            let lavenderPathPointsLeft = [];
            let lavenderPathPointsRight = [];
            let stepFromLeft = []
            let stepFromRight = []

            const lavenderPetalScale = 0.18;
            const lavenderSepalScale = 0.3;

            // pathpoints generator (where flowers and leafs are going to appear)
            for (let i = 0; i < lavenderPathPointsCount; i++) {
                stepFromLeft.push(getPointAtStepLog(i));
                stepFromRight.push(totalLength - getPointAtStepLog(i));

                const pLeft = lavenderPath.getPointAtLength(stepFromLeft[i]);
                const pointLeft = {
                    x: pLeft.x,
                    y: pLeft.y,
                    angle: getAngleAtPointSVG(lavenderPath, stepFromLeft[i]),
                };
                lavenderPathPointsLeft.push(pointLeft);

                const pRight = lavenderPath.getPointAtLength(stepFromRight[i]);
                const pointRight = {
                    x: pRight.x,
                    y: pRight.y,
                    angle: getAngleAtPointSVG(lavenderPath, stepFromRight[i]),
                };
                lavenderPathPointsRight.push(pointRight);

                const avgPointX = (pointLeft.x + pointRight.x) / 2;
                const avgPointY = (pointLeft.y + pointRight.y) / 2;
                const pointMid = {
                    x: avgPointX,
                    y: avgPointY,
                    angle: getAngleAtPointSVG(lavenderPath, stepFromLeft[i]) - 90,
                }
                lavenderPathPointsMid.push(pointMid);
            };

            // Flowers
            for (let i = 0; i < lavenderPathPointsCount - 2; i++) {
                const lavenderFlowerScale = 1.5 - (lavenderPathPointsCount - i) * 0.2;
                let numPetals;

                const lavenderPetalSymbol = document.getElementById("lavender-petal-symbol-a");
                const lavenderPetalViewbox = lavenderPetalSymbol.getAttribute("viewBox");
                const [, , lavenderPetalViewboxWidth, lavenderPetalViewboxHeight] = lavenderPetalViewbox.split(" ").map(Number);
                const lavenderPetalWidth = lavenderPetalViewboxWidth * lavenderPetalScale + lavenderFlowerScale;
                const lavenderPetalHeight = lavenderPetalViewboxHeight * lavenderPetalScale + lavenderFlowerScale;
                const lavenderPetalCenterX = lavenderPetalWidth / 2;
                const lavenderPetalCenterY = lavenderPetalHeight / 2;

                const lavenderSepalSymbol = document.getElementById("lavender-sepal-symbol");
                const lavenderSepalViewbox = lavenderSepalSymbol.getAttribute("viewBox");
                const [, , lavenderSepalViewboxWidth, lavenderSepalViewboxHeight] = lavenderSepalViewbox.split(" ").map(Number);
                const lavenderSepalWidth = lavenderSepalViewboxWidth * lavenderSepalScale + lavenderFlowerScale;
                const lavenderSepalHeight = lavenderSepalViewboxHeight * lavenderSepalScale + lavenderFlowerScale;
                const lavenderSepalCenterX = lavenderSepalWidth / 2;
                const lavenderSepalCenterY = lavenderSepalHeight / 2;

                if (i >= 5) numPetals = 5;
                else if (i >= 2) numPetals = 4;
                else numPetals = 3;

                // --- petals ---
                for (let j = 0; j < numPetals; j++) {
                    const angle = -7 * numPetals + j * 14 * numPetals / (numPetals - 1) + Math.random() * 9 - 5;

                    const lavenderPetalRandomSymbol = Math.random() > 0.5
                        ? "#lavender-petal-symbol-a"
                        : "#lavender-petal-symbol-b";

                    const spreadFactor = (j / (numPetals - 1)) - 0.5;
                    const offsetX = numPetals > 3 ? spreadFactor * lavenderSepalWidth * 0.6 : spreadFactor * lavenderSepalWidth * 0.4;
                    const offsetY = lavenderSepalHeight * 0.4;

                    const lavenderPetal = document.createElementNS("http://www.w3.org/2000/svg", "use");
                    lavenderPetal.setAttribute("href", lavenderPetalRandomSymbol);
                    lavenderPetal.setAttribute("x", lavenderPathPointsMid[i].x);
                    lavenderPetal.setAttribute("y", lavenderPathPointsMid[i].y);
                    lavenderPetal.setAttribute("width", lavenderPetalWidth);
                    lavenderPetal.setAttribute("height", lavenderPetalHeight);
                    lavenderPetal.setAttribute("transform",
                        `
                            translate(${lavenderPetalCenterX + lavenderPathPointsMid[i].x}, ${lavenderPetalCenterY + lavenderPathPointsMid[i].y}) 
                            scale(1, ${randomInRange(1, 1.2)}) 
                            translate(${-lavenderPetalCenterX - lavenderPathPointsMid[i].x}, ${-lavenderPetalCenterY - lavenderPathPointsMid[i].y})
                            translate(${-lavenderPetalCenterX}, ${-lavenderPetalCenterY}) 
                            rotate(${lavenderPathPointsMid[i].angle + 180}, ${lavenderPetalCenterX + lavenderPathPointsMid[i].x}, ${lavenderPetalCenterY + lavenderPathPointsMid[i].y})
                            translate(${offsetX}, ${offsetY})
                            rotate(${-angle}, ${lavenderPetalCenterX + lavenderPathPointsMid[i].x}, ${lavenderPetalCenterY + lavenderPathPointsMid[i].y})
                        `);
                    lavenderStemSVG.appendChild(lavenderPetal);
                }

                // sepal
                const lavenderSepal = document.createElementNS("http://www.w3.org/2000/svg", "use");
                lavenderSepal.setAttribute("href", "#lavender-sepal-symbol");
                lavenderSepal.setAttribute("x", lavenderPathPointsMid[i].x);
                lavenderSepal.setAttribute("y", lavenderPathPointsMid[i].y);
                lavenderSepal.setAttribute("width", lavenderSepalWidth);
                lavenderSepal.setAttribute("height", lavenderSepalHeight);
                lavenderSepal.setAttribute("transform",
                    `
                        translate(${-lavenderSepalCenterX}, ${-lavenderSepalCenterY}) 
                        rotate(${lavenderPathPointsMid[i].angle}, ${lavenderSepalCenterX + lavenderPathPointsMid[i].x}, ${lavenderSepalCenterY + lavenderPathPointsMid[i].y})
                    `);
                lavenderStemSVG.appendChild(lavenderSepal);
            }

            // Leafs
            for (let i = lavenderPathPointsCount - 2; i < lavenderPathPointsCount; i++) {
                const lavenderLeafScale = 0.35;
                const lavenderLeafSymbol = document.getElementById("stem-symbol");
                const lavenderLeafViewBox = lavenderLeafSymbol.getAttribute("viewBox");
                const [, , lavenderLeafViewboxWidth, lavenderLeafViewBoxHeight] = lavenderLeafViewBox.split(" ").map(Number);
                const lavenderLeafWidth = lavenderLeafViewboxWidth * lavenderLeafScale;
                const lavenderLeafHeight = lavenderLeafViewBoxHeight * lavenderLeafScale;
                const lavenderLeafCenterX = lavenderLeafWidth / 2;
                const lavenderLeafCenterY = lavenderLeafHeight / 2;

                let lavenderLeafMirror = i % 2 ? false : true;
                let lavenderPathPointLeaf;
                let angleOffset;
                let distanceDebugX;
                let angle;
                let scaleX;
                if (!lavenderLeafMirror) {
                    // left
                    scaleX = 1;
                    lavenderPathPointLeaf = lavenderPathPointsLeft[i];
                    angleOffset = 250;
                    angle = getAngleAtPointSVG(lavenderPath, stepFromLeft[i]) + angleOffset;
                    distanceDebugX = -(Math.abs(Math.sin(angle * Math.PI / 180)) * lavenderLeafHeight / 2 + lavenderLeafWidth);
                } else {
                    // right
                    scaleX = -1;
                    lavenderPathPointLeaf = lavenderPathPointsRight[i];
                    angleOffset = 70;
                    angle = getAngleAtPointSVG(lavenderPath, stepFromRight[i]) + angleOffset;
                    distanceDebugX = (Math.abs(Math.sin(angle * Math.PI / 180)) * lavenderLeafHeight / 2);
                }

                const lavenderLeafGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                const lavenderLeaf = document.createElementNS("http://www.w3.org/2000/svg", "use");
                lavenderLeaf.setAttribute("href", "#stem-symbol");
                lavenderLeaf.setAttribute("x", lavenderPathPointLeaf.x);
                lavenderLeaf.setAttribute("y", lavenderPathPointLeaf.y);
                lavenderLeaf.setAttribute("width", lavenderLeafWidth);
                lavenderLeaf.setAttribute("height", lavenderLeafHeight);
                lavenderLeaf.setAttribute("transform",
                    `
                        translate(${lavenderLeafCenterX + lavenderPathPointLeaf.x}, ${lavenderLeafCenterY + lavenderPathPointLeaf.y}) 
                        scale(${scaleX}, 1) 
                        translate(${-lavenderLeafCenterX - lavenderPathPointLeaf.x}, ${-lavenderLeafCenterY - lavenderPathPointLeaf.y})
                        rotate(${angle}, ${lavenderLeafCenterX + lavenderPathPointLeaf.x}, ${lavenderLeafCenterY + lavenderPathPointLeaf.y}) 
                    `);
                lavenderLeafGroup.setAttribute("transform",
                    ` 
                        translate(${distanceDebugX} ${- lavenderLeafHeight})
                    `);
                lavenderLeafGroup.appendChild(lavenderLeaf);
                lavenderStemSVG.appendChild(lavenderLeafGroup);
            }
        }
    }, delay * 1000);
}

const createLavender = (id, { opacity = 1, bottom = "0%", left = "0%", zindex = 1, blur = 0, transform = "" } = {}) => {
    const field = document.getElementById("lavender-field");
    if (!field) return console.warn("No existe #lavender-field");

    // --- contenedor principal ---
    const container = document.createElement("div");
    container.classList.add("lavender-container");
    container.id = id;

    // estilos dinámicos
    container.style.opacity = opacity;
    container.style.bottom = bottom;
    container.style.left = left;
    container.style.filter = `blur(${blur}px)`;
    container.style.zIndex = zindex;
    if (transform) container.style.transform = transform;

    // --- wrapper ---
    const wrapper = document.createElement("div");
    wrapper.classList.add("lavender-wrapper");

    // --- SVG del tallo ---
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("lavender-stem");
    svg.setAttribute("viewBox", "0 0 12 57");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#stem-symbol");

    svg.appendChild(use);
    wrapper.appendChild(svg);
    container.appendChild(wrapper);
    field.appendChild(container);

    return container;
};

// Función para crear el campo de lavandas (asumiendo que lavender-1 ya existe en el centro)
const createLavenderField = () => {
    const lavenderIds = ["lavender-1"]; // La principal ya existe en el centro (50%)

    const isMobile = window.innerWidth < 800; // tú eliges el breakpoint

    // Distribución por capas: más lavandas en el fondo, menos al frente
    const layers = [
        { count: isMobile ? 3 : 8, depthRange: [0.7, 1.0] },   // Fondo: 10 lavandas
        { count: isMobile ? 2 : 6, depthRange: [0.4, 0.7] },    // Medio-fondo: 8 lavandas
        { count: isMobile ? 2 : 4, depthRange: [0.2, 0.4] },    // Medio-frente: 5 lavandas
        { count: isMobile ? 1 : 2, depthRange: [0.0, 0.2] }     // Frente: 3 lavandas
    ];

    let lavenderCounter = 2;

    layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            const id = `lavender-${lavenderCounter}`;
            lavenderIds.push(id);
            lavenderCounter++;

            // Depth aleatorio dentro del rango de esta capa
            const [minDepth, maxDepth] = layer.depthRange;
            const depth = randomInRange(minDepth, maxDepth);

            // Propiedades basadas en depth
            const bottom = 15 + depth * 25; // 15% a 40%
            const blur = 1 + depth * 4; // 1px a 5px
            const opacity = 0.4 - depth * 0.3; // 0.4 a 0.1
            const scale = 0.7 - depth * 0.5; // 0.7 a 0.2
            const zindex = Math.round(100 - bottom);

            // Ancho horizontal disponible según la profundidad (forma triangular)
            // PERO evitando el centro donde está la lavanda principal
            const maxWidth = 30 + depth * 60; // 30% al frente, 90% al fondo
            const centerExclusionZone = 10 - depth * 5; // Zona a evitar: 10% al frente, 2% al fondo

            // Decidir si va a la izquierda o derecha del centro
            let left;
            if (Math.random() > 0.5) {
                // Lado izquierdo
                const minLeft = 50 - maxWidth / 2;
                const maxLeft = 50 - centerExclusionZone;
                left = randomInRange(Math.max(5, minLeft), maxLeft);
            } else {
                // Lado derecho
                const minLeft = 50 + centerExclusionZone;
                const maxLeft = 50 + maxWidth / 2;
                left = randomInRange(minLeft, Math.min(95, maxLeft));
            }

            const rotate = randomInRange(-7, 7);
            const scaleX = Math.random() > 0.5 ? scale : -scale;
            const scaleY = randomInRange(scale * 0.8, scale * 1.2);

            createLavender(id, {
                left: `${left}%`,
                bottom: `${bottom}%`,
                blur: blur,
                opacity: opacity,
                zindex: zindex,
                transform: `translateX(-50%) rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`
            });

            // Las del fondo aparecen primero
            const appearTime = (1 - depth) * 1.8;
            const randomDelay = randomInRange(0, 0.3);
            temporizadorLavender(appearTime + randomDelay, id);
        }
    });

    // La principal aparece al final
    temporizadorLavender(2, "lavender-1");

    return lavenderIds;
};

// Ejecutar
const lavenderIds = createLavenderField();
