let noClicks = 1;
const maxNoClicks = 4;
const minNoScale = 0.65;
let noScale = 1;
let yesScale = 1; // This now tracks the scaling factor directly

const gifElement = document.getElementById("catheart-gif");
const noButton = document.getElementById("no-btn");
const yesButton = document.getElementById("yes-btn");
const buttonContainer = document.querySelector(".btn-container");
const yesButtonStyle = window.getComputedStyle(yesButton);
const maxYesWidth = parseFloat(yesButtonStyle.maxWidth);

// array of gifs - in order
const gifs = [
    "assets/images/catheart.gif",
    "assets/images/catcrying3.gif",
    "assets/images/catcrying.gif",
    "assets/images/catcrying2.gif"
];

// array of messages
const buttonMessages = [
    "Are you sure??",
    "please",
    "PLEASE",
    "pretty please"
];

// Function to move the no button to a random position, avoiding the gif area
function moveNoButtonRandomly() {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get gif position and dimensions
    const gifRect = gifElement.getBoundingClientRect();
    const gifLeft = gifRect.left;
    const gifRight = gifRect.right;
    const gifTop = gifRect.top;
    const gifBottom = gifRect.bottom;
    
    // Get button dimensions (accounting for scale)
    const buttonRect = noButton.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    
    // Add some padding around the gif to avoid overlap
    const padding = 20;
    const gifAvoidLeft = gifLeft - padding;
    const gifAvoidRight = gifRight + padding;
    const gifAvoidTop = gifTop - padding;
    const gifAvoidBottom = gifBottom + padding;
    
    let attempts = 0;
    let newX, newY;
    let overlapsGif = true;
    
    // Try to find a position that doesn't overlap with the gif
    while (overlapsGif && attempts < 50) {
        // Generate random position
        newX = Math.random() * (viewportWidth - buttonWidth);
        newY = Math.random() * (viewportHeight - buttonHeight);
        
        // Check if button overlaps with gif area
        const buttonRight = newX + buttonWidth;
        const buttonBottom = newY + buttonHeight;
        
        overlapsGif = !(
            buttonRight < gifAvoidLeft ||
            newX > gifAvoidRight ||
            buttonBottom < gifAvoidTop ||
            newY > gifAvoidBottom
        );
        
        attempts++;
    }
    
    // If we couldn't find a good position after 50 attempts, place it at the edges
    if (overlapsGif) {
        // Try placing in corners or edges
        const positions = [
            { x: 10, y: 10 }, // Top-left
            { x: viewportWidth - buttonWidth - 10, y: 10 }, // Top-right
            { x: 10, y: viewportHeight - buttonHeight - 10 }, // Bottom-left
            { x: viewportWidth - buttonWidth - 10, y: viewportHeight - buttonHeight - 10 } // Bottom-right
        ];
        
        const validPos = positions.find(pos => {
            const btnRight = pos.x + buttonWidth;
            const btnBottom = pos.y + buttonHeight;
            return !(
                btnRight >= gifAvoidLeft &&
                pos.x <= gifAvoidRight &&
                btnBottom >= gifAvoidTop &&
                pos.y <= gifAvoidBottom
            );
        });
        
        if (validPos) {
            newX = validPos.x;
            newY = validPos.y;
        } else {
            // Last resort: place it away from center
            newX = gifAvoidRight + 10;
            newY = Math.random() * (viewportHeight - buttonHeight);
        }
    }
    
    // Apply the position
    noButton.style.position = "fixed";
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
    noButton.style.right = "auto";
    noButton.style.bottom = "auto";
    noButton.style.zIndex = "1000";
}

// no button clicked
if (noButton) {
    noButton.addEventListener("click", () => {

    if (noClicks >= maxNoClicks) {
        // Remove the no button completely
        noButton.remove();

        return; // stop all other logic
    }

    // change image
    gifElement.src = gifs[noClicks];

    // change no button text
    noButton.textContent = buttonMessages[noClicks % maxNoClicks];

    // Adjust button width to fit text
    noButton.style.width = "auto";
    noButton.style.width = `${noButton.scrollWidth}px`;
    
    // Move the button to a random position (avoiding gif area) - do this after text/width changes
    moveNoButtonRandomly();

    // decrease the size of the no button
    if (noScale > minNoScale) {
        noScale -= 0.1;
        noButton.style.transform = `scale(${noScale})`;
    }

    // Calculate the scaled width of the yesButton
    const baseWidth = parseFloat(yesButtonStyle.width);
    const scaledWidth = baseWidth * yesScale;

    console.log(`Scaled Width: ${scaledWidth}, Max Width: ${maxYesWidth}`);

    // Grow the yes button
    if (scaledWidth < maxYesWidth) {
        yesScale += 0.5;
        yesButton.style.transform = `scale(${yesScale})`;

        const currentGap = parseFloat(buttonContainer.style.gap) || 20;
        const newGap = Math.sqrt(currentGap * 250);
        buttonContainer.style.gap = `${newGap}px`;
    }

    noClicks++;
    });
}
