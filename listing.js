// Function to preview the uploaded image
function previewImage(event) {
    const fileInput = event.target;
    const reader = new FileReader();
    
    reader.onload = function() {
        const imagePlaceholder = document.querySelector('.image-placeholder');
        imagePlaceholder.innerHTML = `<img src="${reader.result}" alt="Item Image" class="preview-img">`;
    }
    
    if (fileInput.files && fileInput.files[0]) {
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Function to handle the form submission
document.querySelector('.list-button').addEventListener('click', function() {
    const itemName = document.querySelector('.form-section input[type="text"]').value;
    const itemDescription = document.querySelector('.form-section textarea').value;
    const price = document.querySelector('.form-section input[type="number"]').value;
    const category = document.querySelector('.form-section input[type="text"]:nth-child(4)').value;
    const fileInput = document.getElementById('file-input');
    const image = fileInput.files[0] ? fileInput.files[0].name : null;

    // Form validation
    if (!itemName || !itemDescription || !price || !category) {
        alert("Please fill in all fields.");
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    // Show a confirmation or preview of the listing
    alert(`Your item has been listed! \n\nName: ${itemName} \nDescription: ${itemDescription} \nPrice: $${price} \nCategory: ${category} \nImage: ${image || 'No image uploaded'}`);

    // Clear the form
    document.querySelector('.form-section input[type="text"]').value = '';
    document.querySelector('.form-section textarea').value = '';
    document.querySelector('.form-section input[type="number"]').value = '';
    document.querySelector('.form-section input[type="text"]:nth-child(4)').value = '';
    document.querySelector('.image-placeholder').innerHTML = '<p>Click to upload an image</p>';
    fileInput.value = '';
});
