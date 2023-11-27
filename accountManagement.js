import { app } from './firebase-main.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "/firebase-auth.js";
import { getDatabase, ref, set, get } from "/firebase-database.js";
import { loadFolderEventListener } from "/folders.js";

const auth = getAuth(app);
const database = getDatabase(app);


/*
Purpose: replace html with a login menu or register menu
*/
function replaceAccountMenuWithLogin() {
    console.log("On function replaceAccountMenuWithLogin().");
    //1. Get the menu table from popup.html.
    const accountMenu = document.querySelector(".accountMenu");
    //2. Create a login menu using the table element.
    const loginMenu = document.createElement("table");
    //2. Below is the table to be added into the html document.
    //Row1: Email text with input box. Row2: Password text and input box. Row3: Login button.
    loginMenu.classList.add("loginMenu");
    loginMenu.innerHTML = `
        <tr>
            <td>EMAIL:</td>
            <td><input type="text" id="email"></td>
        </tr>
        <tr>
            <td>PASSWORD:</td>
            <td><input type="password" id="password"></td>
        </tr>
        <tr>
            <td><button id="tryLogin">Login</td>
            <td><button id="forgotPassword">Forgot Password?</td>
        </tr>
    `;
    //2. the accountMenu table in popup.html is being replaced with the loginMenu table above.
    accountMenu.parentNode.replaceChild(loginMenu, accountMenu);
    console.log("Replaced accountMenu with loginMenu.");
    //3. the loginMenu table css properties
    loginMenu.style.display = "flex";
    loginMenu.style.justifyContent = "center";
    loginMenu.style.alignItems = "center";
    loginMenu.style.height = "100vh";
    //4. Get the login button.
    const tryLoginButton = document.getElementById('tryLogin');
    //4. Add event listener to login button. call tryLogin().
    tryLoginButton.addEventListener('click', tryLogin);
}
function replaceAccountMenuwithRegister() {
    //1. get the popup menu
    const accountMenu = document.querySelector(".accountMenu");
    //1. Create a new table to serve as the menu for registering users.
    const registerMenu = document.createElement("table");
    //1. add a class to the register menu.
    registerMenu.classList.add("registerMenu");
    //1. registerMenu HTML code
    registerMenu.innerHTML = `
    <tr>
        <td>EMAIL:</td>
        <td><input type="text" id="email"></td>
    </tr>
    <tr>
        <td>PASSWORD:</td>
        <td><input type="password" id="password"></td>
    </tr>
    <tr>
        <td>CONFIRM PASSWORD:</td>
        <td><input type="password" id="confirmedPassword"></td>
    </tr>
    <tr>
        <td><button id="tryRegister">Register</td>
    </tr>
`;
    //1. replace the popup accountMenu with the registerMenu
    accountMenu.parentNode.replaceChild(registerMenu, accountMenu);
    console.log("Added register menu.");
    //style the registerMenu
    registerMenu.style.display = "flex";
    registerMenu.style.justifyContent = "center";
    registerMenu.style.alignItems = "center";
    registerMenu.style.height = "100vh";
}


//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
/*
Purpose: find the user in the database, if they are there then add them to chrome storage with status "active"
if they aren't there then send an error
*/
function tryLogin() {

    //1. get the email and password from the input boxes
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    //1. trim them
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    //2. the email and password input boxes were NOT empty
    if (email !== "" && password !== "") {
        console.log("Trying login with email " + email + " and password " + password + ".");

        //use email and password to authenticate the user
        //if successful then add user to the database
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                //define user, userID
                const user = userCredential.user;
                const userId = user.uid;

                //get a referene for the user in the database using userid
                const userRef = ref(database, `users/${userId}`);
                get(userRef)

                    .then((snapshot) => {

                        //if the user is in the database
                        if (snapshot.exists()) {

                            console.log("User is in the system.");

                            //get the userdata from the snapshot to the database
                            const userData = snapshot.val();

                            if (user.emailVerified) {

                                const chromeUserData = {
                                    email: userData.email,
                                    userid: userData.userid,
                                    status: "active"
                                };
    
                                //in chrome storage, set the userdata
                                chrome.storage.sync.set({ userData: chromeUserData });
    
                                //remove the loginMenu table
                                const loginMenu = document.querySelector(".loginMenu");
                                loginMenu.remove();
    
                                //add folder navigation and loading notes text
                                addFolderNav();
    
                                //add ManageAccount button to the top bar
                                addManageAccountButton();


                                loadFolderEventListener("login", userId);
                            } else {
                                alert("Please verify your email before continuing with notelee.");
                            }



                            //chromeuserdata is the data being added to chrome storage
                            //make the status active since the user is currently using the plugin
                           
                        }
                        else {

                            //if user is not in the database
                            console.log("User not in database");
                        }
                    })

                    //if any error from firebase
                    .catch((error) => {
                        alert("Error getting user data from Firebase: ", error);
                    })

            })

            //if authentication fails
            .catch((error) => {
                alert("Authentication failed. " + error.message);
            });
    }

    //if user left the input fields blank
    else {
        //send an alert to let them know
        alert("Please provide both email and password.");
    }
}



