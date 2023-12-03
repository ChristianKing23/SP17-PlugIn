/*

This handles logging in and registering for Notelee.

- adds event listeners to the login and register buttons on popup.html

register():
- adds a register menu with an email field, password field, and confirm password field. 
- if the fields look good, create an authenticated user in firebase using their email and password.
- create the user in the realtime database with a unique user id, email, password, and four empty folders.
- set their data in chrome storage: their email, userid, and an empty status.
- send an email verification link to the user's email. they will become verified by clicking the link in the email. reload the plugin to the beginning.

tryLogin():
- gets email and password from login menu.
- if they aren't empty, search for an authenticated user with that email and password. 
- if found with a verified email, set their status as active in chrome storage, then load folder 1.
- if found and they are not verified, then alert them. they cannot continue.

replaceAccountMenuWithLogin() and replaceAccountMenuwithRegister(): replaced the menu in popup.html with a login or register menu.

addManageAccountButton(): adds a icon button to the top right next to the question mark for managing the user's account.

addFolderNav(): adds folder navigation bar
*/



import { app } from './firebase-main.js';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification } from "/firebase-auth.js";
import { getDatabase, ref, set, get, remove } from "/firebase-database.js";
import { loadFolderEventListener, removeNoteCreationScreen, loadFolderNotes, addFolderNav } from "/folders.js";

const auth = getAuth(app);
const database = getDatabase(app);



function replaceAccountMenuWithLogin() { //replaces the welcome menu with a login menu
    console.log("On function replaceAccountMenuWithLogin().");

    const accountMenu = document.querySelector(".accountMenu"); //get welcome menu

    const loginMenu = document.createElement("table"); //create a table for the login menu

    loginMenu.classList.add("loginMenu"); //add a class to it
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
            <td><button id="tryLogin"style="font-family: calibri; font-size: 18px;">Login</td>
            <td><button id="forgotPassword" style="font-family: calibri; font-size: 18px;">Forgot Password?</td>
        </tr>
    `; //html of the login menu

    accountMenu.parentNode.replaceChild(loginMenu, accountMenu); //replace welcome menu with login menu

    loginMenu.style.display = "flex"; //style it
    loginMenu.style.justifyContent = "center";
    loginMenu.style.alignItems = "center";
    loginMenu.style.height = "100vh";
    loginMenu.style.fontFamily = "Calibri";
    loginMenu.style.fontSize = "15px";
    loginMenu.id = "loginMenu"; //give it an id

    const tryLoginButton = document.getElementById('tryLogin'); //get a reference to the login button and the forgot password button
    const forgotPassword = document.getElementById("forgotPassword");

    tryLoginButton.addEventListener('click', tryLogin); //add event listeners to call these functions when the buttons are clicked
    forgotPassword.addEventListener('click', sendPasswordReset);
}

function replaceAccountMenuwithRegister() { //replaces the welome menu with the register menu

    const accountMenu = document.querySelector(".accountMenu"); //get the welcome menu

    const registerMenu = document.createElement("table"); //create a table for the register menu

    registerMenu.classList.add("registerMenu");//give it a class

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
`; //register menu HTML

    accountMenu.parentNode.replaceChild(registerMenu, accountMenu); //replace welcome menu with register menu

    registerMenu.style.display = "flex"; //style it
    registerMenu.style.justifyContent = "center";
    registerMenu.style.alignItems = "center";
    registerMenu.style.height = "100vh";
}

