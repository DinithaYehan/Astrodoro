(function() {
    // Prevent injecting twice accidentally
    if (document.getElementById("astrodoro-rocket-overlay")) {
        return;
    }

    const rocket = document.createElement("div");
    rocket.id = "astrodoro-rocket-overlay";
    rocket.className = "astrodoro-overlay-rocket";
    rocket.innerText = "🚀";
    
    document.body.appendChild(rocket);
    
    // Self-destruct after animation completes
    setTimeout(() => {
        if (rocket && rocket.parentNode) {
            rocket.parentNode.removeChild(rocket);
        }
    }, 3500);
})();
