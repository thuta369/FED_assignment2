document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission for demo purposes

    alert("Thank you! We have received your message, we will contact you soon.");
    
    this.reset();
});