function sendPasswordReset() { //sends a password reset email to the user

    const loginMenu = document.getElementById('loginMenu'); //get the login menu

    loginMenu.remove(); //remove it

    const emailInput = document.createElement('input'); //create an input box for the email
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('placeholder', 'Please enter your email'); //placeholder for the input box

    document.body.appendChild(emailInput); //add it to the document

    const resetButton = document.createElement('button'); //create a button that says rest password
    resetButton.textContent = 'Reset Password';

    resetButton.addEventListener('click', () => { //when the reset password button is clicked

        const email = emailInput.value.trim(); //get the email entered in the input box

        sendPasswordResetEmail(auth, email) //send password reset email to that email
            .then(() => { //if it works...

                alert('Password reset sent to ' + email); //alert

                location.reload(); //reload the plugin so it starts from the beginning
            })
            .catch((error) => { //else, if it does not work...

                console.error('Error sending password reset email:', error); //console the error
            });
    })

    document.body.appendChild(resetButton); //add the reset button to the document below the input box
}

function tryLogin() { //takes the email and password and logs them into notelee

    const emailInput = document.getElementById('email'); //get the email and password boxes
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim(); //get the text entered into those boxes
    const password = passwordInput.value.trim();



    if (email !== "" && password !== "") { //if user entered in text for the email and password..

        console.log("accountManagement.js: Trying login with email " + email + " and password " + password + ".");


        signInWithEmailAndPassword(auth, email, password) //sign in with the email and password using firebase authentication
            .then((userCredential) => { //if they are authenticated...

                const user = userCredential.user; //save the user 
                const userId = user.uid; //save the userid

                const userRef = ref(database, `users/${userId}`); //save the reference of the user in the database
                get(userRef) //get the user

                    .then((snapshot) => {

                        if (snapshot.exists()) { //if the user exists in the database...

                            console.log("accountManagement.js: found user in the database.");

                            const userData = snapshot.val(); //save the user's database data

                            if (user.emailVerified) { //if they verified their email...

                                const chromeUserData = { //save the chrome storage data as their email, userid, and set their status as active
                                    email: userData.email,
                                    userid: userData.userid,
                                    status: "active"
                                };

                                chrome.storage.sync.set({ userData: chromeUserData }); //set the chrome storage data


                                const loginMenu = document.querySelector(".loginMenu"); //get the login menu
                                loginMenu.remove(); //remove it


                                addFolderNav(); //add the folder navigation bar

                                addManageAccountButton(); //add the manage account button


                                loadFolderEventListener("login", userId); //load folder 1

                            } else { //else if the user never verified their email...

                                alert("Please verify your email before continuing with Notelee."); //alert
                            }
                        }
                        else { //else if the user is not in the database...

                            alert("This user is not in the database."); //alert
                        }
                    })
                    .catch((error) => { //if there is an error...
                        alert("Error getting user data from Firebase: ", error); //alert
                    })
            })
            .catch((error) => { //if there is an error...
                alert("Authentication failed. " + error.message); //alert
            });
    }
    else { //else if user left the input fields blank

        alert("Please provide both email and password."); //alert
    }
}

