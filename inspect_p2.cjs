const fs = require('fs');
const JSZip = require('jszip');
const p2 = 'C:/Users/Tender/.gemini/antigravity/brain/5a53450e-ee32-44ec-84f3-4f761eeaf722/.user_uploaded/media_1793349705270_161ffb83.pptx';

async function checkP2() {
  const zip = await JSZip.loadAsync(fs.readFileSync(p2));
  // check presentation.xml for slide size
  const presXml = await zip.file('ppt/presentation.xml').async('text');
  console.log('Slide size:', presXml.match(/<p:sldSz [^>]+>/));

  const slides = Object.keys(zip.files).filter(k => k.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a,b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  
  for (let s of slides) {
    console.log('--- ' + s + ' ---');
    const xml = await zip.file(s).async('text');
    // Check shapes
    const shapes = xml.match(/<p:sp>[\s\S]*?<\/p:sp>/g) || [];
    console.log('Shapes count:', shapes.length);
    // Extract title text
    const tm = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    const texts = tm.map(x => x.replace(/<\/?a:t>/g, ''));
    console.log('Texts:', texts.slice(0, 8).join(' | '));
  }
}
checkP2();
