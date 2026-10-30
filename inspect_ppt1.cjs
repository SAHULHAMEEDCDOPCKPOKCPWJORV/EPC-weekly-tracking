const fs = require('fs');
const JSZip = require('jszip');
const p1 = 'C:/Users/Tender/.gemini/antigravity/brain/5a53450e-ee32-44ec-84f3-4f761eeaf722/.user_uploaded/media_1793340556219_6cf814ca.pptx';

async function checkSlideRels() {
  const zip = await JSZip.loadAsync(fs.readFileSync(p1));
  const relFiles = Object.keys(zip.files).filter(k => k.match(/^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/));
  for (let r of relFiles) {
    const xml = await zip.file(r).async('text');
    console.log(r + ':');
    const matches = xml.match(/Target="[^"]*"/g) || [];
    console.log('  ' + matches.join(', '));
  }
}
checkSlideRels();
