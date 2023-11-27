import { newNote, loadNote, deleteNote } from "/notes.js";
import { getDatabase, ref, get, remove } from "/firebase-database.js";
import { app } from "/firebase-main.js";
import { getAuth, deleteUser } from "/firebase-auth.js";

const auth = getAuth();
const database = getDatabase(app);
/*
Purpose: give folder buttons an event listener
*/
export function loadFolderEventListener(string, userId) {
    console.log("Currently on loadFolderEventListener.");


    for (let i = 1; i < 5; i++) {
        let folderID = document.getElementById('folder' + i);
        if (folderID) {
            folderID.addEventListener('click', function () {
                loadFolderNotes(i, userId);
            });

            folderID.addEventListener('mouseover', function () {
                folderID.style.borderColor = 'pink';
            });

            folderID.addEventListener('mouseout', function () {
                folderID.style.borderColor = 'black';
            });

        }

    }
    console.log("folders.js: Added event listeners to folder buttons...");

    //if string == "login", default to folder1
    if (string == "login") {
        console.log("folders.js: loading folder 1 as the default folder...");
        loadFolderNotes(1, userId);
    };


    //add listener to the ManageAccount button
    const ManageAccount = document.getElementById('ManageAccount');
    ManageAccount.addEventListener('click', function () {

        //remove note list, no note, and create note button
        const noNotes = document.querySelector('.noNotes');
        const bottombar = document.querySelector('.bottombar');
        const noteList = document.querySelector('.noteList');

        removeNoteCreationScreen();
        if (noNotes) {
            noNotes.remove();
        }
        if (bottombar) {
            bottombar.remove();
        }
        if (noteList) {
            noteList.remove();
        }

        const manageAccHTML = `
        <table class="manageAccTable">
        <tr>
        <td>
        <button id="logOutButton" style="padding: 20px; border-radius: 10px; font-size: 18px; font-family: Calibri; border: 1px solid black; background-color: #a7e8e5;">Log Out</button>
        </td>
        </tr>
        <tr>
        <td>
        <button id="deleteAccButton" style="padding: 20px; border-radius: 10px; font-size: 18px; font-family: Calibri; border: 1px solid black; background-color: red;">Delete Account</button>
        </td>
        </tr>
        </table>

        `
        document.body.innerHTML += manageAccHTML;

        const logOutButton = document.getElementById("logOutButton");
        logOutButton.addEventListener('click', function () {

            //get the userdata 
            chrome.storage.sync.get(['userData'], function (result) {
                const userData = result.userData;


                //if it exists, make its status inactive
                if (userData) {
                    // Change userData.status to "inactive"
                    userData.status = "inactive";


                    // Update userdata in chromestorage and reload the extension
                    chrome.storage.sync.set({ userData }, function () {
                        alert("Logged out");
                        location.reload();
                    });
                }
            });

        });

        const deleteAccButton = document.getElementById("deleteAccButton");
        deleteAccButton.addEventListener('click', function () {
            const manageAccTable = document.querySelector('.manageAccTable');
            if (manageAccTable) {
                manageAccTable.remove();
            }
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
            document.body.innerHTML += deleteAccConfirmHTML;



            const yesButton = document.getElementById("yesButton");
            yesButton.addEventListener('click', function () {

                const user = auth.currentUser;

                try {

                    remove(ref(database, `users/${userId}`));

                    deleteUser(user);

                    alert('Your account has been deleted.');

                    chrome.storage.sync.get(['userData'], function (result) {
                        const userData = result.userData;
                        if (userData) {
                            userData.status = "inactive";
                            chrome.storage.sync.set({ userData }, function () {
                                location.reload();
                            });
                        }
                    });
                } catch (error) {
                    console.error('Error deleting account:', error.message);
                    alert('Failed to delete the account.');
                }
            })

            const noButton = document.getElementById("noButton");
            noButton.addEventListener('click', function () {
                const deleteAccConfirmTable = document.querySelector('.deleteAccConfirmTable');
                deleteAccConfirmTable.remove();
                loadFolderNotes(1, userId);


            })
        });


        loadFolderEventListener("alreadylogged", userId);
        console.log("ManageAccount event listener added successfully.");
    });

}

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################


