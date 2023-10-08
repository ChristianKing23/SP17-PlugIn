
function login() {
   
    const accountMenu = document.querySelector(".accountMenu");

   
    const loginMenu = document.createElement("table");
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

   
    accountMenu.parentNode.replaceChild(loginMenu, accountMenu);

  
    loginMenu.style.display = "flex";
    loginMenu.style.justifyContent = "center";
    loginMenu.style.alignItems = "center";
    loginMenu.style.height = "100vh";
}



function register() {
    

    const accountMenu = document.querySelector(".accountMenu");

   
    const registerMenu = document.createElement("table");
    registerMenu.classList.add("registerMenu");

  
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

   
    accountMenu.parentNode.replaceChild(registerMenu, accountMenu);

   
    registerMenu.style.display = "flex";
    registerMenu.style.justifyContent = "center";
    registerMenu.style.alignItems = "center";
    registerMenu.style.height = "100vh";
}


const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");


loginButton.addEventListener("click", login);
registerButton.addEventListener("click", register);

