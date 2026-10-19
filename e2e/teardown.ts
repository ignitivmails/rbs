/** Removes data created by the browser tests (everything named "E2E Tester"). */
export default async function teardown() {
  const base = 'http://localhost:3000'
  try {
    const login = await (
      await fetch(`${base}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@realbengalsweets.local', password: 'admin12345' }),
      })
    ).json()
    const auth = { Authorization: `JWT ${login.token}`, 'Content-Type': 'application/json' }
    const orders = await (await fetch(`${base}/api/orders?where[customerName][like]=E2E&limit=100&depth=0`, { headers: auth })).json()
    for (const o of orders.docs ?? []) {
      // Cancelling first returns reserved stock.
      await fetch(`${base}/api/orders/${o.id}`, { method: 'PATCH', headers: auth, body: JSON.stringify({ status: 'cancelled' }) })
      await fetch(`${base}/api/orders/${o.id}`, { method: 'DELETE', headers: auth })
    }
    for (const collection of ['customers', 'enquiries']) {
      const res = await (await fetch(`${base}/api/${collection}?where[name][like]=E2E&limit=100&depth=0`, { headers: auth })).json()
      for (const d of res.docs ?? []) await fetch(`${base}/api/${collection}/${d.id}`, { method: 'DELETE', headers: auth })
    }
  } catch (err) {
    console.warn('E2E teardown skipped:', err)
  }
}
