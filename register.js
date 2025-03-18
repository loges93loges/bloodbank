import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCft2x1RtggYhMJ_YzQI8j0QwDWkxHbDKY",
    authDomain: "bloodlink-de41e.firebaseapp.com",
    projectId: "bloodlink-de41e",
    storageBucket: "bloodlink-de41e.appspot.com", // ✅ Corrected storage bucket
    messagingSenderId: "857063136838",
    appId: "1:857063136838:web:230e4953530a447306b447"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle Donor Registration Form Submission
document.getElementById("donorForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const donorData = {
        name: document.getElementById("donorName").value,
        age: document.getElementById("donorAge").value,
        gender: document.getElementById("donorGender").value,
        address: document.getElementById("donorAddress").value,
        bloodGroup: document.getElementById("donorBloodGroup").value,
        contact: document.getElementById("donorContact").value,
        availability: document.getElementById("donorAvailability").value
    };

    try {
        // ✅ Save Donor Data in "donors" collection
        const donorRef = await addDoc(collection(db, "donors"), donorData);

        // ✅ Also Save Donor Data in "notifications" collection for visibility
        await setDoc(doc(db, "notifications", donorRef.id), {
            ...donorData,
            status: "New Registration"
        });

        alert("✅ Registration Successful!");
        window.location.href = "notifications.html"; // Redirect to notifications page
    } catch (error) {
        console.error("❌ Error registering donor:", error);
        alert("❌ Registration failed. Please try again.");
    }
});