/*
The purpose of this function is to change the HTML code and layout depending on whether the folder has notes, does not have notes,
or if the previous folder visited had notes, or did not have notes. 
*/
function loadFolderScreen(folderNum, userid) {
    const manageAccTable = document.querySelector('.manageAccTable');
    if (manageAccTable) {
        manageAccTable.remove();
    }
    const notelists = document.querySelector('.noteList');

    //this function is only called for folders that have no notes inside

    //if the previous folder had notes, then remove them and make a "no notes" display and a new note button for the current folder
    if (notelists) {
        //remove notelist.
        notelists.remove();
        console.log("folders.js: previous folder had notes and they were removed...");

    }

    //otherwise, if the previous folder also had no notes, create new "no notes" display and new note button
    else if (!notelists) {

        console.log("folders.js: previous folder had no notes and they were removed...");

    }

    createNoNotesPage();
    createBottomBar(folderNum);
    createNoteEventListener(folderNum, userid);
    loadFolderEventListener("alreadyLogged", userid);

    const deleteConfirmText = document.getElementById('deleteConfirmText');
    if (deleteConfirmText) {
        deleteConfirmText.remove();
    }
    const noteContentText = document.getElementById('noteContentText');
    if (noteContentText) {
        noteContentText.remove();
    }
    const deleteConfirmTable = document.getElementById('deleteConfirmTable');
    if (deleteConfirmTable) {
        deleteConfirmTable.remove();
    }



}


