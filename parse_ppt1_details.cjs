const fs = require('fs');
const JSZip = require('jszip');
const p1 = 'C:/Users/Tender/.gemini/antigravity/brain/5a53450e-ee32-44ec-84f3-4f761eeaf722/.user_uploaded/media_1793340556219_6cf814ca.pptx';

async function parseAll() {
  const zip = await JSZip.loadAsync(fs.readFileSync(p1));
  for (let i = 1; i <= 5; i++) {
    const xml = await zip.file(`ppt/slides/slide${i}.xml`).async('text');
    console.log(`\n=================== SLIDE ${i} ===================`);
    // Extract shapes with their text and positions if possible
    const spMatches = xml.match(/<p:sp>[\s\S]*?<\/p:sp>/g) || [];
    spMatches.forEach((sp, idx) => {
      const tm = sp.match(/<a:t>([^<]*)<\/a:t>/g) || [];
      const txt = tm.map(x => x.replace(/<\/?a:t>/g, '')).join(' ');
      if (txt.trim()) {
        // Find x, y, cx, cy
        const off = sp.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
        const ext = sp.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
        const x = off ? (parseInt(off[1])/914400).toFixed(2) : '?';
        const y = off ? (parseInt(off[2])/914400).toFixed(2) : '?';
        const w = ext ? (parseInt(ext[1])/914400).toFixed(2) : '?';
        const h = ext ? (parseInt(ext[2])/914400).toFixed(2) : '?';
        console.log(`Shape ${idx} [x:${x}", y:${y}", w:${w}", h:${h}"] -> ${txt.trim()}`);
      }
    });
  }
}
parseAll();
