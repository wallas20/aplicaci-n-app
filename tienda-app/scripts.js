let products = [];
let registros = {};
let selectedProducts = {}; // Mantener un objeto de productos seleccionados y sus cantidades

document.addEventListener('DOMContentLoaded', () => {
    setDateToToday();
    setTimeToNow();
    renderMonths();
    setInterval(setTimeToNow, 60000); // Actualizar cada minuto
    setInterval(setDateToToday, 86400000); // Actualizar cada día
});

function setDateToToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateInput = document.getElementById('selected-date');
    if (dateInput) {
        dateInput.value = formattedDate;
    }
}

function setTimeToNow() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    const timeInput = document.getElementById('selected-time');
    if (timeInput) {
        timeInput.value = formattedTime;
    }
}

function updateSelectedDate() {
    const selectedDate = document.getElementById('selected-date').value;
    console.log('Fecha seleccionada:', selectedDate);
}

function updateSelectedTime() {
    const selectedTime = document.getElementById('selected-time').value;
    console.log('Hora seleccionada:', selectedTime);
}

function openConfigAuth() {
    document.getElementById('calendar-view').classList.add('hidden');
    document.getElementById('config-auth-view').classList.remove('hidden');
    document.getElementById('config-view').classList.add('hidden');
    document.getElementById('registro-view').classList.add('hidden');
}

function authenticateConfig() {
    const password = document.getElementById('config-password').value;
    if (password === 'Junior13457954613762') {
        document.getElementById('config-auth-view').classList.add('hidden');
        document.getElementById('config-view').classList.remove('hidden');
        document.getElementById('config-password').value = ''; // Limpiar la contraseña
    } else {
        alert('Contraseña incorrecta');
    }
}

function toggleEditDateTime(checkbox) {
    const dateInput = document.getElementById('selected-date');
    const timeInput = document.getElementById('selected-time');
    dateInput.disabled = !checkbox.checked;
    timeInput.disabled = !checkbox.checked;
}

function openRegistro() {
    document.getElementById('calendar-view').classList.add('hidden');
    document.getElementById('config-auth-view').classList.add('hidden');
    document.getElementById('config-view').classList.add('hidden');
    document.getElementById('registro-view').classList.remove('hidden');
    document.getElementById('months').classList.remove('hidden');
    document.getElementById('days').classList.add('hidden');
    document.getElementById('day-records').classList.add('hidden');
}

function goBack() {
    document.getElementById('calendar-view').classList.remove('hidden');
    document.getElementById('config-auth-view').classList.add('hidden');
    document.getElementById('config-view').classList.add('hidden');
    document.getElementById('registro-view').classList.add('hidden');
}

function openProductSelect() {
    const productList = document.createElement('div');
    productList.className = 'product-list';

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 1;
        quantityInput.value = selectedProducts[product.name] ? selectedProducts[product.name].quantity : 1;
        quantityInput.id = `product-quantity-${index}`;

        const productLabel = document.createElement('label');
        productLabel.innerText = `${product.name} - S/${product.cost}`;
        productLabel.setAttribute('for', `product-quantity-${index}`);

        const productCheckbox = document.createElement('input');
        productCheckbox.type = 'checkbox';
        productCheckbox.id = `product-select-${index}`;
        if (selectedProducts[product.name]) {
            productCheckbox.checked = true;
        }

        productDiv.appendChild(quantityInput);
        productDiv.appendChild(productLabel);
        productDiv.appendChild(productCheckbox);
        productList.appendChild(productDiv);
    });

    // Opción de producto adicional
    addAdditionalProductOption(productList);

    const selectButton = document.createElement('button');
    selectButton.className = 'select-button';
    selectButton.innerText = 'Seleccionar';
    selectButton.onclick = selectProducts;

    const productModal = document.createElement('div');
    productModal.className = 'modal';
    productModal.appendChild(productList);
    productModal.appendChild(selectButton);
    productModal.onclick = (e) => {
        if (e.target === productModal) {
            closeModal(productModal);
        }
    };

    document.body.appendChild(productModal);
}

