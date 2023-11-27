//import functions
import { addManageAccountButton } from "/accountManagement.js";
import { loadFolderEventListener, addFolderNav } from "/folders.js";

//when the window loads

window.onload = function () {

     /*
    chrome.storage.sync.clear(function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log('User data cleared successfully.');
        }
    });*/

    //get the user data from the chrome storage
    console.log("background.js: Getting user data from chrome storage...");
    chrome.storage.sync.get(['userData'], function (result) {

        //save the user data
        const userData = result.userData;


        //if userData exists and its status is active
        if (userData && userData.status === "active") {
            const userid = userData.userid;
            

            console.log("background.js: Userdata exists and its status is active...");

            //remove account menu
            const accountMenu = document.querySelector(".accountMenu");
            if (accountMenu) {
                accountMenu.remove();
            }

            console.log("background.js: adding ManageAccount button...");
            console.log("background.js: adding folder navigation...");
            console.log("background.js: loading folder event listeners...");

            //add addManageAccountButton and folder navigation bar to the display
            addManageAccountButton();
            addFolderNav();

            //load folder buttons
            loadFolderEventListener("login", userid);
        }

    });


};

