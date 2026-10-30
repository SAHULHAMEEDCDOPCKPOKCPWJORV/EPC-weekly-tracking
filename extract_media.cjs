const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const p1 = 'C:/Users/Tender/.gemini/antigravity/brain/5a53450e-ee32-44ec-84f3-4f761eeaf722/.user_uploaded/media_1793340556219_6cf814ca.pptx';

async function extractMedia() {
  const zip = await JSZip.loadAsync(fs.readFileSync(p1));
  const mediaDir = 'H:/weekly progress application/extracted_media';
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const mediaFiles = Object.keys(zip.files).filter(k => k.startsWith('ppt/media/'));
  for (let m of mediaFiles) {
    const filename = path.basename(m);
    const buf = await zip.file(m).async('nodebuffer');
    fs.writeFileSync(path.join(mediaDir, filename), buf);
    console.log('Saved', filename, buf.length, 'bytes');
  }
}

extractMedia();
