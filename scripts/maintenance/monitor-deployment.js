#!/usr/bin/env node

const https = require('https');
const { URL } = require('url');

const sites = [
  'https://summitchronicles.com',
  'https://heroic-figolla-ba583d.netlify.app'
];

let checkCount = 0;
const maxChecks = 20; // 10 minutes with 30-second intervals

function checkSiteStatus(url) {
  return new Promise((resolve) => {
    const { hostname, pathname, protocol } = new URL(url);
    const port = protocol === 'https:' ? 443 : 80;
    
    const options = {
      hostname,
      port,
      path: pathname,
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: err.code || 'ERROR',
        success: false
      });
    });

    req.end();
  });
}

async function monitorDeployment() {
  console.log('🔍 Monitoring Netlify deployment...');
  console.log(`📅 ${new Date().toISOString()}`);
  
  while (checkCount < maxChecks) {
    checkCount++;
    console.log(`\n--- Check ${checkCount}/${maxChecks} ---`);
    
    const results = await Promise.all(sites.map(checkSiteStatus));
    
    let anySuccess = false;
    results.forEach(result => {
      const emoji = result.success ? '✅' : '❌';
      console.log(`${emoji} ${result.url}: ${result.status}`);
      if (result.success) anySuccess = true;
    });
    
    if (anySuccess) {
      console.log('\n🎉 Deployment successful! Site is live!');
      
      // Test some key pages
      const testPages = [
        '/',
        '/blog',
        '/training',
        '/the-journey'
      ];
      
      console.log('\n🧪 Testing key pages...');
      for (const page of testPages) {
        const successfulSite = results.find(r => r.success)?.url;
        if (successfulSite) {
          const pageResult = await checkSiteStatus(successfulSite + page);
          const emoji = pageResult.success ? '✅' : '❌';
          console.log(`${emoji} ${successfulSite}${page}: ${pageResult.status}`);
        }
      }
      
      break;
    }
    
    if (checkCount < maxChecks) {
      console.log('⏳ Waiting 30 seconds before next check...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  if (checkCount >= maxChecks) {
    console.log('\n⚠️  Deployment taking longer than expected. Check Netlify dashboard for details.');
    console.log('🔗 Admin URL: https://app.netlify.com/projects/summit-chronicles');
  }
}

monitorDeployment().catch(console.error);
