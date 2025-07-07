const exifParser = require('exif-parser');
const fs = require('fs');
const sharp = require('sharp');
const { addImages } = require('../queries/addImages');
const handleFileUpload = async (files) => {
    var returnvalue = {
        status: 'true',
        data: 'none',
    }
    for (const file of files) {
        const buffer = fs.readFileSync(file.path);
        // Bestandsnaam of exif voor datum
        const nameMatch = file.originalname.match(/(\d{4})[-_]?(\d{2})[-_]?(\d{2})/);
        let date;

        if (nameMatch) {
            // Datum uit bestandsnaam
            date = new Date(`${nameMatch[1]}-${nameMatch[2]}-${nameMatch[3]}`);
        } else if (file.mimetype === 'image/jpeg') {
            // Alleen bij echte JPEG proberen we exif-parser
            try {
                const parser = exifParser.create(buffer);
                const result = parser.parse();
                if (result.tags.DateTimeOriginal) {
                    date = new Date(result.tags.DateTimeOriginal * 1000);
                } else {
                    date = new Date();
                }
            } catch (err) {
                console.warn(`Exif parsing failed for ${file.originalname}: ${err.message}`);
                date = new Date();
            }
        } else {
            // Geen exif-parser op PNG/WebP/etc.
            console.warn(`Bestand ${file.originalname} is geen JPEG. Val terug op huidige datum.`);
            date = new Date();
        }

        const dbFilename = file.originalname.split('.')[0]
        const dbPath = `/images/${Date.now()}-${dbFilename}.webp`
        const compressedPath = `src/static/images/${Date.now()}-${dbFilename}.webp`;

        await sharp(buffer).resize(1600).webp({ quality: 80 }).toFile(compressedPath);
        const writeToDB = addImages([dbFilename, dbPath, date.getFullYear(), date.getMonth() + 1, date.getDate()])
        if (writeToDB.status != 'false') {
            returnvalue.status = 'false'
            return returnvalue
        }

        fs.unlinkSync(file.path);
    }
    return returnvalue
}

exports.handleFileUpload = handleFileUpload


