var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var sunlight = new THREE.PointLight(0xffffff, 2, 1000);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

scene.background = new THREE.Color(0x000000);


var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.autoRotate = true; 
controls.autoRotateSpeed = 0.5; 
controls.minDistance = 30; 
controls.maxDistance = 200; 

camera.position.set(100, 10, 100);

var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

function addStars() {
    var starGeometry = new THREE.BufferGeometry();
    var starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    var starVertices = [];
    for (let i = 0; i < 5000; i++) {
        var x = (Math.random() - 0.5) * 2000;
        var y = (Math.random() - 0.5) * 2000;
        var z = -Math.random() * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    var stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}
addStars();
var planetsData = [
    { 
        name: 'Proxima Centauri b', 
        texture: 'textures/proxima_centauri_b.jpeg', 
        orbitRadius: 100, 
        diameter: 1.17, 
        discoveryYear: 2016, 
        orbitalPeriod: 11.2, 
        mass: 1.27, 
        location: '4.24 light-years away' 
    },
    { 
        name: 'TRAPPIST-1e', 
        texture: 'textures/trappist_1e.jpg', 
        orbitRadius: 150, 
        diameter: 1.04, 
        discoveryYear: 2017, 
        orbitalPeriod: 6.1, 
        mass: 0.62, 
        location: '40 light-years away' 
    },
    { 
        name: 'Kepler-186f', 
        texture: 'textures/kepler_186f.png', 
        orbitRadius: 200, 
        diameter: 1.11, 
        discoveryYear: 2014, 
        orbitalPeriod: 130, 
        mass: 'Unknown', 
        location: '500 light-years away' 
    },
    { 
        name: 'HD 209458 b (Osiris)', 
        texture: 'textures/hd_209458_b.jpg', 
        orbitRadius: 250, 
        diameter: 1.38 * 11.2,
        discoveryYear: 1999, 
        orbitalPeriod: 3.5, 
        mass: 0.69, 
        location: '159 light-years away' 
    },
    { 
        name: 'WASP-12b', 
        texture: 'textures/WASP-12b.jpg', 
        orbitRadius: 300, 
        diameter: 1.79 * 11.2,
        discoveryYear: 2008, 
        orbitalPeriod: 1.1, 
        mass: 1.4, 
        location: '870 light-years away' 
    },
    { 
        name: 'LHS 1140 b', 
        texture: 'textures/lhs_1140_b.jpg', 
        orbitRadius: 350, 
        diameter: 1.4, 
        discoveryYear: 2017, 
        orbitalPeriod: 24.7, 
        mass: 6.6, 
        location: '40 light-years away' 
    },
    { 
        name: '55 Cancri e', 
        texture: 'textures/55_cancri_e.jpg', 
        orbitRadius: 400, 
        diameter: 2, 
        discoveryYear: 2004, 
        orbitalPeriod: 0.736, 
        mass: 8, 
        location: '41 light-years away' 
    },
    { 
        name: 'K2-18 b', 
        texture: 'textures/k2_18_b.jpg', 
        orbitRadius: 450, 
        diameter: 2.6, 
        discoveryYear: 2015, 
        orbitalPeriod: 33, 
        mass: 'Unknown', 
        location: '124 light-years from earth' 
    },
    { 
        name: 'TOI 700 d', 
        texture: 'textures/toi_700_d.jpg', 
        orbitRadius: 500, 
        diameter: 1.19, 
        discoveryYear: 2020, 
        orbitalPeriod: 37.4, 
        mass: 'Unknown', 
        location: '100 light-years away' 
    }
];

function addPlanetsToSpace() {
    planetsData.forEach((planet, index) => {
        var geometry;

        if (planet.name === 'WASP-12b') {
            geometry = new THREE.SphereGeometry(50, 32, 32);
            geometry.scale(1.0, 1.3, 1.0); 

        } else {
            geometry = new THREE.SphereGeometry(50, 32, 32);
        }

        var material = new THREE.MeshStandardMaterial({ 
            map: new THREE.TextureLoader().load(planet.texture),
        });

        var mesh = new THREE.Mesh(geometry, material);
        var xOffset = index * 100; 
        mesh.position.set(xOffset, 0, 0);
        scene.add(mesh);
        planet.mesh = mesh;

        var planetLight = new THREE.PointLight(0xffffff, 1, 500);
        planetLight.position.set(xOffset, 0, 0);
        scene.add(planetLight);
    });

    planetsData.forEach((planet, index) => {
        planet.mesh.visible = (index === 0);
        updateInfo(0);
    });
}
addPlanetsToSpace();

var count  = planetsData.length;
function createUI() {
    var nextButtonDiv = document.getElementById('nextButton');
    var backButtonDiv = document.getElementById('backButton');
    var nextButton = document.createElement('button');
    var backButton = document.createElement('button');
    nextButtonDiv.appendChild(nextButton);
    backButtonDiv.appendChild(backButton);

    nextButtonDiv.innerText = 'Next';
    nextButtonDiv.onclick = function() { 
        if (count < planetsData.length - 1) { 
            count++;
        } else {
            count = 0;
        }
        goToPlanet(count);
    };
    backButton.onclick = function() { 
        if (count > 0) {
            count--; 
        } else {
            count = planetsData.length - 1;  
        }
        goToPlanet(count);
    };
    backButton.innerText = 'Back';
}
createUI();

function updateInfo(index) {
    var infoDiv = document.getElementById('info');
    var planet = planetsData[index];
    infoDiv.innerHTML = '<div class="leftInfo"><p>Distance from Earth: ' + planet.location + '</p></div>' +
                        '<div class="centerInfo"><h3>' + planet.name + '</h3>' +
                        '<p>Discovery Year: ' + planet.discoveryYear + '</p>' +
                        '<p>Orbit Radius: ' + planet.orbitRadius + ' AU</p>' +
                        '<p>Diameter: ' + planet.diameter + ' Earths</p>' +
                        '<p>Orbital Period: ' + planet.orbitalPeriod + ' Earth days</p>' +
                        '<p>Mass: ' + planet.mass + ' times that of Earth</p></div>';
}

function goToPlanet(index) {
    planetsData.forEach(planet => planet.mesh.visible = false);
    
    var selectedPlanet = planetsData[index];
    selectedPlanet.mesh.visible = true;

    selectedPlanet.mesh.position.set(0, 0, 0);

    var distance = selectedPlanet.diameter * 100; 
    var cameraPosition = { x: 0, y: distance / 2, z: distance };

    updateInfo(index);

    new TWEEN.Tween(camera.position)
        .to(cameraPosition, 1000) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

    controls.target.set(0, 0, 0);
    controls.update();
}

function addStarMap() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ size: 1, color: 0xffffff });
    
    const starVertices = [];
    for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starMap = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMap);
}
addStarMap();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
