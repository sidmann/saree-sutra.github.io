import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
    import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
    import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "";

    const firebaseConfig = {
          apiKey: "AIzaSyDtX4OWk4DBn5f_APfGcwiwI6qMXBCKfhk",
          authDomain: "myfireapp-8d543.firebaseapp.com",
        //   databaseURL: "https://myfireapp-8d543-default-rtdb.firebaseio.com",
          projectId: "myfireapp-8d543",
          storageBucket: "myfireapp-8d543.appspot.com",
          messagingSenderId: "484285304427",
          appId: "1:484285304427:web:54c53464c02f04a4646b2e"
        };

    // Initialize firebase
    const app = initializeApp(firebaseConfig);
    const database = getFirestore(app);
    const auth = getAuth();

    document.getElementById('signupForm').addEventListener('submit', submitForm);

    // Submit form
    async function submitForm(e) {
        e.preventDefault();

        // Get values
        const firstName = getInputVal('firstName');
        const lastName = getInputVal('lastName');
        const phoneNumber = getInputVal('phoneNumber');
        const email = getInputVal('email');
        const password = getInputVal('password');
        const role = "User";

        console.log(firstName, lastName, phoneNumber, email, password, role);

        // Perform validation
        const firstNameValid = validateFirstName(firstName);
        const lastNameValid = validateLastName(lastName);
        const phoneNumberValid = validatePhoneNumber(phoneNumber);
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);

        // Display error
        displayError('firstNameError', firstNameValid, 'Please enter a valid first name');
        displayError('lastNameError', lastNameValid, 'Please enter a valid last name');
        displayError('phoneNumberError', phoneNumberValid, 'Please enter a valid phone number');
        displayError('emailError', emailValid, 'Please enter a valid email');
        displayError('passWordError', passwordValid, 'Please enter a valid password');

        // Send message values to Firestore
        if (firstNameValid && lastNameValid && phoneNumberValid && emailValid && passwordValid) {
            console.log(firstName, lastName, phoneNumber, email, password, role);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const uid = user.uid; // Get the UID from Firebase Authentication

                // Save user data to Firestore
                const usersRef = collection(database, "users");
                const userDocRef = doc(usersRef, uid); // Reference to the user's document using UID
                const encryptedPassword = encPass(password);

                await setDoc(userDocRef, {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: email,
                    password: encryptedPassword,
                    role: role
                });

                //email verification

                // Show success alert
                document.querySelector('.alert').style.display = 'block';

                // Hide alert after 3 seconds
                setTimeout(function(){
                        document.querySelector('.alert').style.display = 'none';
                    }, 3000);

                // Clear form
                document.getElementById('signupForm').reset();
            } catch (error) {
                console.error("Create user error:", error);
                // Handle error appropriately (e.g., display an error message to the user)
            }
        }
    }

    // Function to get form values
    function getInputVal(id) {
        return document.getElementById(id).value;
    }

    // Encrypt password
    function encPass(password) {
        const secretKey = "yourSecretKey";
        const encryptPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
        console.log(encryptPassword);
        return encryptPassword;
    }

    // Validation functions
    function validateFirstName(firstName) {
        return firstName;
    }

    function validateLastName(lastName) {
        return lastName;
    }

    function validatePhoneNumber(phoneNumber) {
        const phoneNumberPattern = /^\d{10}$/;
        return phoneNumberPattern.test(phoneNumber);
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validatePassword(password) {
        return password.length >= 3;
    }

    // Function to display error messages
    function displayError(errorElementId, isValid, errorMessage) {
        const errorElement = document.getElementById(errorElementId);
        if (!isValid) {
            errorElement.textContent = errorMessage;
        } else {
            errorElement.textContent = '';
        }
    }