/*
1. Get the menu table from popup.html. Delete it.
2. Create a login menu using the table element. Add it into the document, replacing the first menu.
3. Add css properties to the login menu.
4. Add an event listener to the login button that was just created. When clicked, call function tryLogin().
*/
function login() {
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
        </tr>
    `;
    //2. the accountMenu table in popup.html is being replaced with the loginMenu table above.
    accountMenu.parentNode.replaceChild(loginMenu, accountMenu);
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

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
1. Retrive the text inputted into the email and password input boxes. Trim them if needed.
2. If they are NOT empty, remove the login menu. Call buttonClick("login") to load folder1.
3. If they ARE empty, alert that they need to enter something. 
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
        //get the loginMenu table
        const loginMenu = document.querySelector(".loginMenu"); 
        //remove the loginMenu from function login() above
        loginMenu.parentNode.removeChild(loginMenu);
        //variable script = a new <script> element
        const script = document.createElement('script');
        //the script source is folders.js
        script.src = 'folders.js';
        //add folders.js to the document
        document.head.appendChild(script);
        //when folders.js is loaded, call showFolders()
        script.onload = function() {
            buttonClick("login");
        }  
    }
    //3. otherwise, if the email and password IS empty
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
            <td>NAME:</td>
            <td><input type="text" id="userName"></td>
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
   //style the registerMenu
    registerMenu.style.display = "flex";
    registerMenu.style.justifyContent = "center";
    registerMenu.style.alignItems = "center";
    registerMenu.style.height = "100vh";
    //2. add event listener to the tryRegister button when clicked. 
    tryRegister.addEventListener('click', function(){
        //3. Retrive the texts entered in all 4 input boxes.
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const nameInput = document.getElementById('userName');
        const passConfirm = document.getElementById('confirmedPassword');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value;
        const confirmedPassword = passConfirm.value.trim();
        //3. Create rules for what can and cannot be entered.
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
        } 
        else if (password.length > 12) {
            alert("Password is too long. Maximum length is 12 characters.");
        }
        else if (!email.includes('@'))
        {
            alert("Please provide a valid email address.");
        }
        else if (password !== confirmedPassword) {
            alert("Passwords do not match.");
        }
        else if (name.includes(' ') || name.length === 0 || name.length > 20) {
            alert("Please enter a correct name.");
        }
        //4. if the input boxes pass all the rules, remove the register menu.
        //Then, call buttonClick("login") to load folder1.
        else{
            //get the register menu table
            const registerMenu = document.querySelector(".registerMenu"); 
            //remove it
            registerMenu.parentNode.removeChild(registerMenu);
            //variable script = a new <script> element
            const script = document.createElement('script');
            //the script source is folders.js
            script.src = 'folders.js';
            //add folders.js to the document
            document.head.appendChild(script);
            //when folders.js is loaded, call buttonClick("login")
            script.onload = function() {
                buttonClick("login");
            }
        }
    });
}

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
Here, we get the login button and the register button from the popup menu.
When either is clicked, call their respective functions.
*/

const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");


loginButton.addEventListener("click", login);
registerButton.addEventListener("click", register);
