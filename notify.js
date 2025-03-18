import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCft2x1RtggYhMJ_YzQI8j0QwDWkxHbDKY",
    authDomain: "bloodlink-de41e.firebaseapp.com",
    projectId: "bloodlink-de41e",
    storageBucket: "bloodlink-de41e.firebasestorage.app",
    messagingSenderId: "857063136838",
    appId: "1:857063136838:web:230e4953530a447306b447"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Display Donor Data
async function displayDonorData() {
    const donorTable = document.getElementById("donor-data");

    try {
        const donorSnapshot = await getDocs(collection(db, "donors"));
        donorSnapshot.forEach(docSnapshot => {
            const donor = docSnapshot.data();
            const contactNumber = donor.contact;

            const row = `
                <tr>
                    <td>${donor.name}</td>
                    <td>${donor.age}</td>
                    <td>${donor.gender}</td>
                    <td>${donor.bloodGroup}</td>
                    <td>${donor.contact}</td>
                    <td>${donor.address}</td>
                    <td>${donor.availability}</td>
                    <td>
                        <button onclick="markAsDonated('${contactNumber}')">
                            Donated
                        </button>
                    </td>
                </tr>
            `;
            donorTable.innerHTML += row;
        });
    } catch (error) {
        console.error("❌ Error fetching donor data:", error);
    }
}

// Fetch Any Available Requestor
async function getRequestorDetails() {
    const bloodRequestsRef = collection(db, "bloodRequests");

    const querySnapshot = await getDocs(bloodRequestsRef);

    if (!querySnapshot.empty) {
        const requestorData = querySnapshot.docs[0].data();
        return {
            requestorName: requestorData.name || "Unknown",
            requestorAddress: requestorData.address || "Unknown"
        };
    } else {
        console.warn("❗ No requestor data available.");
        return null;
    }
}

// Mark Donor as Donated
window.markAsDonated = async (contactNumber) => {
    const donorsRef = collection(db, "donors");

    try {
        const donorSnapshot = await getDocs(donorsRef);

        const donorDoc = donorSnapshot.docs.find(doc => doc.data().contact === contactNumber)?.ref;
        const donorData = donorSnapshot.docs.find(doc => doc.data().contact === contactNumber)?.data();

        if (donorDoc && donorData) {
            const requestorDetails = await getRequestorDetails();

            if (requestorDetails) {
                const newDonation = {
                    date: new Date().toISOString().split('T')[0],
                    requestorName: requestorDetails.requestorName,
                    requestorAddress: requestorDetails.requestorAddress
                };

                const updatedHistory = donorData.donationHistory
                    ? [...donorData.donationHistory, newDonation]
                    : [newDonation];

                await updateDoc(donorDoc, {
                    donationHistory: updatedHistory,
                    donationCount: (donorData.donationCount || 0) + 1
                });

                alert("✅ Donation marked successfully!");
                displayDonorData();  // Refresh data after marking
            } else {
                alert("❗ No requestor data available.");
            }
        } else {
            console.error("❌ Donor not found. Please check the contact number.");
        }
    } catch (error) {
        console.error("❌ Error updating donor data:", error);
    }
};

// Load donor data when the page loads
window.addEventListener("DOMContentLoaded", displayDonorData);
