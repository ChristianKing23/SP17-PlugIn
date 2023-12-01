//import functions
import { addManageAccountButton } from "/accountManagement.js";
import { loadFolderEventListener, addFolderNav } from "/folders.js";

//when the window loads
window.onload = function () {
//the below comment removes the user's data from chrome storage
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

            //save the id
            const userid = userData.userid;

            //remove account menu
            const accountMenu = document.querySelector(".accountMenu");
            if (accountMenu) {
                accountMenu.remove();
            }

            console.log("background.js: Userdata exists and its status is active...");
            console.log("background.js: adding ManageAccount button...");
            console.log("background.js: adding folder navigation...");
            console.log("background.js: loading folder event listeners...");

            //add addManageAccountButton and folder navigation bar to the display
            addManageAccountButton();
            addFolderNav();

            const loadingHTML = `
            <table id="loadingDisplay" style="font-family: calibri; font-size: 16px"><tr><td><p>Loading Your Folders...</p></td></tr>
<tr>
<td><img style="width: 80px; margin-top:20px"src="https://64.media.tumblr.com/c23a914bc6221203df0238dd1332bc8b/fb647b8dd306edac-86/s250x400/ddc5c154c9899421c7c750915c70897124cc997a.pnj"></img>
</td></tr></table>


            `
            //add a loading display
            document.body.innerHTML += loadingHTML;

            //load folder buttons
            loadFolderEventListener("login", userid);


        }

    });


};



