document.getElementById('addItem').addEventListener('click', function () {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.innerHTML = `
        <input type="text" name="description" placeholder="Description" required>
        <input type="number" name="quantity" placeholder="Quantity" required>
        <input type="number" name="price" placeholder="Unit Price" required>
    `;
    document.getElementById('items').appendChild(itemDiv);
});

document.getElementById('invoiceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const invoiceData = {
        companyName: form.companyName.value,
        clientName: form.clientName.value,
        invoiceDate: form.invoiceDate.value,
        items: Array.from(form.querySelectorAll('.item')).map(item => ({
            description: item.querySelector('input[name="description"]').value,
            quantity: item.querySelector('input[name="quantity"]').value,
            price: item.querySelector('input[name="price"]').value
        }))
    };

    fetch('/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error:', error));
});
