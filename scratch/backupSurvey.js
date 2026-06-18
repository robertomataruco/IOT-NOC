const fs = require('fs');
const path = require('path');

const originalPath = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'admin', 'survey', 'SurveyClient.tsx');
const backupPath = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'admin', 'survey', 'SurveyClient_original.tsx');

if (fs.existsSync(originalPath)) {
  fs.copyFileSync(originalPath, backupPath);
  console.log("SUCCESS: SurveyClient.tsx successfully backed up to SurveyClient_original.tsx!");
} else {
  console.log("ERROR: Original SurveyClient.tsx not found!");
}