//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
1.Replace the popup menu with a register menu.
2.Ceate function for when the register button is clicked.
4. Create rules for the register input boxes.
5.if they pass the rules, load folder1.
*/

function register() {
    console.log("On register().");

    //replace html
    replaceAccountMenuwithRegister();

    //add event listener to tryRegister
    const tryRegister = document.getElementById('tryRegister');
    tryRegister.addEventListener('click', function () {
        console.log("On tryRegister().");

        // Retrive the texts entered in all 3 input boxes.
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const passConfirm = document.getElementById('confirmedPassword');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmedPassword = passConfirm.value.trim();


        //Create rules for what can and cannot be entered.
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
        }
        else if (!email.includes('@')) {
            alert("Please provide a valid email address.");
        }
        else if (password !== confirmedPassword) {
            alert("Passwords do not match.");
        }

        //if all fields are correct then continue
        else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {

                    const user = userCredential.user;


                    console.log("Trying to reigster with " + email + ", " + password);

                    //create the user in the database using the email and password


                    const userData = {
                        userid: user.uid,
                        email: user.email,
                        password: password,
                        folder1: [],
                        folder2: [],
                        folder3: [],
                        folder4: []
                    };

                    //use chrome storage to save the user with an active status
                    const chromeUserData = {
                        email: email,
                        userid: user.uid,
                        status: ""
                    };
                    chrome.storage.sync.set({ userData: chromeUserData });

                    //set the user's data 
                    const userRef = ref(database, `users/${user.uid}`);

                    //if it works..
                    set(userRef, userData).then(() => {
                        alert("User data added to database.");
                        location.reload();
                    }).catch((error) => {
                        //if it doesnt work
                        console.error("Error adding user data: ", error);
                    });


                    sendEmailVerification(user)
                        .then(() => {
                            console.log("accountManagement.js: email verification sent to " + email + "...");
                            alert("Email verification sent! Please check your email to verify your account.");

                        })
                        .catch((error) => {
                            alert(error);
                        });




                })
                .catch((error) => {
                    alert("Registration failed: " + error.message);
                });

        }
    });
}
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
export function addFolderNav() {
    const folderNavHTML = `
    <div class="folderNav" style="background-color: white; width: 100%; 
    margin-top: 47px;">
        <button id="folder1" style="background-color: #add8e6;">Folder 1</button>
        <button id="folder2" style="background-color: #add8e6;">Folder 2</button>
        <button id="folder3" style="background-color: #add8e6;">Folder 3</button>
        <button id="folder4" style="background-color: #add8e6;">Folder 4</button>
    </div>
    `;
    //if the folder nav is somehow not on the screen already, add it.
    const folderNav = document.querySelector('.folderNav');
    if (!folderNav) {
        document.body.innerHTML += folderNavHTML;
    }

    console.log("Added foldernav.");
}


export function addManageAccountButton() {
    const navbar = document.querySelector(".navbar");
    const ManageAccountButton = document.createElement("button");
    
    const image = document.createElement("img");
    image.src = "https://static-00.iconduck.com/assets.00/person-icon-486x512-eeiy7owm.png";

    image.style.width = "25px";
    image.style.height = "25px";

    // Add the image to the button
    ManageAccountButton.appendChild(image);

    // Set button properties
    ManageAccountButton.id = 'ManageAccount';
    ManageAccountButton.style.width = "25px";
    ManageAccountButton.style.height = "25px";
    ManageAccountButton.style.backgroundSize = "contain";
    ManageAccountButton.style.marginRight = "10px";


    // Add the button to the navbar
    navbar.appendChild(ManageAccountButton);

    console.log("Added ManageAccount button.");
}


/*
Here, we get the login button and the register button from the popup menu.
When either is clicked, call their respective functions.
*/

const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");


loginButton.addEventListener("click", replaceAccountMenuWithLogin);
registerButton.addEventListener("click", register);
