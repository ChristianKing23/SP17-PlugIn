
/*
the purpose of folders.js is to handle all events relating to the user's folders and the notes inside of the fodlers.

loadFolderNotes(folderID, userId): takes in the user's ID number (the same as their firebase ID) and the folder ID number (1, 2, 3, or 4). This function: 

- changes the color of the folder's button to show which folder the user is currently viewing
- remove any unwanted displays
- gets a reference for the user's folder in the database
- if the folder exists, then checks to see if it has data. If it has data (notes), then add each individual note into an array, notes[]. Then, go to makeNoteList(folderID, notes, userId).
- otherwise, if the folder does not exist in database, then it is empty. call loadFolderScreen(folderID, userId) to load the new display.

makeNoteList(folderNum, notes, userId): purpose is to make a table of buttons that represent each note in the folder.

- adds the folder navigation bar in case it was taken away (happens when viewing account management and the note taking screen)
- gets a reference for the current folder in firebase. 
- when found, for each note in the notes array, then for each unique id number for each note in firebase, find the note in notes that matches the note in firebase by its text content. When found, add that id number from firebase into an array called noteIDFB.
- splits the note by the '¶' symbol, and pushes the titles into an array called titles.
- removes the previous notelist for the previous folder. creates a table of buttons where the text content of each button is the title of the note. creates a delete button next to the note buttons.
- creates a "new note" button that triggers making a new note. adds event listeners to every button in the note list and the new note button.

function loadFolderScreen(folderNum, userid): purpose: takes in an empty folder and loads its display.

- removes any unneeded displays/html elements
- removes the note list of the previous folder if it is there
- adds a display that tells the user there are no notes
- adds a new note button and an event listener to the button
- reloads the folder button event listeners

loadFolderEventListener(string, userId):
- uses a loop to add event listeners to each folder button in the folder navigation bar
- when a folder button is clicked, load the notes for the buttons and display if there. change the border color for the button clicked.
- adds event listener to the manage account button, aka the person icon on the top right. when clicked, add and remove html elements to show and option to sign off or delete the account. adds event listeners when needed.

folderColor(folderID): changes the background color of the folder button when clicked.
buttonColor(noteButton, index): changes the color of each note button in a note list.
removeNoteCreationScreen(): removes the note creation and note editting screen from notes.js.
function addFolderNav(): adds the folder navigation bar
createNoteEventListener(folderNum, userId): adds event listner to the "create note" button at the bottom of each folder display.
createBottomBar(folderNum): creates the "create note for folder#) button and appends it to the document.
createNoNotesPage(): creates a display that says "No Notes."

*/
import { newNote, loadNote, deleteNote } from "/notes.js";
import { getDatabase, ref, get } from "/firebase-database.js";
import { app } from "/firebase-main.js";
import { showTutorial, manageAccountEventListener } from "/accountManagement.js";

const database = getDatabase(app);

export function loadFolderEventListener(string, userId) { //gives event listeners to the folder buttons

    console.log("Currently on loadFolderEventListener.");

    document.body.style.backgroundColor = 'white'; //make the background color white

    for (let i = 1; i < 5; i++) { //for every folder button, add event listeners

        let folderID = document.getElementById('folder' + i);

        if (folderID) {
            folderID.addEventListener('click', function () { //load the folder's notes when clicked
                loadFolderNotes(i, userId);
            });

            folderID.addEventListener('mouseover', function () { //when hovered border is pink
                folderID.style.borderColor = 'pink';
            });

            folderID.addEventListener('mouseout', function () { //unhovered border is black
                folderID.style.borderColor = 'black';
            });

        }
    }
    console.log("folders.js: Added event listeners to folder buttons...");

    //if string == "login", default to load folder1
    if (string == "login") {
        console.log("folders.js: loading folder 1 as the default folder...");
        loadFolderNotes(1, userId);
    };

    manageAccountEventListener(userId); //add an event listener to the manage account button
    showTutorial(); //add event listener to tutorial button

}

function loadFolderScreen(folderNum, userid) { //loads display for folder that has no notes inside of them

    const manageAccTable = document.querySelector('.manageAccTable'); //get the manage account display and remove it
    if (manageAccTable) {
        manageAccTable.remove();
    }
    const notelists = document.querySelector('.noteList'); //get the notelist


    //if the previous folder had notes, then remove its note list and make a "no notes" display and a new note button for the current folder
    if (notelists) {

        notelists.remove();//remove notelist.

        console.log("folders.js: previous folder had notes and they were removed...");

    }

    //if the previous folder had no notes, then nothing needs to change since the "No Notes." text will already be availiable
    else if (!notelists) {

        console.log("folders.js: previous folder had no notes and they were removed...");

    }

    createNoNotesPage(); //create no notes display (needed if loading in for the first time)

    createBottomBar(folderNum); //create the create note button for the fodler

    createNoteEventListener(folderNum, userid); //add an event listener to that button

    loadFolderEventListener("alreadyLogged", userid); //load the folder button event listeners

    const deleteConfirmText = document.getElementById('deleteConfirmText'); //delete any extra displays that may be on the screen
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
    const loadingDisplay = document.getElementById("loadingDisplay");
    if (loadingDisplay) {
        loadingDisplay.remove();
    }
}