//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
The purpose of this function is to create a table, noteList, that shows all the notes previously created for the individual folders.
1. Remove any possible existing html elements except for the top bar menu and the folder navigation bar.
2. Create the table. Every entry note should have its own id (done using its index in the titles array). Every note should have its own button and row inserted in the table.
3.The table should be added into the document.
4. the buttons for each note should have an event listener so that when clicked, the note's content is loaded again and can be editting.
*/
function makeNoteList(folderNum, notes, userId) {


    console.log("folders.js: on makeNoteList to make list of notes for folder " + folderNum + "...");

    //add the folderNav if it was removed from the note taking screen
    addFolderNav();

    //create an array of the titles and texts
    let titles = [];
    let texts = [];
    let noteIDFB = [];



    //get their folder based on their id and the folder number
    const folderRef = ref(database, `users/${userId}/folder${folderNum}`);
    get(folderRef)
        .then((snapshot) => {
            //if the folder exists
            //save the folder data

            if (snapshot.exists()) {

                console.log("folders.js: found folder data...");

                const folderData = snapshot.val();

                //for each note inside of notes (notes is an array of note strings from firebase for the folder)
                notes.forEach(note => {

                    //for every note id number from firebase in the folder
                    for (const firebaseNoteId in folderData) {

                        if (Object.hasOwnProperty.call(folderData, firebaseNoteId)) {

                            //make notecontent = the text for that id
                            const noteContent = folderData[firebaseNoteId];

                            // if the string from note is the same as the string from noteContent
                            if (note === noteContent) {

                                // Add the firebase note ID to the array
                                noteIDFB.push(firebaseNoteId);

                                console.log("folders.js: adding " + firebaseNoteId + " to array of note ids...");
                            }

                        }
                    }

                    //split each note string using the * symbol 
                    const [title, text] = note.split('¶');

                    //push into the arrays
                    titles.push(title);
                    texts.push(text);
                });


                //for each note in the notes array

                console.log(titles);
                console.log(texts);

                //remove any remaining noteLists since we're making an updated one
                const notelists = document.querySelector('.noteList');
                if (notelists) {
                    notelists.remove();
                }



                //if there is nothing in titles, just load the screen
                if (titles == '') {
                    console.log("folders.js: no notes to make a notelist. Load the folder screen...");
                    loadFolderScreen(folderNum, userId);
                }

                //otherwise, create a note list table
                else {
                    console.log("folders.js: titles found, preparing to make note list...");

                    //create a new table for the list of notes to show.
                    const noteListTable = document.createElement('table');

                    //the table should have an id equal to "noteList"+the number of the current folder.
                    noteListTable.id = `noteList${folderNum}`;

                    //Give the noteList table a class called "noteList"
                    noteListTable.classList.add('noteList');

                    //create an array of noteIDs
                    let noteidsarray = [];
                    let deleteidsarray = [];


                    //loop through the titles array based on its length
                    for (let i = 0; i < titles.length; i++) {

                        //for every note, add a row, a cell for the button, and a button for the individual note.
                        const row = document.createElement('tr');
                        const noteCell = document.createElement('td');
                        const buttonCell = document.createElement('td');
                        const noteButton = document.createElement('button');
                        const deleteButton = document.createElement('button');

                        const deleteImage = document.createElement('img');
                        deleteImage.src = 'https://static.vecteezy.com/system/resources/previews/011/459/573/original/red-prohibited-or-letter-x-icons-free-png.png';

                        //style the note buttons.
                        noteButton.style.width = '200px';
                        noteButton.style.textAlign = 'left';

                        noteButton.addEventListener('mouseover', function () {
                            noteButton.style.borderColor = 'yellow';
                        });

                        // Reset border color on mouseout
                        noteButton.addEventListener('mouseout', function () {
                            noteButton.style.borderColor = 'black';
                        });

                        //style the delete buttons
                        deleteImage.style.width = '10px';
                        deleteImage.style.height = '10px';
                        deleteImage.style.opacity = '0.5';

                        deleteButton.style.border = 'none';
                        deleteButton.style.background = 'none';

                        deleteButton.addEventListener('mouseenter', function () {
                            deleteImage.style.opacity = '1'; // Make the image fully opaque on hover
                        });

                        deleteButton.addEventListener('mouseleave', function () {
                            deleteImage.style.opacity = '0.5'; // Return to partial transparency when not hovered
                        });

                        //make the text of the note buttons the title of the note itself.
                        noteButton.innerText = titles[i];

                        //make an ID for each note equal to the folder number and the index of the note in the array.
                        //for example: if the note is in folder 3 and its place in the array is 5, then the id of the note's button is F3N5.
                        const noteButtonID = "F" + folderNum + "N" + i;
                        const deleteButtonID = "delete" + noteIDFB[i];

                        //put the id of the note into the note id array.
                        noteidsarray.push(noteButtonID);
                        deleteidsarray.push(deleteButtonID);

                        //make the id of every button equal to the noteButtonID created above.
                        noteButton.id = noteButtonID;
                        deleteButton.id = deleteButtonID;

                        //style the button's color
                        buttonColor(noteButton, i);


                        row.style.borderSpacing = '5px';

                        noteCell.style.padding = '8px';

                        buttonCell.style.padding = '5px';

                        deleteButton.appendChild(deleteImage);

                        //add the note's button to the buttoncell (basically the table data), then the button cell into the noteList table's row, then the row into the noteList table.
                        noteCell.appendChild(deleteButton);
                        buttonCell.appendChild(noteButton);


                        row.appendChild(buttonCell);
                        row.appendChild(noteCell);
                        noteListTable.appendChild(row);
                        // Style the note buttons
                        console.log("folders.js: successfully appended a note...");

                    }

                    //style the note table
                    noteListTable.style.height = '300px';
                    noteListTable.style.overflowY = 'scroll';
                    noteListTable.style.display = 'block';



                    //Add the noteList table onto the document along with the create a note button.
                    document.body.appendChild(noteListTable);

                    console.log("folders.js: successfully appended the note lists...");

                    //remove the delete confirm table if it was there




                    //create a create note button
                    createBottomBar(folderNum);

                    //add event listener to the create note button
                    createNoteEventListener(folderNum, userId);

                    console.log("folders.js: successfully added new note button...");

                    noteidsarray.forEach(id => {
                        //get button based on the id
                        const button = document.getElementById(id);
                        //add an event listener to the buttons made
                        button.addEventListener('click', function () {
                            //call reLoadNote with the folderNum and the id of the note
                            loadNote(folderNum, id, userId); // Call your function here
                        });
                    });
                    console.log("folders.js: successfully added note list event listeners...");
                    deleteidsarray.forEach(id => {
                        //get button based on the id
                        const button = document.getElementById(id);
                        //add an event listener to the buttons made
                        button.addEventListener('click', function () {
                            deleteNote(id, userId, folderNum);
                        });
                    });
                    console.log("folders.js: successfully added delete button event listeners...");
                }
            } else {

            }
        }).catch((error) => {
            console.log(error);
        })

    const deleteConfirmText = document.getElementById('deleteConfirmText');
    if (deleteConfirmText) {
        deleteConfirmText.remove();
    }
    const noteContentText = document.getElementById('noteContentText');
    if (noteContentText) {
        noteContentText.remove();
    }
    const deleteConfirmTable = document.getElementById('deleteConfirmTable');
    if (deleteConfirmTable) {
        deleteConfirmTable.remove();
    }
    const noNotes = document.querySelector('.noNotes');
    if (noNotes) {
        noNotes.remove();
    }
    const manageAccTable = document.querySelector('.manageAccTable');
    if (manageAccTable) {
        manageAccTable.remove();
    }
}



