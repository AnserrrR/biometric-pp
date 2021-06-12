let startButton = document.getElementById('start-btn')
let menuBtn = document.querySelector('.bi-list')
let menuList = document.querySelector('.menu-list')

startButton.onclick = function() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    })
}

menuBtn.onclick = function() {
    menuList.classList.toggle('show')
}

document.getElementById('promo-link').addEventListener('click', function(event) {
    linkHandler(event, '.promo')
})

document.getElementById('order-link').addEventListener('click', function(event) {
        event.preventDefault()
    document.querySelector('.order').scrollIntoView({
        block: 'center',
        behavior: 'smooth'
    })
})

document.getElementById('contacts-link').addEventListener('click', function(event) {
    linkHandler(event, '.contacts')
})

document.querySelector('.navbar-brand').addEventListener('click', function(event) {
    linkHandler(event, '.main-page')
})

function linkHandler(event, className) {
    event.preventDefault()
    document.querySelector(className).scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    })
}

const btnOrder = document.getElementById('btn-order')

btnOrder.onclick = async function() {
    const form = document.getElementById('form-order')
    const fio = form.fio.value
    const phone = form.phone.value
    const country = form.country.value
    const address = form.address.value
    const applicationInfo = {
        fio,
        phone,
        country,
        address
    }
    const applicationInfoJSON = JSON.stringify(applicationInfo)
    console.log(applicationInfoJSON)
    const response = await fetch('/api/application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: applicationInfoJSON
    })
        
    if (response.ok) {
        console.log(await response.json())
    }
    
}