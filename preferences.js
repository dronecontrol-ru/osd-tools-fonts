const fs = require('fs');
console.log('Creating font preferences');
const preferences = [];

// Parsing hardwares
const hwEntries = fs.readdirSync('./', { withFileTypes: true });

hwEntries.forEach(hwEntry => {
    if (!hwEntry.isDirectory()) {
        return;
    }

    let hwPreferences;
    try {
        const pref = fs.readFileSync(`./${hwEntry.name}/preferences.json`);
        hwPreferences = JSON.parse(pref);
    } catch(e) {
        return
    }
    hwPreferences.path = hwEntry.name;
    hwPreferences.softwares = [];

    // Parsing softwares 
    swEntries = fs.readdirSync(`./${hwEntry.name}`,  { withFileTypes: true });
    swEntries.forEach(swEntry => {
        if (!swEntry.isDirectory()) {
            return;
        }
        let swPreferences;
        try {
            const pref = fs.readFileSync(`./${hwEntry.name}/${swEntry.name}/preferences.json`);
            swPreferences = JSON.parse(pref);
        } catch(e) {
            return
        }
        swPreferences.path = swEntry.name;
        swPreferences.fonts = [];
        // Parsing fonts

        const fontEntries = fs.readdirSync(`./${hwEntry.name}/${swEntry.name}`,  { withFileTypes: true });
        fontEntries.forEach(fontEntry => {
            if (!fontEntry.isDirectory()) {
                return;
            }
            let downloads = true;
            hwPreferences.downloads.forEach(file => {
                const font = `./${hwEntry.name}/${swEntry.name}/${fontEntry.name}/${file}`;
                console.log(font);
                downloads &= fs.existsSync(font);
            });
            console.log(downloads);
            if (!downloads || !fs.existsSync(`./${hwEntry.name}/${swEntry.name}/${fontEntry.name}/${hwPreferences.preview.file}`)) {
                return;
            }

            swPreferences.fonts.push(fontEntry.name);
        })
        hwPreferences.softwares.push(swPreferences);
    })
    preferences.push(hwPreferences);
});
fs.writeFileSync('./preferences.json', JSON.stringify(preferences, undefined, 4));
console.log(preferences);
