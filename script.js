   // Smooth Scroll for Contact Section
    document.querySelector('a[href="#contact-section"]').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
    });






// Password Strength Meter
const passwordInput = document.getElementById("signup-password");
const strengthMeter = document.getElementById("strengthMeter").firstElementChild;

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    const strength = calculateStrength(password);
    
    strengthMeter.style.width = strength + "%";
    strengthMeter.style.backgroundColor = getStrengthColor(strength);
});
// Calculate Strength
function calculateStrength(password) {
    let strength = 0;
    if (password.length > 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
}
// Get Strength Color
function getStrengthColor(strength) {
    if (strength < 50) return "#e74c3c"; // Weak
    if (strength < 75) return "#f39c12"; // Medium
    return "#2ecc71"; // Strong
}


