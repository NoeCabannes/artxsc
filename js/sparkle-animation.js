(function() {
    

    function createSparkle(x, y, mouseSpeedX, mouseSpeedY) {
        const sparkle = document.createElement('div');
        const isBlue = Math.random() < 0.2;
        sparkle.className = `sparkle ${isBlue ? 'blue' : 'gray'}`;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        const baseAngle = Math.atan2(mouseSpeedY, mouseSpeedX);
        // Keep random angle spread moderate
        const randomAngle = baseAngle + (Math.random() - 0.5) * (Math.PI);

        const speed = Math.hypot(mouseSpeedX, mouseSpeedY);
        // Keep base distance calculation
        const baseDistance = Math.min(speed * 4, 100); // Adjusted speed influence and max distance slightly
        const distance = baseDistance + Math.random() * 60; // Reduced random distance addition

        const moveX = Math.cos(randomAngle) * distance;
        const moveY = Math.sin(randomAngle) * distance;

        const rotation = Math.random() * 720 - 360;

        sparkle.style.setProperty('--moveX', `${moveX}px`);
        sparkle.style.setProperty('--moveY', `${moveY}px`);
        sparkle.style.setProperty('--rotation', `${rotation}deg`);

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }

    let lastX = 0;
    let lastY = 0;
    let lastSparkleTime = 0;
    let lastTimeStamp = 0;
    let frameRequest;

    // --- Slightly reduced throttle time ---
    const sparkleIntervalThreshold = 16; // Was 20ms
    // --------------------------------------

    function handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (frameRequest) {
            cancelAnimationFrame(frameRequest);
        }

        frameRequest = requestAnimationFrame(() => {
            const currentTime = Date.now();
            const timeElapsed = currentTime - lastTimeStamp;

            if (timeElapsed <= 0 || timeElapsed > 500) {
                lastX = mouseX;
                lastY = mouseY;
                lastTimeStamp = currentTime;
                return;
            }

            const deltaX = mouseX - lastX;
            const deltaY = mouseY - lastY;
            // Keep speed calculation simple
            const mouseSpeedX = deltaX / timeElapsed;
            const mouseSpeedY = deltaY / timeElapsed;

            const distance = Math.hypot(deltaX, deltaY);

            const timeSinceLastSparkle = currentTime - lastSparkleTime;

            // Keep distance threshold modest (e.g., 2 or 3 pixels)
            const distanceThreshold = 4;

            if (distance > distanceThreshold && timeSinceLastSparkle > sparkleIntervalThreshold) {
                // Decide how many sparkles: 1 or 2 or 3 (updated random factor)
                const sparkleCount = 1 + Math.round(Math.random() * 2); // Generates 1, 2, or 3

                for (let i = 0; i < sparkleCount; i++) {
                    let offsetX = 0;
                    let offsetY = 0;

                    // --- Apply offset only to the *second* and subsequent sparkles (if they exist) ---
                    if (i > 0) {
                        // Keep spread calculation reasonable
                        const spread = Math.min(Math.max(distance * 0.3, 8), 20); // Adjusted spread slightly
                        offsetX = (Math.random() - 0.5) * spread;
                        offsetY = (Math.random() - 0.5) * spread;
                    }
                    // ----------------------------------------------------------------

                    createSparkle(
                        mouseX + offsetX, // First sparkle (i=0) has offset 0,0
                        mouseY + offsetY,
                        // Pass speed - adjust multiplier factor if end animation feels too fast/slow
                        mouseSpeedX * 40, // Multiplier to influence animation distance
                        mouseSpeedY * 40
                    );
                }

                lastSparkleTime = currentTime;
            }

            lastX = mouseX;
            lastY = mouseY;
            lastTimeStamp = currentTime;
        });
    }

    document.addEventListener('mousemove', handleMouseMove);

})();
