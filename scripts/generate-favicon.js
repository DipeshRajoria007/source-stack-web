const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

async function generateFavicon() {
  const svgPath = path.join(__dirname, '../src/app/icon.svg');
  const icoPath = path.join(__dirname, '../src/app/favicon.ico');
  
  // Read the SVG file
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Generate PNG buffers at different sizes for ICO
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );
  
  // Convert PNG buffers to ICO
  const icoBuffer = await toIco(pngBuffers);
  
  // Write the ICO file
  fs.writeFileSync(icoPath, icoBuffer);
  
  console.log('✅ Favicon.ico generated successfully!');
}

generateFavicon().catch(console.error);

