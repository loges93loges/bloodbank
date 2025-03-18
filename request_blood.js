window.onload = function () {
    const form = document.getElementById("requestForm");
    const submitBtn = document.getElementById("submitBtn");
    const inputs = form.querySelectorAll("input, select");
    
    const errorMessages = {
        name: "Name must be at least 3 characters.",
        address: "Address cannot be empty.",
        bloodGroup: "Please select a blood group.",
        contact: "Enter a valid 10-digit phone number.",
        age: "Age must be between 18 and 65.",
        gender: "Please select a gender."
    };
    
    function showError(input, message) {
        let errorDiv = input.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains("error")) {
            errorDiv = document.createElement("div");
            errorDiv.classList.add("error");
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
        errorDiv.textContent = message;
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "12px";
        errorDiv.style.marginTop = "5px";
    }
    
    function clearError(input) {
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains("error")) {
            errorDiv.textContent = "";
        }
    }
    
    function validateInput(input) {
        let isValid = true;
        const value = input.value.trim();
        
        switch (input.id) {
            case "name":
                if (value.length < 3) {
                    showError(input, errorMessages.name);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;
            case "address":
                if (value === "") {
                    showError(input, errorMessages.address);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;
            case "bloodGroup":
                if (value === "") {
                    showError(input, errorMessages.bloodGroup);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;
            case "contact":
                if (!/^[0-9]{10}$/.test(value)) {
                    showError(input, errorMessages.contact);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;
            case "age":
                if (value < 18 || value > 65) {
                    showError(input, errorMessages.age);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;
            case "gender":
                if (value === "") {
                    showError(input, errorMessages.gender);
                    isValid = false;
                } else {
                    clearError(input);
                }
                break;
        }
        return isValid;
    }
    
    function checkForm() {
        let allValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                allValid = false;
            }
        });
        submitBtn.disabled = !allValid;
    }
    
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            validateInput(input);
            checkForm();
        });
    });
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const requestData = {
            name: form.name.value,
            address: form.address.value,
            bloodGroup: form.bloodGroup.value,
            contact: form.contact.value,
            age: form.age.value,
            gender: form.gender.value,
            timestamp: new Date().toISOString()
        };
        
        try {
            const response = await fetch("https://bloodlink-backend-dk99.onrender.com/api/requests", {  
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });
            
            
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Something went wrong!");
            }
            
            alert("✅ " + result.message);
            form.reset();
            checkForm();
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("❌ Failed to submit request: " + error.message);
        }
    });
    
    checkForm();
};