//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
This function takes in a folderID from a folder button.
1. For whatever folder is entered, remove the new note page IF they are on the document. 
2. Check if there are more than 0 notes in the folder using retrieveNoteTitle() and retrieveNoteText() functions.
*/
export function loadFolderNotes(folderID, userId) {


    folderColor(folderID);

    console.log("folders.js: getting the notes for folder " + folderID + "...");

    //remove the note content 
    removeNoteCreationScreen();
    console.log("folders.js: removing display...");

    //get the database
    const database = getDatabase(app);

    //use chrome storage to get the userid of the current user




    //create an empty notes array
    const notes = [];

    //get the folder from the database based on the folderID number passed in
    const folderRef = ref(database, `users/${userId}/folder${folderID}`);
    get(folderRef)
        .then((snapshot) => {

            //if there is data for the folder...
            if (snapshot.exists()) {
                console.log("folders.js: this folder has data in firebase...");

                const folderData = snapshot.val();

                //for every note inside of the folder from firebase
                for (const noteID in folderData) {

                    if (Object.hasOwnProperty.call(folderData, noteID)) {

                        //make note = the data in the folder, then add it to the notes array
                        const note = folderData[noteID];
                        notes.push(note);

                        console.log("folders.js: pushed in note " + noteID + "...");
                    }
                }
                console.log("folders.js: got all notes for the folder...");

                console.log("folders.js: going to makeNoteList...");
                //make note list for the folder to make a notelist.
                makeNoteList(folderID, notes, userId);

            } else {
                console.log("folders.js: this folder is empty...");
                console.log("folders.js: going to loadFolderScreen...");
                //if there is no data for the folder, then load an empty folder screen
                loadFolderScreen(folderID, userId);
            }
        })

        //catch any errors
        .catch((error) => {
            console.error("Error loading folder notes: ", error);
        });

}


//purpose: whenever a folder is clicked, make its button pink
function folderColor(folderID) {
    //create loop for the 4 folders by their id
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`folder${i}`);
        button.style.backgroundColor = '#add8e6';
    }

    // Set the background color for the specified folder
    let selectedButton = document.getElementById(`folder${folderID}`);
    if (selectedButton) {
        selectedButton.style.backgroundColor = '#DEDAF4';
    }
}

//purpose: every button in the note list will have a color
function buttonColor(noteButton, index) {
    const buttonColors = ['#8ed464', '#ffe2e7', '#8EC2EE', '#b2b5ff'];
    noteButton.style.backgroundColor = buttonColors[index % buttonColors.length];
}
function removeNoteCreationScreen() {
    const noteContent = document.querySelector('.noteContent');
    if (noteContent) {
        noteContent.remove();
    }
    const titleNote = document.querySelector('.titleNote ');
    if (titleNote) {
        titleNote.remove();
    }
}
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
}
function createNoteEventListener(folderNum, userId) {
    const createNote = document.querySelector('.createanote');
    if (createNote) {
        const createNoteID = createNote.id;
        const createNote2 = document.getElementById(createNoteID);
        createNote2.addEventListener('click', function () {
            console.log("folders.js: user wants to create a new note...");
            newNote(folderNum, userId);
        });
    }
}

//creates a create new note button for the folder
function createBottomBar(folderNum) {


    //create the bottom bar div with class bottom bar
    const bottomBarDiv = document.createElement('div');
    bottomBarDiv.classList.add('bottombar');

    //create the button
    const createNoteButton = document.createElement('button');

    //give button an id, classname, and text content
    createNoteButton.id = 'createanote' + folderNum;
    createNoteButton.className = 'createanote';
    createNoteButton.textContent = 'Create Note for Folder ' + folderNum;

    //add the button to the div
    bottomBarDiv.appendChild(createNoteButton);

    //get the bottom bar and remove the previous one
    const bottomBar = document.querySelector('.bottombar');

    if (bottomBar) {
        bottomBar.remove();
        document.body.appendChild(bottomBarDiv);
    }
    else if (!bottomBar) {
        document.body.appendChild(bottomBarDiv);
    }

}
function createNoNotesPage() {
    const noNotesScreenHTML = `
            <table class="noNotes">
            <tr>
            <td><p style="font-family: Arial; font-size: 15px;">No Notes.</p>
            </td>
                </table>
        `;

    const noNotes = document.querySelector(".noNotes");
    if (noNotes) {
        noNotes.remove();
        document.body.innerHTML += noNotesScreenHTML;
    }
    else {
        document.body.innerHTML += noNotesScreenHTML;
    }

}