function makeNoteList(folderNum, notes, userId) { //for folders with notes, creates the note list and adds it to the document


    console.log("folders.js: on makeNoteList to make list of notes for folder " + folderNum + "...");

    //add the folderNav if it was removed
    addFolderNav();

    let titles = []; //array of the note titles
    let texts = []; //array of the note texts
    let noteIDFB = []; //array of the note's id's from firebase database




  
    const folderRef = ref(database, `users/${userId}/folder${folderNum}`);

    get(folderRef)
        .then((snapshot) => {

            if (snapshot.exists()) { //if there are notes...

                console.log("folders.js: found folder data...");

                const folderData = snapshot.val(); //save the notes

                //the following code matches the notes in notes to its id in firebase
                //for example: notes array may have "hello/hi". find the same text in the same folder in firebase that matches "hello/hi"
                //and save its ID number. this is needed to delete the note.
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

                    //split each note string using the ¶ symbol 
                    const [title, text] = note.split('¶');

                    //push into the arrays
                    titles.push(title);
                    texts.push(text); //texts is only needed to console log the note. does not have any use
                });

                console.log(titles);
                console.log(texts);

                //we have all of our notes, so remove any remaining noteLists since we're making an updated one
                const notelists = document.querySelector('.noteList');
                if (notelists) {
                    notelists.remove();
                }

                //if there is nothing in titles, just load the screen. its not possible to pass in a folder with no notes, but just in case...
                if (titles == '') {
                    console.log("folders.js: no notes to make a notelist. Load the folder screen...");
                    loadFolderScreen(folderNum, userId);
                }

                //otherwise, create a note list table
                else {
                    function appendNoteList() { //this adds a note list table. its in a function so all the DOM elements are changed simutaneously.
                        console.log("folders.js: titles found, preparing to make note list...");


                        removeNoteCreationScreen(); //remove displays that are not needed
                        const deleteConfirmText = document.getElementById('deleteConfirmText');
                        if (deleteConfirmText) {
                            deleteConfirmText.remove();
                        }
                        const loadingDisplay = document.getElementById("loadingDisplay");
                        if (loadingDisplay) {
                            loadingDisplay.remove();
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


                        //create a new table for the list of notes to show.
                        const noteListTable = document.createElement('table');

                        //the table should have an id equal to "noteList"+the number of the current folder.
                        noteListTable.id = `noteList${folderNum}`;

                        //Give the noteList table a class called "noteList"
                        noteListTable.classList.add('noteList');

                        //create an array of noteIDs and array of ID's for the delete buttons
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

                            const deleteImage = document.createElement('img'); //make delete button an image
                            deleteImage.src = 'https://static.vecteezy.com/system/resources/previews/011/459/573/original/red-prohibited-or-letter-x-icons-free-png.png';

                            //style the note buttons.
                            noteButton.style.width = '200px';
                            noteButton.style.textAlign = 'left';

                            noteButton.addEventListener('mouseover', function () { //when hovered make border yellow
                                noteButton.style.borderColor = 'yellow';
                            });

                            // Reset border color on mouseout
                            noteButton.addEventListener('mouseout', function () { //when unhovered make it black
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

                            //table styles
                            row.style.borderSpacing = '5px';
                            noteCell.style.padding = '8px';
                            buttonCell.style.padding = '5px';

                            deleteButton.appendChild(deleteImage); //add image to the button

                            //add the note's button to the buttoncell (basically the table data), then the button cell into the noteList table's row, then the row into the noteList table.
                            noteCell.appendChild(deleteButton);
                            buttonCell.appendChild(noteButton);
                            row.appendChild(buttonCell);
                            row.appendChild(noteCell);
                            noteListTable.appendChild(row);

                            console.log("folders.js: successfully appended a note...");

                        }

                        //style the note table
                        noteListTable.style.height = '300px';
                        noteListTable.style.overflowY = 'scroll';
                        noteListTable.style.display = 'block';

                        //Add the noteList table onto the document along with the create a note button.
                        document.body.appendChild(noteListTable);

                        console.log("folders.js: successfully appended the note lists...");

                        //create a create note button
                        createBottomBar(folderNum);

                        //add event listener to the create note button
                        createNoteEventListener(folderNum, userId);

                        console.log("folders.js: successfully added new note button...");

                        noteidsarray.forEach(id => { //add event listeners to note buttons
                            //get button based on the id
                            const button = document.getElementById(id);
                            //add an event listener to the buttons made
                            button.addEventListener('click', function () {
                                //call reLoadNote with the folderNum and the id of the note
                                loadNote(folderNum, id, userId);
                            });
                        });
                        console.log("folders.js: successfully added note list event listeners...");

                        deleteidsarray.forEach(id => { //add event listner to delete buttons
                            //get button based on the id
                            const button = document.getElementById(id);
                            //add an event listener to the delete buttons made
                            button.addEventListener('click', function () {
                                deleteNote(id, userId, folderNum);
                            });
                        });

                        console.log("folders.js: successfully added delete button event listeners...");
                    }
                    appendNoteList(); //call the above function
                }
            } else {

            }
        }).catch((error) => {
            console.log(error);
        })

}

