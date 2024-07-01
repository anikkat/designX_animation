let headers = [
  "ARCH",
  "CVEN",
  "COMP",
  "ABPL",
  "CVENGEOM",
  "GDES",
  "FINA",
  "LARC",
  "MCEN",
  "PROP",
  "GEOM",
  "PLAN",
  "INFO",
];

let displayHeaders = [
  "ARCHITECTURE",
  "CIVIL ENGINEERING SYSTEMS",
  "COMPUTING AND SOFTWARE SYSTEMS",
  "CONSTRUCTION",
  "DIGITAL INFRASTRUCTURE ENGINEERING SYSTEMS",
  "GRAPHIC DESIGN",
  "PERFORMANCE DESIGN",
  "LANDSCAPE ARCHITECTURE",
  "MECHANICAL ENGINEERING SYSTEMS",
  "PROPERTY",
  "SPATIAL SYSTEMS",
  "URBAN PLANNING",
  "USER EXPERIENCE DESIGN",
];

let x = 0;
let y = 0;
const fontSize = 14;
const gridSpacing = 14; // Adjust this value to make the grid tighter or looser
const noiseScale = 0.001;
// noiseScale affects the granularity of the noise pattern.
// Lower value (e.g., 0.0001): Very smooth transitions.
// Higher value (e.g., 0.001): More dynamic, less smooth transitions.
const timeSpeed = 0.001;
// timeSpeed affects the speed of the animation.
// Lower value (e.g., 0.01): Slow animation progression.
// Higher value (e.g., 0.1): Fast animation progression.
let lockedIndices = []; // Array to store multiple locked indices
let hoverIndex = -1;
const margin = 3;
const paddingVertical = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Courier New");
  textSize(fontSize);
}

function draw() {
  background(255);

  // Draw the animation grid first
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  let t = frameCount * timeSpeed;

  for (let i = margin; i < width - margin; i += gridSpacing) {
    for (let j = margin; j < height - margin; j += gridSpacing) {
      const n = noise((i + x) * noiseScale, (j + y) * noiseScale, t);
      const idx = int(map(n, 0, 1, 0, headers.length * 5)) % headers.length;
      const chr = headers[idx].charAt(
        (i / fontSize + ((j / fontSize) % headers[idx].length)) %
          headers[idx].length
      );

      if (chr) {
        if (lockedIndices.length === 0) {
          fill(0); // Default color black
        } else if (lockedIndices.includes(idx)) {
          if (lockedIndices[0] === idx) {
            fill(255, 0, 0); // Red for the first clicked header
          } else if (lockedIndices[1] === idx) {
            fill(0); // Black for the second clicked header
          }
        } else {
          fill(255); // Set background color to hide the character
        }
        text(chr, i + fontSize / 2, j + fontSize / 2);
      }
    }
  }

  // Calculate maximum width and dynamic font size based on viewport width
  let maxWidth = (width - 2 * margin) / headers.length;
  let dynamicFontSize = maxWidth / 10;
  textSize(dynamicFontSize);

  let totalWidth = maxWidth * headers.length;
  let padding = (width - 2 * margin - totalWidth) / (headers.length - 1);

  for (let i = 0; i < headers.length; i++) {
    let xPos = margin + i * (maxWidth + padding);
    let words = displayHeaders[i].split(" ");
    let headerHeight = words.length * (dynamicFontSize + paddingVertical);

    // Check if mouse is over the entire header area
    let isHover =
      mouseX > xPos &&
      mouseX < xPos + maxWidth &&
      mouseY > margin &&
      mouseY < margin + headerHeight;

    if (isHover) {
      hoverIndex = i;
    }

    for (let j = 0; j < words.length; j++) {
      // Draw background rectangle with vertical padding for each word
      fill(200, 200, 200, 230); // Light gray background with 90% opacity
      rect(
        xPos,
        margin + j * (dynamicFontSize + paddingVertical),
        maxWidth,
        dynamicFontSize + paddingVertical
      );

      if (isHover || lockedIndices.includes(i)) {
        fill(255, 0, 0); // Red for hover or locked
      } else {
        fill(0); // Default color
      }
      textAlign(LEFT, CENTER);
      text(
        words[j],
        xPos + 5,
        margin +
          j * (dynamicFontSize + paddingVertical) +
          (dynamicFontSize + paddingVertical) / 2
      );
    }
  }

  if (mouseY > margin + paddingVertical) {
    hoverIndex = -1;
  }
}

function mouseClicked() {
  let maxWidth = (width - 2 * margin) / headers.length;
  let dynamicFontSize = maxWidth / 10;
  textSize(dynamicFontSize);

  let totalWidth = maxWidth * headers.length;
  let padding = (width - 2 * margin - totalWidth) / (headers.length - 1);

  for (let i = 0; i < headers.length; i++) {
    let xPos = margin + i * (maxWidth + padding);
    let words = displayHeaders[i].split(" ");
    let headerHeight = words.length * (dynamicFontSize + paddingVertical);

    // Check if the click is within the header area and directly on the text
    if (
      mouseX > xPos + 5 && // Ensure clicking within the text area
      mouseX < xPos + maxWidth &&
      mouseY > margin &&
      mouseY < margin + headerHeight
    ) {
      const index = lockedIndices.indexOf(i);
      if (index === -1) {
        if (lockedIndices.length < 2) {
          lockedIndices.push(i); // Lock
        }
      } else {
        lockedIndices.splice(index, 1); // Unlock
      }
      return; // Prevent further action if a header is clicked
    }
  }
}

function mouseDragged() {
  x += pmouseX - mouseX;
  y += pmouseY - mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
