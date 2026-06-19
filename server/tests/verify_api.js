const runVerification = async () => {
  console.log('=== STARTING AUTOMATED API INTEGRATION TESTS ===');
  const baseURL = 'http://localhost:5000/api';

  try {
    // 1. Test Login Endpoint
    console.log('\n1. Testing admin login...');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@vlink.com',
        password: 'admin123'
      })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    const loginData = await loginRes.json();
    if (loginData.token) {
      console.log('✅ Login succeeded! Token retrieved.');
    } else {
      throw new Error('No token returned in login response.');
    }

    const token = loginData.token;

    // 2. Test Get Inventory
    console.log('\n2. Testing get inventory catalog...');
    const invRes = await fetch(`${baseURL}/inventory`);
    if (!invRes.ok) {
      throw new Error(`Get inventory failed with status ${invRes.status}`);
    }
    const invData = await invRes.json();
    const items = invData.data;
    console.log(`✅ Retrieved ${items.length} items from inventory catalog.`);
    
    const homeNode = items.find(i => i.itemName === 'Home Node');
    const cable = items.find(i => i.itemName === 'Cable');
    
    if (!homeNode || !cable) {
      throw new Error('Required items "Home Node" or "Cable" not found in seeded inventory.');
    }
    
    console.log(`- Initial "Home Node" Stock: ${homeNode.currentStock} (Expected: 42)`);
    console.log(`- Initial "Cable" Stock: ${cable.currentStock} (Expected: 2400)`);

    // 3. Test Daily Entries Submission (Atomic Stock Deduction)
    console.log('\n3. Testing daily entry submission (atomic stock deduction)...');
    const todayStr = new Date().toISOString().split('T')[0];
    const dispatchRes = await fetch(`${baseURL}/daily-entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: todayStr,
        time: '10:00 AM',
        careOf: 'John Doe',
        quality: 'GOOD',
        remarks: 'Automated integration test dispatch',
        materials: {
          homeNode: 5,
          cable: 100
        }
      })
    });

    if (!dispatchRes.ok) {
      throw new Error(`Daily entry failed with status ${dispatchRes.status}`);
    }
    const dispatchData = await dispatchRes.json();
    if (dispatchData.success) {
      console.log('✅ Daily entry dispatch processed successfully.');
    } else {
      throw new Error('Daily entry response success flag is false.');
    }

    // 4. Verify Stock Levels after deduction
    console.log('\n4. Verifying stock levels post-dispatch...');
    const invVerifyRes = await fetch(`${baseURL}/inventory`);
    if (!invVerifyRes.ok) {
      throw new Error(`Get inventory verification failed with status ${invVerifyRes.status}`);
    }
    const invVerifyData = await invVerifyRes.json();
    const updatedItems = invVerifyData.data;
    const updatedHomeNode = updatedItems.find(i => i.itemName === 'Home Node');
    const updatedCable = updatedItems.find(i => i.itemName === 'Cable');

    console.log(`- Post-Dispatch "Home Node" Stock: ${updatedHomeNode.currentStock} (Expected: 37)`);
    console.log(`- Post-Dispatch "Cable" Stock: ${updatedCable.currentStock} (Expected: 2300)`);

    if (updatedHomeNode.currentStock === 37 && updatedCable.currentStock === 2300) {
      console.log('✅ Stock levels successfully and atomically decremented!');
    } else {
      throw new Error(`Stock levels did not match expectations! Home Node: ${updatedHomeNode.currentStock}, Cable: ${updatedCable.currentStock}`);
    }

    // 5. Test Live Dashboard Stats
    console.log('\n5. Testing dashboard stats aggregation...');
    const statsRes = await fetch(`${baseURL}/dashboard/stats`);
    if (!statsRes.ok) {
      throw new Error(`Dashboard stats failed with status ${statsRes.status}`);
    }
    const statsData = await statsRes.json();
    const stats = statsData.data;
    console.log('✅ Dashboard stats retrieved successfully.');
    console.log(`- Total stock units: ${stats.totalStock}`);
    console.log(`- Low stock count: ${stats.lowStockCount}`);
    console.log(`- Today's usage count: ${stats.todayUsage}`);
    console.log(`- Recent activities count: ${stats.recentActivity.length}`);

    // 6. Test Reports Summary
    console.log('\n6. Testing reports summary generation...');
    const reportRes = await fetch(`${baseURL}/reports/summary?startDate=${todayStr}&endDate=${todayStr}`);
    if (!reportRes.ok) {
      throw new Error(`Reports summary failed with status ${reportRes.status}`);
    }
    const reportData = await reportRes.json();
    console.log('✅ Reports summary retrieved successfully.');
    console.log(`- Total movements aggregated today: ${reportData.kpis.totalMovements}`);
    console.log(`- Total inventory value out: ${reportData.kpis.inventoryValueOut}`);

    console.log('\n=== ALL INTEGRATION TESTS PASSED SUCCESSFULLY ✅ ===');
    process.exit(0);

  } catch (error) {
    console.error(`\n❌ Integration test failed: ${error.message}`);
    process.exit(1);
  }
};

runVerification();
