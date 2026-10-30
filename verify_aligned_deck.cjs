const fs = require('fs');
const JSZip = require('jszip');

async function verifyDeck() {
  const file = 'H:/weekly progress application/Swelect_Weekly_Project_Report_Week43_Aligned.pptx';
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const slides = Object.keys(zip.files).filter(k => k.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a,b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  
  console.log('Total verified slides:', slides.length);

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const xml = await zip.file(s).async('text');
    console.log(`\n================ SLIDE ${i+1} (${s}) ================`);

    // Extract slide bounds
    let maxRight = 0;
    let maxBottom = 0;
    let overflowCount = 0;

    // Check all offsets and extents in shapes and tables
    const spBlocks = xml.match(/<(p:sp|p:graphicFrame|p:pic)>[\s\S]*?<\/(p:sp|p:graphicFrame|p:pic)>/g) || [];
    console.log(`Total elements: ${spBlocks.length}`);

    spBlocks.forEach((b, idx) => {
      const off = b.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
      const ext = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
      if (off && ext) {
        const x = parseInt(off[1]) / 914400;
        const y = parseInt(off[2]) / 914400;
        const w = parseInt(ext[1]) / 914400;
        const h = parseInt(ext[2]) / 914400;
        const right = x + w;
        const bottom = y + h;

        if (right > maxRight) maxRight = right;
        if (bottom > maxBottom) maxBottom = bottom;

        if (right > 13.34 || bottom > 7.51) {
          console.error(`OVERFLOW in Slide ${i+1} element ${idx}: X=${x.toFixed(2)}, Y=${y.toFixed(2)}, W=${w.toFixed(2)}, H=${h.toFixed(2)} -> Right=${right.toFixed(2)}", Bottom=${bottom.toFixed(2)}"`);
          overflowCount++;
        }
      }
    });

    console.log(`Max X+W: ${maxRight.toFixed(2)}" (Slide Width: 13.33")`);
    console.log(`Max Y+H: ${maxBottom.toFixed(2)}" (Slide Height: 7.50")`);
    console.log(`Overflow elements: ${overflowCount}`);

    // Extract text snippet
    const tm = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    const texts = tm.map(x => x.replace(/<\/?a:t>/g, ''));
    console.log(`Text count: ${texts.length}, Sample: ${texts.slice(0, 6).join(' | ')}`);
  }
}

verifyDeck();
