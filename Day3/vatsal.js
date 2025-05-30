 // Global variables
        let scene, camera, renderer, listObjects = [], animationId;
        let pythonList = [];
        let isAnimating = true;
        let loopIterationCount = 0;
        let panelStates = {
            header: true,
            controls: false,
            stats: false
        };

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

            // Mouse controls for camera
            addMouseControls();

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

        // Add mouse controls for camera
        function addMouseControls() {
            let mouseDown = false;
            let mouseX = 0;
            let mouseY = 0;
            let targetRotationX = 0;
            let targetRotationY = 0;

            renderer.domElement.addEventListener('mousedown', (event) => {
                mouseDown = true;
                mouseX = event.clientX;
                mouseY = event.clientY;
            });

            renderer.domElement.addEventListener('mouseup', () => {
                mouseDown = false;
            });

            renderer.domElement.addEventListener('mousemove', (event) => {
                if (mouseDown) {
                    const deltaX = event.clientX - mouseX;
                    const deltaY = event.clientY - mouseY;

                    targetRotationY += deltaX * 0.01;
                    targetRotationX += deltaY * 0.01;

                    mouseX = event.clientX;
                    mouseY = event.clientY;
                }
            });

            // Smooth camera rotation
            function updateCamera() {
                if (mouseDown || Math.abs(targetRotationX) > 0.01 || Math.abs(targetRotationY) > 0.01) {
                    const radius = 15;
                    camera.position.x = Math.cos(targetRotationY) * Math.cos(targetRotationX) * radius;
                    camera.position.y = Math.sin(targetRotationX) * radius + 5;
                    camera.position.z = Math.sin(targetRotationY) * Math.cos(targetRotationX) * radius;
                    camera.lookAt(0, 0, 0);

                    if (!mouseDown) {
                        targetRotationX *= 0.95;
                        targetRotationY *= 0.95;
                    }
                }
                requestAnimationFrame(updateCamera);
            }
            updateCamera();
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

            renderer.render(scene, camera);
        }

        // Panel Toggle Functions
        function toggleHeader() {
            const header = document.getElementById('header');
            const toggleText = document.getElementById('headerToggleText');
            panelStates.header = !panelStates.header;

            if (panelStates.header) {
                header.classList.remove('collapsed');
                toggleText.textContent = 'Hide';
            } else {
                header.classList.add('collapsed');
                toggleText.textContent = 'Show';
            }
        }

        function toggleControls() {
            const panel = document.getElementById('controlsPanel');
            const toggleText = document.getElementById('controlsToggleText');
            panelStates.controls = !panelStates.controls;

            if (panelStates.controls) {
                panel.classList.add('expanded');
                toggleText.textContent = 'Controls ⬇';
            } else {
                panel.classList.remove('expanded');
                toggleText.textContent = 'Controls ⬆';
            }
        }

        function toggleStats() {
            const panel = document.getElementById('statsPanel');
            const toggleText = document.getElementById('statsToggleText');
            panelStates.stats = !panelStates.stats;

            if (panelStates.stats) {
                panel.classList.add('expanded');
                toggleText.textContent = 'HIDE';
            } else {
                panel.classList.remove('expanded');
                toggleText.textContent = 'STATS';
            }
        }

        // View Control Functions
        function resetCamera() {
            camera.position.set(0, 5, 15);
            camera.lookAt(0, 0, 0);
            appendToConsole('Camera view reset', 'output');
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                appendToConsole('Entered fullscreen mode', 'output');
            } else {
                document.exitFullscreen();
                appendToConsole('Exited fullscreen mode', 'output');
            }
        }

        // Enhanced Python Functions
        function addToList() {
            const input = document.getElementById('listInput');
            const value = input.value.trim();

            if (!value) {
                appendToConsole('Error: Please enter a value!', 'error');
                return;
            }

            pythonList.push(value);
            input.value = '';

            create3DListItem(value, pythonList.length - 1);

            appendToConsole(`>>> my_list.append("${value}")`, 'input');
            appendToConsole(`List updated: ${JSON.stringify(pythonList)}`, 'output');
            updateListCode();
            updateStats();
        }

        function create3DListItem(text, index) {
            const geometry = new THREE.BoxGeometry(
                Math.max(2, text.length * 0.2),
                1,
                1
            );

            const hue = (index * 60) % 360;
            const color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });

            const cube = new THREE.Mesh(geometry, material);

            const angle = (index / Math.max(pythonList.length, 1)) * Math.PI * 2;
            const radius = 5;
            cube.position.x = Math.cos(angle) * radius;
            cube.position.z = Math.sin(angle) * radius;
            cube.position.y = 2;

            const wireframe = new THREE.WireframeGeometry(geometry);
            const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x00ff88}));
            cube.add(line);

            // Text label
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
                const eased = 1 - Math.pow(1 - progress, 3);

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

                const currentObject = listObjects[currentIndex];
                if (currentObject) {
                    const originalColor = currentObject.material.color.clone();
                    currentObject.material.color.setHex(0xffff00);

                    setTimeout(() => {
                        currentObject.material.color.copy(originalColor);
                    }, 300);

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

        // New enhanced functions
        function randomizeColors() {
            listObjects.forEach((obj, index) => {
                const hue = Math.random() * 360;
                const color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);
                obj.material.color.copy(color);

                // Animate color change
                animateScale(obj, {x: 1.1, y: 1.1, z: 1.1}, 200);
                setTimeout(() => {
                    animateScale(obj, {x: 1, y: 1, z: 1}, 200);
                }, 200);
            });
            appendToConsole('Colors randomized!', 'output');
        }

        function exportList() {
            if (pythonList.length === 0) {
                appendToConsole('Error: List is empty!', 'error');
                return;
            }

            const exportData = {
                list: pythonList,
                timestamp: new Date().toISOString(),
                itemCount: pythonList.length
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'python_list_export.json';
            a.click();
            URL.revokeObjectURL(url);

            appendToConsole(`List exported: ${pythonList.length} items`, 'output');
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
            document.getElementById('execTime').textContent = (Math.random() * 50).toFixed(1) + 'ms';
            document.getElementById('objectCount').textContent = listObjects.length;
        }

        // Execute custom Python-like code
        function executeCustomCode() {
            const customCode = prompt('Enter Python code (basic list operations only):');
            if (!customCode) return;

            appendToConsole(`>>> ${customCode}`, 'input');

            try {
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
                } else if (customCode.includes('reverse()')) {
                    pythonList.reverse();
                    clearAll();
                    pythonList.forEach((item, index) => {
                        setTimeout(() => {
                            create3DListItem(item, index);
                        }, index * 100);
                    });
                    appendToConsole('List reversed!', 'output');
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
            const btn = document.querySelector('.view-btn[onclick="toggleAnimation()"]');
            btn.textContent = isAnimating ? '⏸️' : '▶️';
            btn.title = isAnimating ? 'Pause Animation' : 'Play Animation';
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

        // Handle keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'h':
                        e.preventDefault();
                        toggleHeader();
                        break;
                    case 's':
                        e.preventDefault();
                        toggleStats();
                        break;
                    case 'c':
                        e.preventDefault();
                        toggleControls();
                        break;
                    case 'r':
                        e.preventDefault();
                        resetCamera();
                        break;
                    case ' ':
                        e.preventDefault();
                        toggleAnimation();
                        break;
                }
            }
        });

        // Handle input events
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

            // Welcome message with keyboard shortcuts
            setTimeout(() => {
                appendToConsole('📋 Keyboard Shortcuts:', 'output');
                appendToConsole('Ctrl+H: Toggle Header | Ctrl+S: Toggle Stats', 'output');
                appendToConsole('Ctrl+C: Toggle Controls | Ctrl+R: Reset Camera', 'output');
                appendToConsole('Ctrl+Space: Toggle Animation', 'output');
            }, 1000);

            // Add some sample data after a delay
            setTimeout(() => {
                const samples = ['Learn Python', 'Build Apps', 'Master AI'];
                samples.forEach((sample, index) => {
                    setTimeout(() => {
                        document.getElementById('listInput').value = sample;
                        addToList();
                    }, index * 1000);
                });
            }, 2500);
        });
