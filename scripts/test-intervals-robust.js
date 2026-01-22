
const fs = require('fs');
const https = require('https');
const path = require('path');

// Load .env.local manually to avoid dependency issues
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const API_KEY = env.INTERVALS_ICU_API_KEY;
const ATHLETE_ID = env.INTERVALS_ICU_ATHLETE_ID;
const BASE_URL = 'https://intervals.icu/api/v1';

console.log(`--- Testing Connection for ${ATHLETE_ID} ---`);
console.log(`Key: ${API_KEY ? API_KEY.substring(0, 5) + '...' : 'MISSING'}`);

function makeRequest(label, authString) {
    return new Promise((resolve) => {
        console.log(`\nTesting: ${label}`);
        const options = {
            hostname: 'intervals.icu',
            path: `/api/v1/athlete/${ATHLETE_ID}/activities?oldest=2025-01-01&newest=2025-01-20`,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(authString).toString('base64')}`,
                'User-Agent': 'NodeJS Test'
            }
        };

        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
             let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ SUCCESS! Body length: ${data.length}`);
                    resolve(true);
                } else {
                    console.log(`❌ Failed. Body: ${data.substring(0, 100)}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(e);
            resolve(false);
        });
        req.end();
    });
}

async function run() {
    // 1. Standard: API_KEY as username
    if (await makeRequest("Standard (User=Key)", `${API_KEY}:`)) return;

    // 2. Fallback: API_KEY as password (sometimes clients do this)
    if (await makeRequest("Swap (User='api', Pass=Key)", `api:${API_KEY}`)) return;

    // 3. Fallback: User=sunith07 (from screenshot)
    if (await makeRequest("Username (User='sunith07', Pass=Key)", `sunith07@gmail.com:${API_KEY}`)) return;
}

run();