export function loadFolderNotes(folderID, userId) { //gets the notes for the folder from firebase.

    folderColor(folderID); //call folder color to make the button pink

    console.log("folders.js: getting the notes for folder " + folderID + "...");

    console.log("folders.js: removing display...");

    //get the database
    const database = getDatabase(app);


    const folderRef = ref(database, `users/${userId}/folder${folderID}`);


    //create an empty notes array
    const notes = [];

    //get the folder from the database based on the folderID number passed in

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
                //else there is no data...
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

function folderColor(folderID) { //whenever a folder is clicked, make its button pink
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
function buttonColor(noteButton, index) { //every button in the note list will have a color
    const buttonColors = ['#8ed464', '#ffe2e7', '#8EC2EE', '#b2b5ff'];
    noteButton.style.backgroundColor = buttonColors[index % buttonColors.length];
}
export function removeNoteCreationScreen() { //removes note creation screen
    const noteContent = document.querySelector('.noteContent');
    if (noteContent) {
        noteContent.remove();
    }
    const titleNote = document.querySelector('.titleNote ');
    if (titleNote) {
        titleNote.remove();
    }
}
export function addFolderNav() { //adds the folder navigation bar
    const folderNavHTML = `
    
    <div class="folderNav" style="background-color: transparent;margin-top: 34px; width: 100%;">
    <table>
    <tr>
    <td style="padding: 0px; "><button id="folder1" style="background-color: #add8e6;font-family: calibri; font-size: 14px; width:76px;">Folder1</button></td>
    <td style="padding: 0px;"><button id="folder2" style="background-color: #add8e6; font-family: calibri; font-size: 14px;width: 76px;">Folder2</button></td>
    <td style="padding: 0px;"><button id="folder3" style="background-color: #add8e6; font-family: calibri; font-size: 14px;width: 76px;">Folder3</button></td>
    <td style="padding: 0px;"><button id="folder4" style="background-color: #add8e6; font-family: calibri; font-size: 14px;width: 76px;">Folder4</button></td>
  </tr>
  </table>
       
   </div>
     
     `;
    //if the folder nav is not on the screen already, add it.
    const folderNav = document.querySelector('.folderNav');
    if (!folderNav) {
        document.body.innerHTML += folderNavHTML;
    }
}
function createNoteEventListener(folderNum, userId) { //adds event listener to create note buttons
    const createNote = document.querySelector('.createanote');

    if (createNote) {
        createNote.addEventListener('mouseover', function () {
            createNote.style.borderColor = 'red';
        });

        createNote.addEventListener('mouseout', function () {
            createNote.style.borderColor = 'black';
        });
        const createNoteID = createNote.id;
        const createNote2 = document.getElementById(createNoteID);
        createNote2.addEventListener('click', function () {
            console.log("folders.js: user wants to create a new note...");
            newNote(folderNum, userId);
        });
    }
}
function createBottomBar(folderNum) { //creates a create new note button for the folder


    //create the bottom bar div with class bottom bar
    const bottomBarDiv = document.createElement('div');
    bottomBarDiv.classList.add('bottombar');

    //create the button
    const createNoteButton = document.createElement('button');

    //give button an id, classname, and text content
    createNoteButton.id = 'createanote' + folderNum;
    createNoteButton.className = 'createanote';
    createNoteButton.textContent = 'Create Note for Folder ' + folderNum;
    createNoteButton.style.backgroundColor = "#FF6AC2";
    createNoteButton.style.borderRadius = "20px";
    createNoteButton.style.fontFamily = "calibri";
    createNoteButton.style.fontSize = "14px";
    createNoteButton.style.fontWeight = "bold";

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
function createNoNotesPage() { //creates a "No Notes." display for empty folders
    const noNotesScreenHTML = `
            <table class="noNotes">
            <tr>
            <td><p style="font-family: Calibri; font-size: 15px;">No Notes.</p>
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

