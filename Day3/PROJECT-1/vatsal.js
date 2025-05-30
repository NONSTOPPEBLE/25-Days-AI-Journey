// Global variables
        let scene, camera, renderer, listObjects = [], animationId;
        let pythonList = [];
        let isAnimating = true;
        let loopIterationCount = 0;

        // Initialize Three.js scene
        function initThreeJS() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0f0f23, 50, 200);

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 5, 15);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x0f0f23, 0.8);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            document.getElementById('threejs-container').appendChild(renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x00ff88, 1);
            directionalLight.position.set(10, 10, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0x00ccff, 0.5, 100);
            pointLight.position.set(-10, 10, 10);
            scene.add(pointLight);

            // Grid helper
            const gridHelper = new THREE.GridHelper(20, 20, 0x00ff88, 0x004400);
            gridHelper.position.y = -2;
            scene.add(gridHelper);

            // Start animation loop
            animate();

            // Hide loading overlay
            setTimeout(() => {
                document.getElementById('loadingOverlay').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loadingOverlay').style.display = 'none';
                }, 500);
            }, 2000);
        }

        // Animation loop
        function animate() {
            animationId = requestAnimationFrame(animate);

            // Rotate list objects
            listObjects.forEach((obj, index) => {
                if (isAnimating) {
                    obj.rotation.y += 0.01;
                    obj.rotation.x = Math.sin(Date.now() * 0.001 + index) * 0.1;
                    obj.position.y = 2 + Math.sin(Date.now() * 0.002 + index) * 0.3;
                }
            });

            // Update camera orbit
            if (isAnimating) {
                const time = Date.now() * 0.0005;
                camera.position.x = Math.cos(time) * 15;
                camera.position.z = Math.sin(time) * 15;
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        }

        // Add item to Python list and 3D scene
        function addToList() {
            const input = document.getElementById('listInput');
            const value = input.value.trim();

            if (!value) {
                appendToConsole('Error: Please enter a value!', 'error');
                return;
            }

            // Add to Python list
            pythonList.push(value);
            input.value = '';

            // Create 3D object
            create3DListItem(value, pythonList.length - 1);

            // Update console and code
            appendToConsole(`>>> my_list.append("${value}")`, 'input');
            appendToConsole(`List updated: ${JSON.stringify(pythonList)}`, 'output');
            updateListCode();
            updateStats();
        }

        // Create 3D representation of list item
        function create3DListItem(text, index) {
            // Create geometry based on text length
            const geometry = new THREE.BoxGeometry(
                Math.max(2, text.length * 0.2),
                1,
                1
            );

            // Create material with gradient colors
            const hue = (index * 60) % 360;
            const color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });

            const cube = new THREE.Mesh(geometry, material);

            // Position cubes in a circle
            const angle = (index / pythonList.length) * Math.PI * 2;
            const radius = 5;
            cube.position.x = Math.cos(angle) * radius;
            cube.position.z = Math.sin(angle) * radius;
            cube.position.y = 2;

            // Add wireframe
            const wireframe = new THREE.WireframeGeometry(geometry);
            const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x00ff88}));
            cube.add(line);

            // Add text label
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;
            context.fillStyle = '#000000';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#00ff88';
            context.font = '36px Monaco';
            context.textAlign = 'center';
            context.fillText(text, canvas.width / 2, canvas.height / 2 + 12);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({map: texture});
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.y = 1.5;
            sprite.scale.set(4, 1, 1);
            cube.add(sprite);

            scene.add(cube);
            listObjects.push(cube);

            // Animate entrance
            cube.scale.set(0, 0, 0);
            animateScale(cube, {x: 1, y: 1, z: 1}, 500);
        }

        // Animate object scaling
        function animateScale(object, targetScale, duration) {
            const startScale = {...object.scale};
            const startTime = Date.now();

            function update() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

                object.scale.x = startScale.x + (targetScale.x - startScale.x) * eased;
                object.scale.y = startScale.y + (targetScale.y - startScale.y) * eased;
                object.scale.z = startScale.z + (targetScale.z - startScale.z) * eased;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            update();
        }

        // Demonstrate loop functionality
        function demonstrateLoop() {
            if (pythonList.length === 0) {
                appendToConsole('Error: List is empty! Add some items first.', 'error');
                return;
            }

            appendToConsole('>>> # Running for loop demonstration', 'input');
            appendToConsole('for i, item in enumerate(my_list, 1):', 'input');

            let currentIndex = 0;
            loopIterationCount = pythonList.length;

            function highlightNext() {
                if (currentIndex >= pythonList.length) {
                    appendToConsole('Loop completed successfully!', 'output');
                    updateStats();
                    return;
                }

                // Highlight current object
                const currentObject = listObjects[currentIndex];
                if (currentObject) {
                    // Flash effect
                    const originalColor = currentObject.material.color.clone();
                    currentObject.material.color.setHex(0xffff00);

                    setTimeout(() => {
                        currentObject.material.color.copy(originalColor);
                    }, 300);

                    // Scale animation
                    animateScale(currentObject, {x: 1.2, y: 1.2, z: 1.2}, 150);
                    setTimeout(() => {
                        animateScale(currentObject, {x: 1, y: 1, z: 1}, 150);
                    }, 150);
                }

                appendToConsole(`    print(f"${currentIndex + 1}. ${pythonList[currentIndex]}")`, 'output');

                currentIndex++;
                setTimeout(highlightNext, 600);
            }

            highlightNext();
        }

        // Clear all objects and reset
        function clearAll() {
            // Remove all 3D objects
            listObjects.forEach(obj => {
                scene.remove(obj);
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });

            listObjects = [];
            pythonList = [];
            loopIterationCount = 0;

            appendToConsole('>>> my_list.clear()', 'input');
            appendToConsole('List cleared successfully!', 'output');

            updateListCode();
            updateStats();
        }

        // Update the displayed Python list code
        function updateListCode() {
            const codeElement = document.getElementById('currentListCode');
            let codeHTML = '<span class="python-comment"># Current list contents</span>\n';
            codeHTML += '<span class="python-keyword">my_list</span> = [';

            if (pythonList.length > 0) {
                codeHTML += '\n';
                pythonList.forEach((item, index) => {
                    codeHTML += `    <span class="python-string">"${item}"</span>`;
                    if (index < pythonList.length - 1) codeHTML += ',';
                    codeHTML += '\n';
                });
            }

            codeHTML += ']\n';
            codeHTML += `<span class="python-comment"># Length: ${pythonList.length}</span>`;

            codeElement.innerHTML = codeHTML;
        }

        // Append message to console
        function appendToConsole(message, type = 'output') {
            const console = document.getElementById('pythonConsole');
            const className = type === 'error' ? 'console-error' :
                type === 'input' ? 'console-input' : 'console-output';

            console.innerHTML += `\n<span class="${className}">${message}</span>`;
            console.scrollTop = console.scrollHeight;
        }

        // Update statistics
        function updateStats() {
            document.getElementById('listCount').textContent = pythonList.length;
            document.getElementById('loopCount').textContent = loopIterationCount;
            document.getElementById('codeLines').textContent = (pythonList.length * 2 + 5);
            document.getElementById('execTime').textContent = Math.random() * 50 + 'ms';
        }

        // Execute custom Python-like code
        function executeCustomCode() {
            const customCode = prompt('Enter Python code (basic list operations only):');
            if (!customCode) return;

            appendToConsole(`>>> ${customCode}`, 'input');

            try {
                // Simple interpreter for basic list operations
                if (customCode.includes('append(')) {
                    const match = customCode.match(/append\(['"](.+?)['"]\)/);
                    if (match) {
                        document.getElementById('listInput').value = match[1];
                        addToList();
                    }
                } else if (customCode.includes('clear()')) {
                    clearAll();
                } else if (customCode.includes('len(')) {
                    appendToConsole(`Length: ${pythonList.length}`, 'output');
                } else {
                    appendToConsole('Code executed (limited interpreter)', 'output');
                }
            } catch (error) {
                appendToConsole(`Error: ${error.message}`, 'error');
            }
        }

        // Toggle animation
        function toggleAnimation() {
            isAnimating = !isAnimating;
            appendToConsole(`Animation ${isAnimating ? 'enabled' : 'disabled'}`, 'output');
        }

        // Show tutorial
        function showTutorial() {
            document.getElementById('tutorialOverlay').style.display = 'block';
        }

        // Close tutorial
        function closeTutorial() {
            document.getElementById('tutorialOverlay').style.display = 'none';
        }

        // Handle window resize
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Handle keyboard input
        document.getElementById('listInput').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addToList();
            }
        });

        // Initialize everything
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('DOMContentLoaded', function () {
            initThreeJS();
            updateStats();

            // Add some sample data
            setTimeout(() => {
                const samples = ['Learn Python', 'Build Apps', 'Master AI'];
                samples.forEach((sample, index) => {
                    setTimeout(() => {
                        document.getElementById('listInput').value = sample;
                        addToList();
                    }, index * 1000);
                });
            }, 3000);
        });