function register() { //registers the user into Notelee

    //replace html
    replaceAccountMenuwithRegister();

    //add event listener to tryRegister
    const tryRegister = document.getElementById('tryRegister');
    tryRegister.addEventListener('click', function () { //when clicked..

        // Retrive the texts entered in all 3 input boxes
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
        else if (!email.includes('@') || !email.includes('.com')) {
            alert("Please provide a valid email address.");
        }
        else if (password !== confirmedPassword) {
            alert("Passwords do not match.");
        }

        //if all fields are correct then continue
        else {
            createUserWithEmailAndPassword(auth, email, password) //create the user with their email and password as an authenticated user in firebase
                .then((userCredential) => {

                    const user = userCredential.user; //save the user's credentials entered
                    sendEmailVerification(user) //send email verification to the user

                        .then(() => { //if it works
                            console.log("accountManagement.js: email verification sent to " + email + "..."); //log it
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                        
                    alert("Email verification sent! Please check your email to verify your account.");


                    console.log("Trying to reigster with " + email + ", " + password);

                    //set the users data to be entered into the database
                    const userData = {
                        userid: user.uid,
                        email: user.email,
                        folder1: [],
                        folder2: [],
                        folder3: [],
                        folder4: []
                    };

                    //use chrome storage to save the user in chrome
                    const chromeUserData = {
                        email: email,
                        userid: user.uid,
                        status: ""
                    };
                    chrome.storage.sync.set({ userData: chromeUserData }); //set it

                    //get a reference for the user 
                    const userRef = ref(database, `users/${user.uid}`);

                    //set the user in the database
                    set(userRef, userData).then(() => { //if it works..

                        location.reload(); //reload the plugin

                    }).catch((error) => { //if there's an error...

                        console.error("Error adding user data: ", error);//log it

                    });

                })
                .catch((error) => { //if theres an error with registration

                    alert("Registration failed: " + error.message); //alert

                });
        }
    });
}

export function addManageAccountButton() { //add the manage account button into the top bar of notelee

    const navbar = document.querySelector(".navbar"); //get the navbar

    const ManageAccountButton = document.createElement("button"); //create the button

    const image = document.createElement("img"); //make the button an image
    image.src = "https://static-00.iconduck.com/assets.00/person-icon-486x512-eeiy7owm.png";

    image.style.width = "25px"; //style the image
    image.style.height = "25px";

    ManageAccountButton.appendChild(image); //add the image to the button

    ManageAccountButton.id = 'ManageAccount'; //style the button
    ManageAccountButton.style.width = "25px";
    ManageAccountButton.style.height = "25px";
    ManageAccountButton.style.backgroundSize = "contain";
    ManageAccountButton.style.marginRight = "10px";
    ManageAccountButton.style.opacity = "0.5";
    ManageAccountButton.style.backgroundColor = "transparent";


    navbar.appendChild(ManageAccountButton); //add it to the top bar

    console.log("Added ManageAccount button.");
}

export function showTutorial() { //function for when the question mark button is clicked

    const tutorialButton = document.getElementById("tutorialButton"); //get the button

    tutorialButton.addEventListener('mouseover', function () { //when hovered make the opacity full
        tutorialButton.style.opacity = '1';
    });

    tutorialButton.addEventListener('mouseout', function () { //when unhovered make it half
        tutorialButton.style.opacity = '0.5';
    });

    tutorialButton.addEventListener("click", function () { //when clicked...

        //create html for the popup window
        const popupHTML = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
        
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notelee Tutorial</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 300px;
                    min-height: 400px;
                    max-height: 400px;
                    overflow-y: auto;
                    flex-direction: column;
        
        
                }
        
        
                .navbar {
                    display: flex;
                    top: 0;
                    position: fixed;
                    justify-content: space-between;
                    align-items: center;
                    width: 350px;
                    background-color: pink;
                    color: white;
                    padding: 10px;
                    border: 1px solid black;
                    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                    font-size: 30px;
        
                }
        .navbar button {
                    background-color: pink;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 0 5px;
                }
                .navbar div {
                    font-weight: bold;
                    margin: 0 auto;
                    border: black;
                }
        .tutorialTable {
            font-family: 'calibri';
            font-size: 17px;
            width: 350px;
            text-align: center;
            margin-top: 450px;
            border-collapse: separate;
            border-spacing: 20px;
        
        }
        
              
            </style>
        
        </head>
        
        <body>
        
            <div class="navbar">
                <div id="noteleeText">Notelee</div>
                <button id="helpButton"></button>
            </div>
        
        <table class="tutorialTable">
        <thead><th>Welcome to Notelee!</th></thead>
        <tr><td>Here is how it works:</td></tr>
        <tr><td>1. After logging in, travel between 4 folders using the folder navigation bar.</td></tr>
        <tr><td><img src="https://i.ibb.co/dBWSVnK/folders.png" alt="folders" border="0"></td></tr>
        <tr><td>2. Create a new note for a folder by hitting the "Create Note" button.</td></tr>
        <tr><td><img src="https://i.ibb.co/zmXcLGF/create-note.png" alt="create-note" border="0"></td></tr>
        <tr><td>3. Delete a note by hitting the red "x" icon to the right of the desired note.</td></tr>
        <tr><td><img src="https://i.ibb.co/TMc5dLR/note-list.png" alt="note-list" border="0"></td></tr>
        <tr><td>4.Sign off and Manage your Account using the top right icon in the top bar.</td></tr>
        <tr><td><img src="https://i.ibb.co/tpqHvWD/account-manage-button.png" alt="account-manage-button" border="0"></td></tr>
        </table>
        
        
        </body>
        
        </html>
        `;

        const popup = window.open('', '_blank', 'width=350,height=700'); //define the popup

        popup.document.write(popupHTML); //write the html code into the popup

    });

}

export function manageAccountEventListener(userId) { //this function is for the manage account button, the person icon on the top right
    let email = "";
    chrome.storage.sync.get(['userData'], function (result) {
        const userdata = result.userData; //save it
        email = userdata.email;
    })


    const ManageAccount = document.getElementById('ManageAccount'); //get the button

    ManageAccount.addEventListener('mouseover', function () { //when mouse is over it, give it full opacity
        ManageAccount.style.opacity = '1';
    });

    ManageAccount.addEventListener('mouseout', function () { //when mouse is not over it, give it half opacity
        ManageAccount.style.opacity = '0.5';
    });

    ManageAccount.addEventListener('click', function () { //when button is clicked...

        //remove note list, no note, and create note button
        const noNotes = document.querySelector('.noNotes');
        const bottombar = document.querySelector('.bottombar');
        const noteList = document.querySelector('.noteList');
        const folderNav = document.querySelector('.folderNav');
        const loadingDisplay = document.getElementById("loadingDisplay");
        removeNoteCreationScreen(); //remove the note creation screen if there

        if (noNotes) {
            noNotes.remove();
        }
        if (bottombar) {
            bottombar.remove();
        }
        if (noteList) {
            noteList.remove();
        }
        if (folderNav) {
            folderNav.remove();
        }
        if (loadingDisplay) {
            loadingDisplay.remove();
        }


        document.body.style.backgroundColor = '#3AA6B9'; //make the background color blue

        //create html for the display
        const manageAccHTML = `
        <table class="manageAccTable" style=" width: 50%; height: 100%; margin-top:15px; padding: 25px;">
        <thead><th><p id="welcomeMessage" style="color: #C1ECE4;font-size: 17px; font-family: calibri;">ff</p></th></thead>
        <tr>
        <td>
        <button id="logOutButton" style="padding: 0px; width: 100%; font-size: 18px; font-family: Calibri; border: 1px solid black; background-color: #87CBB9;">Log Out</button>
        </td>
        </tr>
        <tr>
        <td>
        <button id="deleteAccButton" style=" font-weight:bold; padding: 0px; width: 100%;  font-size: 18px; font-family: Calibri; border: 1px solid black; background-color: #87CBB9;">Delete Account</button>
        </td>
        </tr>
        <tr><td><button id="backButton" style="width: 160px; font-size: 18px; font-family: Calibri; border: 1px solid black; background-color: transparent; border-radius:20px; background-color:#FF9EAA; margin-top:50px;">Back to Folders!</button></td></tr>
        </table>

        `
        document.body.innerHTML += manageAccHTML; //add the html 

        const welcomeMessage = document.getElementById("welcomeMessage"); //get the welcome message text
        welcomeMessage.textContent = "Hey " + email + "!"; //make the text content = "Hey" + email + "!"


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const backButton = document.getElementById("backButton"); //get the back button
        backButton.addEventListener('mouseover', function () { //when hovered make the border white
            backButton.style.borderColor = 'white';
        });
        backButton.addEventListener('mouseout', function () { //when not hovered make it black
            backButton.style.borderColor = 'black';
        });
        backButton.addEventListener('click', function () {
            addFolderNav();
            loadFolderNotes(1, userId);
            loadFolderEventListener("alreadylogged", userId);
        });



        //////////////////////////////////////////////////////////////////////////////////////////////////////

        const logOutButton = document.getElementById("logOutButton"); //get log out button
        logOutButton.addEventListener('mouseover', function () { //when hovered make the border white
            logOutButton.style.borderColor = 'white';
        });

        logOutButton.addEventListener('mouseout', function () { //not hovered make it black
            logOutButton.style.borderColor = 'black';
        });
        logOutButton.addEventListener('click', function () { //when clicked...

            //get the userdata from chrome storage
            chrome.storage.sync.get(['userData'], function (result) {

                const userData = result.userData; //save it


                if (userData) {

                    userData.status = "inactive"; //make the user's status "inactive"

                    chrome.storage.sync.set({ userData }, function () { //set it

                        alert("Successfully logged out. See you again!"); //alert

                        location.reload(); //reload
                    });
                }
            });
        });


        //////////////////////////////////////////////////////////////////////////////////////////////////////

        const deleteAccButton = document.getElementById("deleteAccButton"); //get the delete account button

        deleteAccButton.addEventListener('mouseover', function () { //when hovered make the border red

            deleteAccButton.style.borderColor = 'red';
        });

        deleteAccButton.addEventListener('mouseout', function () { //unhovered make it black

            deleteAccButton.style.borderColor = 'black';
        });
        deleteAccButton.addEventListener('click', function () { //when clicked...

            const manageAccTable = document.querySelector('.manageAccTable'); //get the manage acc table and remove it
            if (manageAccTable) {
                manageAccTable.remove();
            }

            //create html for the delete account confirmation display
            const deleteAccConfirmHTML = `
            <table style="margin-top: 40px;" class="deleteAccConfirmTable">
    <thead>
        <tr>
            <td colspan="2">
                <p style="font-family: Calibri; color: red; font-weight: bold; font-size: 20px;">Are you sure you want to delete your account? All notes will be deleted forever.</p>
            </td>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td><button id="yesButton" style="background-color: red; width: fit-content;">Yes, Delete my Account!</button></td>
        <td><button id="noButton" style="background-color: green;">No!</button></td>
        
        </tr>
    </tbody>
</table>
            
            `

            document.body.innerHTML += deleteAccConfirmHTML; //add it to the document



            const yesButton = document.getElementById("yesButton"); //get the yes button

            yesButton.addEventListener('click', function () { //when clicked...

                const user = auth.currentUser; //get the current user from the firebase authenticated users

                try {

                    remove(ref(database, `users/${userId}`)); //remove all their data from the database

                    deleteUser(user); //delete the user from the list of authenticated users

                    chrome.storage.sync.get(['userData'], function (result) { //get their data from chrome storage

                        const userData = result.userData;

                        if (userData) {

                            chrome.storage.sync.remove('userData', function () { //remove it
                                alert('Your account has been deleted.'); //alert
                                location.reload(); //reload

                            });
                        }
                    });
                } catch (error) { //catch errors
                    console.error('Error deleting account:', error.message);
                    alert('Failed to delete the account.');
                }
            })

            const noButton = document.getElementById("noButton"); //get the no button

            noButton.addEventListener('click', function () { //when clicked...

                const deleteAccConfirmTable = document.querySelector('.deleteAccConfirmTable');

                deleteAccConfirmTable.remove(); //remove the delete confirmation display
                addFolderNav();
                loadFolderNotes(1, userId); //go back to folder 1
                loadFolderEventListener("alreadylogged", userId); //load folder buttons


            })
        });

    });

}

const loginButton = document.querySelector("#loginButton"); //get login button
const registerButton = document.querySelector("#registerButton"); //get register button

loginButton.addEventListener("click", replaceAccountMenuWithLogin); //add event listener
registerButton.addEventListener("click", register); //add event listener