function addAdditionalProductOption(productList) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.id = 'additional-product-quantity';

    const productNameInput = document.createElement('input');
    productNameInput.type = 'text';
    productNameInput.placeholder = 'Otros';
    productNameInput.id = 'additional-product-name';

    const productCostInput = document.createElement('input');
    productCostInput.type = 'number';
    productCostInput.min = 0;
    productCostInput.placeholder = 'S/';
    productCostInput.id = 'additional-product-cost';

    const productCheckbox = document.createElement('input');
    productCheckbox.type = 'checkbox';
    productCheckbox.id = 'additional-product-select';
    productCheckbox.onclick = () => validateAdditionalProduct();

    productDiv.appendChild(quantityInput);
    productDiv.appendChild(productNameInput);
    productDiv.appendChild(productCostInput);
    productDiv.appendChild(productCheckbox);
    productList.appendChild(productDiv);
}

function validateAdditionalProduct() {
    const additionalCheckbox = document.getElementById('additional-product-select');
    const additionalNameInput = document.getElementById('additional-product-name');
    const additionalCostInput = document.getElementById('additional-product-cost');

    if (additionalCheckbox.checked) {
        if (!additionalNameInput.value || !additionalCostInput.value) {
            alert('Por favor, complete el nombre y el costo del producto adicional.');
            additionalCheckbox.checked = false;
        } else {
            addAdditionalProductOption(document.querySelector('.product-list'));
        }
    }
}

function closeModal(modal) {
    document.body.removeChild(modal);
}

function selectProducts() {
    products.forEach((product, index) => {
        const checkbox = document.getElementById(`product-select-${index}`);
        const quantityInput = document.getElementById(`product-quantity-${index}`);
        if (checkbox && checkbox.checked) {
            const quantity = quantityInput ? quantityInput.value : 1;
            selectedProducts[product.name] = { cost: product.cost, quantity: quantity };
        } else {
            delete selectedProducts[product.name];
        }
    });

    // Producto adicional
    const additionalProducts = document.querySelectorAll('.product-item');
    additionalProducts.forEach(productDiv => {
        const additionalCheckbox = productDiv.querySelector('#additional-product-select');
        if (additionalCheckbox && additionalCheckbox.checked) {
            const name = productDiv.querySelector('#additional-product-name').value;
            const cost = productDiv.querySelector('#additional-product-cost').value;
            const quantity = productDiv.querySelector('#additional-product-quantity').value;
            if (name && cost) {
                selectedProducts[name] = { cost: cost, quantity: quantity };
            }
        }
    });

    const selectedProductsDiv = document.getElementById('selected-products');
    selectedProductsDiv.innerHTML = ''; // Limpiar los productos seleccionados previamente

    for (const [name, info] of Object.entries(selectedProducts)) {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `<strong>${name}</strong> - S/${info.cost} x${info.quantity}`;
        productDiv.onclick = () => removeProduct(productDiv, name);
        selectedProductsDiv.appendChild(productDiv);
    }

    closeModal(document.querySelector('.modal'));
}

function removeProduct(productDiv, productName) {
    delete selectedProducts[productName];
    productDiv.remove();
}

function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const cost = document.getElementById('product-cost').value;

    products.push({ name, cost });

    document.getElementById('product-form').reset();
    renderProductList();
}

function renderProductList() {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = '';

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.innerText = `${product.name} - S/${product.cost}`;
        productDiv.onclick = () => modifyProduct(index);
        productListDiv.appendChild(productDiv);
    });
}

function modifyProduct(index) {
    const newName = prompt("Modificar nombre del producto:", products[index].name);
    const newCost = prompt("Modificar costo del producto:", products[index].cost);
    if (newName !== null && newCost !== null) {
        products[index].name = newName;
        products[index].cost = Number(newCost);
        renderProductList();
    }
}

