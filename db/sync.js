const fs = require('node:fs');
const path = require('node:path');
const db = require('@db/database')

const modelRootPath = path.join(__dirname, 'models');
const modelFiles = fs.readdirSync(modelRootPath).filter(file => file.endsWith('.js'))

console.log(`Started syncing ${modelFiles.length} Database Models.`)
for (const file of modelFiles) {
  const filePath = path.join(modelRootPath, file);
  const model = require(filePath);

  model.sync({alter: true}) // {force: true}
}
console.log(`Successfully Synced ${modelFiles.length} Database Models.`)
