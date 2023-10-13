//login function
function login() {
   //variable accountMenu = popup.html element with id "accountMenu"
   //which is the table with the login and register buttons
    const accountMenu = document.querySelector(".accountMenu");

   //variable loginMenu = a new html table element
    const loginMenu = document.createElement("table");
    
    //the table will add the following html code
    //it is for the user's email and password with a login button
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
   
    //the accountMenu table in popup.html is being replaced with the loginMenu table above
    accountMenu.parentNode.replaceChild(loginMenu, accountMenu);

  //the loginMenu table css properties
    loginMenu.style.display = "flex";
    loginMenu.style.justifyContent = "center";
    loginMenu.style.alignItems = "center";
    loginMenu.style.height = "100vh";
    
    //variabel tryLoginButton = the tryLogin button in loginMenu
    const tryLoginButton = document.getElementById('tryLogin');
    //the login button calls function tryLogin() when clicked
    tryLoginButton.addEventListener('click', tryLogin); 
       
    
}

function tryLogin() {
    //get the email and password from the input boxes
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    //trim them
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    //the email and password input boxes were NOT empty
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
            showFolders();
        } 
        
        
    }
    //otherwise, if the email and password IS empty
    else {
        //send an alert to let them know
        alert("Please provide both email and password.");
    }
}

function register() {
    

    //get the accountMenu from the popup
    const accountMenu = document.querySelector(".accountMenu");
    //varibale registerMenu = new <table> with class registerMenu
    const registerMenu = document.createElement("table");
    registerMenu.classList.add("registerMenu");
    //registerMenu HTML code
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

   //replace the popup accountMenu with the registerMenu
    accountMenu.parentNode.replaceChild(registerMenu, accountMenu);

   //style the registerMenu
    registerMenu.style.display = "flex";
    registerMenu.style.justifyContent = "center";
    registerMenu.style.alignItems = "center";
    registerMenu.style.height = "100vh";


    tryRegister.addEventListener('click', function(){
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const nameInput = document.getElementById('userName');
        const passConfirm = document.getElementById('confirmedPassword');
    
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value;
        const confirmedPassword = passConfirm.value.trim();



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
        else{
            //get the loginMenu table
            const registerMenu = document.querySelector(".registerMenu"); 
            //remove the loginMenu from function login() above
            registerMenu.parentNode.removeChild(registerMenu);

            //variable script = a new <script> element
            const script = document.createElement('script');
            //the script source is folders.js
            script.src = 'folders.js';
            //add folders.js to the document
            document.head.appendChild(script);
            //when folders.js is loaded, call showFolders()
            script.onload = function() {
                showFolders();
            }
        }
    });
}


const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");


loginButton.addEventListener("click", login);
registerButton.addEventListener("click", register);
