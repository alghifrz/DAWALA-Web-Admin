#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('🌱 Dawala Admin Seeder');
console.log('======================\n');

// Check if required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');

// Function to make HTTP request
async function makeRequest(url, options = {}) {
  const fetch = (await import('node-fetch')).default;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return await response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

// Function to run seeder
async function runSeeder() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : 'http://localhost:3000';
  
  try {
    console.log('🚀 Starting admin seeder...\n');
    
    // Check if server is running
    try {
      await makeRequest(`${baseUrl}/api/seed-admin`, { method: 'GET' });
    } catch (error) {
      console.error('❌ Server is not running. Please start the development server first:');
      console.error('   npm run dev\n');
      process.exit(1);
    }
    
    // Run the seeder
    const result = await makeRequest(`${baseUrl}/api/seed-admin`, { method: 'GET' });
    
    if (result.success) {
      console.log('✅ Seeder completed successfully!\n');
      console.log('📊 Summary:');
      console.log(`   Total: ${result.summary.total}`);
      console.log(`   Created: ${result.summary.created}`);
      console.log(`   Skipped: ${result.summary.skipped}`);
      console.log(`   Failed: ${result.summary.failed}\n`);
      
      if (result.results.length > 0) {
        console.log('📋 Detailed Results:');
        result.results.forEach((item, index) => {
          const status = item.success ? '✅' : '❌';
          const action = item.action || (item.success ? 'success' : 'failed');
          console.log(`   ${index + 1}. ${status} ${item.email} - ${action}`);
          if (item.message) console.log(`      ${item.message}`);
          if (item.error) console.log(`      Error: ${item.error}`);
        });
      }
      
    } else {
      console.error('❌ Seeder failed:');
      console.error(`   ${result.error}\n`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ An error occurred:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

// Run the seeder
runSeeder(); 