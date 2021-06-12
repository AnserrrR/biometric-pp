const root = document.getElementById('root')
const domain = ''

const loginPage = /* html */`
<form class="login-form" onsubmit="loginSubmit(event)">
  <div>
    <label for="login" class="form-label">Login</label>
    <input type="text" class="form-control" id="login" aria-describedby="loginHelp" name="login">
    <div id="loginHelp" class="form-text">We'll never share your login with anyone else.</div>
  </div>
  <div>
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password">
  </div>
  <button type="submit" class="btn btn-primary btn-login">Login</button>
</form>`

function ordersPage(orders = []) {
  return /* html */`
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Id</th>
        <th scope="col">FIO</th>
        <th scope="col">Phone</th>
        <th scope="col">Country</th>
        <th scope="col">Address</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map((order) => {
        return /* html */`
        <tr>
          <th scope="row">${order.id}</th>
          <td>${order.fio}</td>
          <td>${order.phone}</td>
          <td>${order.country}</td>
          <td>${order.address}</td>
        </tr>
        `
      }).join('')}
    </tbody>
    </table>
  `
} 

// root.innerHTML = loginPage

async function loginSubmit(event) {
  event.preventDefault()
  const form = event.target
  const loginValue = form.login.value;
  const passwordValue = form.password.value;
  const response = await fetch(`${domain}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: loginValue,
      password: passwordValue
    })
  })
  if (response.ok) {
    const tokenInfo = await response.json()
    localStorage.setItem('Token', tokenInfo.token)
    renderOrders()
  }
}

async function renderOrders() {
  const token = localStorage.getItem('Token')
  if (token) {
    const response = await fetch(`${domain}/api/application`, {
      headers: {
        'Authorization': token
      }
    })
    if (response.ok) {
      const orders = await response.json()
      const ordersHtml = ordersPage(orders)
      root.innerHTML = ordersPage(orders)
    } else {
      root.innerHTML = loginPage
    }
  } else {
    root.innerHTML = loginPage
  }
}

renderOrders()