function submitData() {
    const persona = document.getElementById('persona').value;
    const paciente = document.getElementById('paciente').value;
    const hora = document.getElementById('selected-time').value;
    const selectedDate = document.getElementById('selected-date').value;

    if (persona === '' || paciente === '' || selectedDate === '' || hora === '') {
        alert('Por favor, complete todos los campos antes de enviar.');
        return;
    }

    const selectedProductsArray = Object.entries(selectedProducts).map(([name, info]) => `${name} - S/${info.cost} x${info.quantity}`);

    if (selectedProductsArray.length === 0) {
        alert('Por favor, seleccione al menos un producto antes de enviar.');
        return;
    }

    // Confirmación antes de enviar
    const confirmacion = confirm('¿Está seguro que desea enviar estos datos?');
    if (!confirmacion) {
        return;
    }

    const registro = {
        persona,
        paciente,
        hora,
        productos: selectedProductsArray,
        fecha: selectedDate
    };

    if (!registros[selectedDate]) {
        registros[selectedDate] = [];
    }
    registros[selectedDate].push(registro);

    console.log('Datos subidos:', registro);
    alert('Datos subidos');

    // Limpiar productos seleccionados y los campos de paciente, pero no el nombre de la persona
    document.getElementById('paciente').value = '';
    selectedProducts = {};
    document.getElementById('selected-products').innerHTML = '';

    // Deshabilitar el botón de envío
    const submitButton = document.getElementById('submit');
    submitButton.disabled = true;
    setTimeout(() => {
        submitButton.disabled = false;
    }, 1000); // Habilitar después de 1 segundo, o ajustar según sea necesario
}

function renderMonths() {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthsDiv = document.getElementById('months');
    monthsDiv.innerHTML = '';
    months.forEach((month, index) => {
        const monthDiv = document.createElement('div');
        monthDiv.innerText = month;
        monthDiv.onclick = () => openMonth(index + 1);
        monthsDiv.appendChild(monthDiv);
    });
}

function openMonth(month) {
    document.getElementById('days').classList.remove('hidden');
    document.getElementById('months').classList.add('hidden');
    document.getElementById('selected-month').innerText = `Mes ${month}`;
    renderDays(month);
}

function goBackToMonths() {
    document.getElementById('days').classList.add('hidden');
    document.getElementById('months').classList.remove('hidden');
}

function renderDays(month) {
    const daysList = document.getElementById('days-list');
    daysList.innerHTML = '';
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        const date = `${year}-${formattedMonth}-${formattedDay}`;
        const dayDiv = document.createElement('div');
        dayDiv.innerText = date;
        dayDiv.onclick = () => openDay(date);
        daysList.appendChild(dayDiv);
    }
}

function openDay(date) {
    document.getElementById('day-records').classList.remove('hidden');
    document.getElementById('days').classList.add('hidden');
    document.getElementById('selected-day').innerText = date;
    renderDayRecords(date);
}

function goBackToDays() {
    document.getElementById('day-records').classList.add('hidden');
    document.getElementById('days').classList.remove('hidden');
}

function renderDayRecords(date) {
    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = '';
    const dayRecords = registros[date] || [];
    let totalVentas = 0;

    dayRecords.forEach(record => {
        const recordDiv = document.createElement('div');
        recordDiv.innerHTML = `<div><strong>Persona:</strong> ${record.persona}, <strong>Paciente:</strong> ${record.paciente}, Hora: ${record.hora}</div>`;
        recordDiv.classList.add('bold');
        recordDiv.innerHTML += record.productos.map(product => `<div>${product}</div>`).join('');
        recordsList.appendChild(recordDiv);

        // Calcular el total de ventas
        record.productos.forEach(producto => {
            const parts = producto.split(' ');
            const cost = parseFloat(parts[2].substring(2));
            const quantity = parseInt(parts[3].substring(1));
            totalVentas += cost * quantity;
        });
    });

    // Mostrar el total de ventas
    document.getElementById('total-ventas').innerText = `Total: S/${totalVentas}`;
}
