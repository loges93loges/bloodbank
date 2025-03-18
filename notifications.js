import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCft2x1RtggYhMJ_YzQI8j0QwDWkxHbDKY",
    authDomain: "bloodlink-de41e.firebaseapp.com",
    projectId: "bloodlink-de41e",
    storageBucket: "bloodlink-de41e.appspot.com",
    messagingSenderId: "857063136838",
    appId: "1:857063136838:web:230e4953530a447306b447"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simulated logged-in user ID (Replace this with actual donor's user ID from authentication)
const loggedInUserId = "USER_ID_HERE"; 

// ✅ Check if the donor is registered
async function isDonorRegistered(userId) {
    try {
        const donorRef = doc(db, "donors", userId);
        const donorDoc = await getDoc(donorRef);
        return donorDoc.exists();
    } catch (error) {
        console.error("Error checking donor registration:", error);
        return false;
    }
}

// ✅ Check if data already exists in notifications
async function isNotificationAlreadySent(requestId) {
    const notificationRef = doc(db, "notifications", requestId);
    const notificationDoc = await getDoc(notificationRef);
    return notificationDoc.exists();
}

// ✅ Handle "Accept" button click
async function handleAcceptClick(event) {
    const requestId = event.target.getAttribute("data-id");

    // Check donor registration status in Firestore
    const isRegistered = await isDonorRegistered(loggedInUserId);

    if (!isRegistered) {
        // Store the request ID temporarily so it can be used after registration
        sessionStorage.setItem("pendingRequestId", requestId);

        // Redirect to donor registration page
        window.location.href = "register.html";
        return;
    }

    // ✅ Check if the donor data is already submitted to notifications
    const alreadySent = await isNotificationAlreadySent(requestId);

    if (alreadySent) {
        alert("✅ Message already sent to blood acceptor successfully!");
        return;
    }

    // ✅ If first time accepting, show input for time
    showTimeInput(event.target, requestId);
}

// ✅ Function to show input for time and submit donor details
function showTimeInput(button, requestId) {
    const parent = button.parentElement;

    // Remove existing inputs if any
    parent.querySelectorAll("input, button.submit-time-btn").forEach(el => el.remove());

    // Create input field
    const timeInput = document.createElement("input");
    timeInput.type = "text";
    timeInput.placeholder = "Time to Reach Destination";
    timeInput.classList.add("time-input");

    // Create submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";
    submitBtn.classList.add("submit-time-btn");

    // Append elements
    parent.appendChild(timeInput);
    parent.appendChild(submitBtn);

    // Handle submission
    submitBtn.addEventListener("click", async () => {
        const timeToReach = timeInput.value.trim();
        if (timeToReach !== "") {
            await setDoc(doc(db, "notifications", requestId), {
                donorId: loggedInUserId,
                timeToReach,
                status: "Submitted"
            });

            // ✅ Clear stored request ID after submission
            sessionStorage.removeItem("pendingRequestId");

            alert("✅ Message sent to blood acceptor successfully!");
        }
    });
}

// ✅ Listen for blood requests and display them
function listenForBloodRequests() {
    console.log("Listening for blood requests...");
    const container = document.getElementById("notifications-container");
    const bloodRequestsQuery = query(collection(db, "bloodRequests"));

    onSnapshot(bloodRequestsQuery, (snapshot) => {
        container.innerHTML = ""; // Clear old content
        if (snapshot.empty) {
            console.log("No blood requests found.");
            container.innerHTML = "<p>No blood requests available.</p>";
            return;
        }

        snapshot.forEach(docSnapshot => {
            const request = docSnapshot.data();
            const requestId = docSnapshot.id;
            console.log("Received data:", request);

            const div = document.createElement("div");
            div.classList.add("notification-item");
            div.innerHTML = `
                <h3>${request.name} needs ${request.bloodGroup}</h3>
                <p>Location: ${request.address}</p>
                <p>Contact: ${request.contact}</p>
                <p>Age: ${request.age} | Gender: ${request.gender}</p>
                <button class="accept-btn" data-id="${requestId}">Accept</button>
                <button class="decline-btn">Decline</button>
            `;

            div.querySelector(".accept-btn").addEventListener("click", handleAcceptClick);
            container.appendChild(div);
        });
    });
}

// ✅ Check if the donor registered after redirection
async function checkPendingRegistration() {
    const pendingRequestId = sessionStorage.getItem("pendingRequestId");
    if (pendingRequestId) {
        const isRegistered = await isDonorRegistered(loggedInUserId);
        if (isRegistered) {
            // Remove stored request ID
            sessionStorage.removeItem("pendingRequestId");

            // Automatically proceed to enter time
            const buttons = document.querySelectorAll(".accept-btn");
            buttons.forEach(button => {
                if (button.getAttribute("data-id") === pendingRequestId) {
                    showTimeInput(button, pendingRequestId);
                }
            });
        }
    }
}

// ✅ Start listening for blood requests when the page loads
window.onload = () => {
    listenForBloodRequests();
    checkPendingRegistration();
};
