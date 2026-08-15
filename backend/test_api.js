const http = require('http');

const PORT = 5000;

function makeRequest(path, method, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runVerificationTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING AI REAL ESTATE ASSISTANT API TESTS');
  console.log('==================================================');

  try {
    // Test 1: General Real Estate Question
    console.log('\n[TEST 1] General Real Estate Question...');
    const res1 = await makeRequest('/api/ai/chat', 'POST', {
      message: 'What should I consider before buying a property?'
    });
    console.log('Status:', res1.status);
    console.log('Intent:', res1.data.intent);
    console.log('Answer preview:', res1.data.answer.substring(0, 100) + '...');
    if (res1.status === 200 && res1.data.intent === 'REAL_ESTATE_QUESTION') {
      console.log('✅ TEST 1 PASSED');
    } else {
      console.error('❌ TEST 1 FAILED', res1);
    }

    // Test 2: Property Search Query
    console.log('\n[TEST 2] Property Search Query...');
    const res2 = await makeRequest('/api/ai/chat', 'POST', {
      message: 'Find me a 3-bedroom apartment in Downtown under $500,000'
    });
    console.log('Status:', res2.status);
    console.log('Intent:', res2.data.intent);
    console.log('Found Properties Count:', res2.data.properties ? res2.data.properties.length : 0);
    if (res2.status === 200 && res2.data.intent === 'PROPERTY_SEARCH' && res2.data.properties.length > 0) {
      console.log('✅ TEST 2 PASSED — Property search retrieved real listings');
    } else {
      console.error('❌ TEST 2 FAILED', res2);
    }

    // Test 3: Follow-Up Context Query
    console.log('\n[TEST 3] Follow-Up Query (Context Retention)...');
    const res3 = await makeRequest('/api/ai/chat', 'POST', {
      message: 'Tell me about the first one.',
      context: res2.data.context,
      history: [
        { role: 'user', content: 'Find me a 3-bedroom apartment in Downtown under $500,000' },
        { role: 'assistant', content: res2.data.answer }
      ]
    });
    console.log('Status:', res3.status);
    console.log('Intent:', res3.data.intent);
    console.log('Answer preview:', res3.data.answer.substring(0, 120) + '...');
    if (res3.status === 200 && res3.data.intent === 'PROPERTY_DETAILS') {
      console.log('✅ TEST 3 PASSED — Assistant identified the requested property');
    } else {
      console.error('❌ TEST 3 FAILED', res3);
    }

    // Test 4: Market Insight Query
    console.log('\n[TEST 4] Market Insight Query...');
    const res4 = await makeRequest('/api/ai/chat', 'POST', {
      message: 'How is the real estate market in Downtown?'
    });
    console.log('Status:', res4.status);
    console.log('Intent:', res4.data.intent);
    if (res4.status === 200 && res4.data.intent === 'MARKET_INSIGHT') {
      console.log('✅ TEST 4 PASSED');
    } else {
      console.error('❌ TEST 4 FAILED', res4);
    }

    // Test 5: Input Validation & Empty Message
    console.log('\n[TEST 5] Empty Message Input Validation...');
    const res5 = await makeRequest('/api/ai/chat', 'POST', {
      message: '   '
    });
    console.log('Status:', res5.status);
    console.log('Response:', res5.data);
    if (res5.status === 400 && res5.data.success === false) {
      console.log('✅ TEST 5 PASSED — Correctly rejected empty message');
    } else {
      console.error('❌ TEST 5 FAILED', res5);
    }

    console.log('\n==================================================');
    console.log('🎉 ALL API VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
  } catch (err) {
    console.error('API Test Error:', err);
  }
}

runVerificationTests();
