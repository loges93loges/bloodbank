import { db, auth } from "./firebase-config.js";
import { collection, addDoc } from "firebase/firestore";

// Function to submit a new blood request
async function submitBloodRequest(bloodGroup, location, contact) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to submit a blood request.");
        return;
    }

    try {
        const requestRef = collection(db, "bloodRequests");
        await addDoc(requestRef, {
            userId: user.uid, // Store the user ID
            bloodGroup: bloodGroup,
            location: location,
            contact: contact,
            timestamp: new Date().toISOString(),
        });

        alert("Blood request submitted successfully!");
    } catch (error) {
        console.error("Error submitting blood request:", error);
        alert("Failed to submit request. Please try again.");
    }
}

// Example Usage
document.getElementById("submitRequestBtn").addEventListener("click", () => {
    const bloodGroup = document.getElementById("bloodGroup").value;
    const location = document.getElementById("location").value;
    const contact = document.getElementById("contact").value;

    submitBloodRequest(bloodGroup, location, contact);
});
