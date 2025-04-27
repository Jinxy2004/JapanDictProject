const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '../jiten/assets/kanji_svgs');
const outputFile = path.join(__dirname, '../jiten/components/KanjiComponents/kanjiSvgs.js');

const files = fs.readdirSync(svgDir)
    .filter(f => f.endsWith('.svg'));

files.forEach(file => {
    const filePath = path.join(svgDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (
        content.includes('kvg:') &&
        !content.includes('xmlns:kvg=')
    ) {
        content = content.replace(
            /<svg\b([^>]*)>/,
            `<svg$1 xmlns:kvg="http://kanjivg.tagaini.net">`
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed namespace in ${file}`);
    }
    content = content.replace(/(<\/?|\s)kvg:/g, '$1');
    content = content.replace(/stroke:#000000/g, 'stroke:currentColor');
    content = content.replace(/fill:#000000/g, 'fill:currentColor');
    content = content.replace(/fill:#808080/g, 'fill:currentColor');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed kvg: prefixes in ${file}`);
});

let imports = '';
let mappings = 'export const kanjiSvgs = {\n';

files.forEach(file => {
    const base = file.replace('.svg', '');
    const varName = `_${base.replace(/-/g, '_')}`;
    imports += `import ${varName} from '../../assets/kanji_svgs/${file}';\n`;
    mappings += `  '${base}': ${varName},\n`;
});

mappings += '};\n';

const output = `${imports}\n${mappings}`

fs.writeFileSync(outputFile, output);

console.log(`Generated ${outputFile} with ${files.length} SVGs.`);