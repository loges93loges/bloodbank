import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
    import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
    
    const firebaseConfig = {
        apiKey: "AIzaSyCft2x1RtggYhMJ_YzQI8j0QwDWkxHbDKY",
        authDomain: "bloodlink-de41e.firebaseapp.com",
        projectId: "bloodlink-de41e",
        storageBucket: "bloodlink-de41e.appspot.com",
        messagingSenderId: "857063136838",
        appId: "1:857063136838:web:230e4953530a447306b447"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    async function fetchBloodCamps() {
        let campList = document.getElementById("camp-list");
        campList.innerHTML = "Loading...";

        try {
            const querySnapshot = await getDocs(collection(db, "campRegistered"));
            let count = querySnapshot.size;
            document.getElementById("notification-count").innerText = count;

            if (count === 0) {
                campList.innerHTML = "<p>No blood camps registered.</p>";
            } else {
                campList.innerHTML = "";
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    let campItem = `
                        <div class="camp-item">
                            <h4>${data.campName}</h4>
                            <p><b>Organizer:</b> ${data.organizerName}</p>
                            <p><b>Location:</b> ${data.city}, ${data.state}</p>
                            <p><b>Dates:</b> ${data.startDate} - ${data.endDate}</p>
                        </div>
                        <hr>
                    `;
                    campList.innerHTML += campItem;
                });
            }
        } catch (error) {
            console.error("Error fetching blood camps:", error);
            campList.innerHTML = "<p>Error loading camps.</p>";
        }
    }

    // Fetch data on page load
    window.onload = fetchBloodCamps;



// Carousel Effect
function initCarousel() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');

    function showSlides() {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[slideIndex].classList.add('active');
        slideIndex = (slideIndex + 1) % slides.length;
        setTimeout(showSlides, 4000);
    }

    showSlides();
}
  
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

