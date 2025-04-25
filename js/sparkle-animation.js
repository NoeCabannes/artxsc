(function() {
    // Get the container element where sparkles will be added.
    // This should exist in your HTML: <div id="sparkle-container"></div>
    const sparkleContainer = document.getElementById('sparkle-container');

    // Check if the container exists and log an error if it doesn't.
    // This helps with debugging if the HTML isn't set up correctly.
    if (!sparkleContainer) {
        console.error("Error: Sparkle container element with ID 'sparkle-container' not found. Sparkles may not appear correctly.");
        // You could choose to exit here or fallback to document.body,
        // but it's better to ensure the HTML is correct.
    }

    function createSparkle(x, y, mouseSpeedX, mouseSpeedY) {
        const sparkle = document.createElement('div');
        const isBlue = Math.random() < 0.2;
        sparkle.className = `sparkle ${isBlue ? 'blue' : 'gray'}`; // Make sure your CSS uses these class names
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        // --- Sparkle physics and animation properties ---
        const baseAngle = Math.atan2(mouseSpeedY, mouseSpeedX);
        const randomAngle = baseAngle + (Math.random() - 0.5) * (Math.PI); // Angle variation
        const speed = Math.hypot(mouseSpeedX, mouseSpeedY);
        const baseDistance = Math.min(speed * 4, 100); // Base travel distance based on speed
        const distance = baseDistance + Math.random() * 60; // Add random distance
        const moveX = Math.cos(randomAngle) * distance; // Calculate X movement
        const moveY = Math.sin(randomAngle) * distance; // Calculate Y movement
        const rotation = Math.random() * 720 - 360; // Random rotation

        // Set CSS variables used by the animation
        sparkle.style.setProperty('--moveX', `${moveX}px`);
        sparkle.style.setProperty('--moveY', `${moveY}px`);
        sparkle.style.setProperty('--rotation', `${rotation}deg`);

        // *** MODIFICATION START ***
        // Append the sparkle to the container IF the container was found
        if (sparkleContainer) {
             sparkleContainer.appendChild(sparkle);
        } else {
             // Fallback: Append to body if container wasn't found (less ideal for scrolling)
             document.body.appendChild(sparkle);
        }
        // *** MODIFICATION END ***


        // Remove the sparkle after its animation finishes (1500ms)
        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }

    // --- Variables for tracking mouse movement and throttling ---
    let lastX = 0;
    let lastY = 0;
    let lastSparkleTime = 0;
    let lastTimeStamp = 0;
    let frameRequest; // Stores the requestAnimationFrame ID

    // Throttle interval: Minimum time (ms) between sparkle bursts
    const sparkleIntervalThreshold = 25;
    // Distance threshold: Minimum distance (pixels) mouse must move
    const distanceThreshold = 4;

    // --- Mouse move event handler ---
    function handleMouseMove(e) {
        // Get mouse coordinates relative to the viewport
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Cancel any pending animation frame to avoid redundant calculations
        if (frameRequest) {
            cancelAnimationFrame(frameRequest);
        }

        // Schedule the sparkle logic to run before the next browser repaint
        frameRequest = requestAnimationFrame(() => {
            const currentTime = Date.now();
            const timeElapsed = currentTime - lastTimeStamp; // Time since last processed move

            // Ignore if time hasn't passed or if there's a large gap (e.g., tab switch)
            if (timeElapsed <= 0 || timeElapsed > 500) {
                lastX = mouseX;
                lastY = mouseY;
                lastTimeStamp = currentTime;
                return; // Skip sparkle creation
            }

            // Calculate mouse movement since last frame
            const deltaX = mouseX - lastX;
            const deltaY = mouseY - lastY;
            const mouseSpeedX = deltaX / timeElapsed; // Speed on X-axis
            const mouseSpeedY = deltaY / timeElapsed; // Speed on Y-axis
            const distanceMoved = Math.hypot(deltaX, deltaY); // Total distance moved

            const timeSinceLastSparkle = currentTime - lastSparkleTime;

            // Check if enough distance was covered and enough time has passed
            if (distanceMoved > distanceThreshold && timeSinceLastSparkle > sparkleIntervalThreshold) {
                // Randomly create 1, 2, or 3 sparkles
                const sparkleCount = 1 + Math.round(Math.random() * 2);

                for (let i = 0; i < sparkleCount; i++) {
                    let offsetX = 0;
                    let offsetY = 0;

                    // Add a random offset to sparkles after the first one for a spread effect
                    if (i > 0) {
                        const spread = Math.min(Math.max(distanceMoved * 0.3, 8), 20); // Spread amount based on move distance
                        offsetX = (Math.random() - 0.5) * spread;
                        offsetY = (Math.random() - 0.5) * spread;
                    }

                    // Create a sparkle at the current mouse position (with offset)
                    createSparkle(
                        mouseX + offsetX,
                        mouseY + offsetY,
                        mouseSpeedX * 40, // Pass speed to influence animation distance
                        mouseSpeedY * 40
                    );
                }

                // Update the time of the last sparkle burst
                lastSparkleTime = currentTime;
            }

            // Update position and timestamp for the next frame calculation
            lastX = mouseX;
            lastY = mouseY;
            lastTimeStamp = currentTime;
        });
    }

    // Add the main event listener to the document
    document.addEventListener('mousemove', handleMouseMove);

})(); // Immediately invoke the function expression
