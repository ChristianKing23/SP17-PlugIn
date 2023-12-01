/*
the purpose of note.js is to handle creating, editting, and deleting notes for the folders.

newNote(folderNum, userID): called when the create note button is clicked
- removes unwanted displays to add note taking html which will allow the user to input text for the note
-  adds save button which calls saveNote(folderNum, userId)

saveNote(folderNum, userId): saves the note into the respective folder
- gets the title and text of the note and combines them using the ¶ symbol.
- adds the note into the users folder in firebase using the foldernum and the userid

loadNote(folderNum, noteID, userId): using the noteid, it finds the full note in the user's database and adds that
into the note taking html
-  removes unwanted displays and gets the note's index number
- saves the users data under their folder into an array. using the note's index number, gets the note content
- gets its id number from firebase
- puts the text into the note taking boxes for editting

saveReloadNote(folderNum, userId, matchingNoteId): saves a note thats an edit of a previous note
-combine the title and text using ¶
- get the folder reference for the user in firebase and find the original note using matchingNoteId
- set the text content for matchingNoteId to now equal the new full note
- goes back to the folder's display

function deleteNote(deleteNoteButtonID, userID, folderNum): deletes a note
- gets the note's id and makes a reference to the user's database to that note
- adds a delete confirmation display
- clicking yes removes the note from the database
- clicking no does not, and loads the folder's notes
*/

import { ref, getDatabase, push, get, child, set, remove } from "/firebase-database.js";
import { app } from "/firebase-main.js";
import { loadFolderNotes } from "/folders.js";
import { loadFolderEventListener, addFolderNav } from "/folders.js";


const database = getDatabase(app);


export function newNote(folderNum, userID) { //lets users enter in text for a note

    //remove the "no notes" table w/ button if it is there
    const noNotes = document.querySelector('.noNotes');
    if (noNotes) {
        noNotes.remove();
    }
    //remove the folder navigation menu
    const folderNav = document.querySelector('.folderNav');
    if (folderNav) {
        folderNav.remove();
    }
    const bottombar = document.querySelector('.bottombar');
    if (bottombar) {
        bottombar.remove();
    }
    const noteList = document.querySelector('.noteList');
    if(noteList){
        noteList.remove();
    }

    //add the note taking html
    addNewNoteTakingHTML();


    //add event listeners to save button
    const saveNoteButton = document.getElementById('saveNoteButton');

    saveNoteButton.addEventListener('mouseover', function () {
        saveNoteButton.style.backgroundColor = '#b1f0c2';
    });

    saveNoteButton.addEventListener('mouseout', function () {
        saveNoteButton.style.backgroundColor = '#e1f2e6';
    });


    saveNoteButton.addEventListener('click', function () {

        saveNote(folderNum, userID);

    });



}

export function loadNote(folderNum, noteID, userId) { //loads a note thats already been made

    console.log("On function loadNote().");

    const noteIndex = parseInt(noteID.substring(3)); // Get the index from noteID using the 3rd character
    //(noteID looks like F1N1, F2N4, etc. substring(3) would be the last number in the noteID)
    

    //remove the create a note button
    const bottombar = document.querySelector('.bottombar');
    if (bottombar) {
        bottombar.remove();
    }
    const noteList = document.querySelector('.noteList');
    if(noteList){
        noteList.remove();
    }

    //add the note taking html
    addNewNoteTakingHTML();


    const saveNoteButton = document.getElementById('saveNoteButton');


    saveNoteButton.addEventListener('mouseover', function () {
        saveNoteButton.style.backgroundColor = '#b1f0c2';
    });

    saveNoteButton.addEventListener('mouseout', function () {
        saveNoteButton.style.backgroundColor = '#e1f2e6';
    });

    //get their folder based on their id and the folder number
    const folderRef = ref(database, `users/${userId}/folder${folderNum}`);
    get(folderRef)
        .then((snapshot) => {

            //if the folder exists
            if (snapshot.exists()) {

                //save the folder data
                const folderData = snapshot.val();

                //put it into an array
                const dataArray = Object.values(folderData);

                //get the data at the specific index passed in
                const noteData = dataArray[noteIndex];

                let matchingNoteId = null;

                //the purpose of the below for loop is to get the note's id thats in firebase. this is needed to save any edits to the note.
                for (const firebaseNoteId in folderData) { //for the database's id numbers for the notes in the folder

                    if (Object.hasOwnProperty.call(folderData, firebaseNoteId)) { //if the id numbers exist

                        const note = folderData[firebaseNoteId]; //make note == the text data for that id

                        if (note === noteData) { //if the text content of note matches the text content notedata

                            console.log("Found matching note with ID:", firebaseNoteId); 

                            console.log(note);

                            matchingNoteId = firebaseNoteId;//then save its id number

                            break;
                        }
                    }
                }
                //seperate the note content by the ¶ symbol into title and text
                const [title, text] = noteData.split('¶');
                console.log("Title:", title);
                console.log("Text:", text);

                //get the text and title boxes
                const noteText = document.getElementById('noteText');
                const noteTitle = document.getElementById('noteTitle');

                noteText.value = text; //put the text inside of the boxes
                noteTitle.value = title;

                saveNoteButton.addEventListener('click', function () { //when save button is clicked...

                    if (title == "" || title == " ") { //no empty titles please

                        alert("Please provide a title for your new note.");

                    }
                    else { //otherwise, save the editted note, passing in its firebase id
                        saveReloadNote(folderNum, userId, matchingNoteId);
                    }

                });

            } else {
                console.log(`Folder${folderNum} does not exist.`);
            }
        }).catch((error) => {

        });


}

function saveReloadNote(folderNum, userId, matchingNoteId) { //saves a note thats an edit of a previous note

    console.log("Saving edited note to folder" + folderNum);

    //get the text and titles
    const noteText = document.getElementById('noteText').value;
    const noteTitle = document.getElementById('noteTitle').value;

    //fullNote is both strings added together
    const fullNote = `${noteTitle}¶${noteText}`;


    //get the user's folder from firebase
    const userFolderRef = ref(database, `users/${userId}/folder${folderNum}`);

    const matchingNoteRef = child(userFolderRef, matchingNoteId); //get the original note

    set(matchingNoteRef, fullNote) //set the editted note to have the same id has the original note by replacing the data

        .then(() => {
            console.log(`Note with ID ${matchingNoteId} updated successfully.`);
            
            addFolderNav();

            //load the folder's notes
            loadFolderNotes(folderNum, userId);

            //add event listeners to the folder buttons
            loadFolderEventListener("alreadyLogged", userId);

        })
        .catch((error) => {
            console.error("Error updating note: ", error);
        });
}

function saveNote(folderNum, userId) { //saves note to the folder in firebase

    console.log("Saving note to folder" + folderNum);

    //get the text and titles
    const noteText = document.getElementById('noteText').value;
    const noteTitle = document.getElementById('noteTitle').value;


    if (noteTitle == "" || noteTitle == " ") { //no empty title
        alert("Please provide a title for your new note.");
    }
    else {
        
        //fullNote is both strings added together
        const fullNote = `${noteTitle}¶${noteText}`;

        //get the user's folder from firebase
        const userFolderRef = ref(database, `users/${userId}/folder${folderNum}`);

        //push the fullNote into the respective folder
        push(userFolderRef, fullNote);
    
        //add the folder nav again
        addFolderNav();

        //load the folder's notes
        loadFolderNotes(folderNum, userId);

        //add event listeners to the folder buttons
        loadFolderEventListener("alreadyLogged", userId);

    }

}

export function deleteNote(deleteNoteButtonID, userID, folderNum) { //deletes a note from firebase

    //remove the word "delete" from the delete button id
    const noteID = deleteNoteButtonID.slice(6);

    const noteRef = ref(getDatabase(), `users/${userID}/folder${folderNum}/${noteID}`); //get a reference to the note

    //delete confirmation html
    const deleteConfirmTextHTML = `
    <p id="deleteConfirmText" style="color: red; font-size: 14px;">Are you sure you want to delete this note? This cannot be undone.</p>
    
    `
    const deleteConfirmTableHTML = `<table id="deleteConfirmTable">
    <tr>
    <td><button id="yesButton" style="width: 100px; height: 20px; background-color: red; color: white;">Yes, delete it!</button></td>
    <td><button id="noButton" style="width: 40px; height: 20px; background-color: green; color: black;">No</button></td>
    
    </tr>
</table> `


    get(noteRef)
        .then((snapshot) => {
            if (snapshot.exists()) { //if the note exists

                document.body.innerHTML += deleteConfirmTextHTML; //add the delete confirm display

                const noteContent = snapshot.val(); //save the notecontent

                // Separate note content by the '*' symbol
                const [title, text] = noteContent.split('¶');

                // Create a formatted note text
                const formattedNoteTitle = `${title}`;
                const formattedNoteText = `${text}`;

                const noteContentDiv = document.createElement('div'); //style the note content container. it should be a box that has
                //the notes content inside as a preview for the user
                noteContentDiv.id = 'noteContentText';
                noteContentDiv.style.backgroundColor = '#e6e6e6';
                noteContentDiv.style.width = '90%';
                noteContentDiv.style.height = '200px';
                noteContentDiv.style.border = '1px solid black';
                noteContentDiv.style.padding = '5px';
                noteContentDiv.style.overflowY = 'auto';

                const formattedNoteTitle1 = document.createElement('p'); //style the title
                formattedNoteTitle1.id = 'formattedNoteTitle';
                formattedNoteTitle1.textContent = formattedNoteTitle;
                formattedNoteTitle1.style.fontSize = '18px';
                formattedNoteTitle1.style.fontFamily = 'Calibri';
                formattedNoteTitle1.style.fontWeight = 'bold';
                formattedNoteTitle1.style.marginTop = '0px';


                const formattedNoteText1 = document.createElement('p'); //style the text
                formattedNoteText1.id = 'formattedNoteText';
                formattedNoteText1.textContent = formattedNoteText;
                formattedNoteText1.style.fontSize = '14px';
                formattedNoteText1.style.fontFamily = 'Calibri';

                formattedNoteTitle1.style.textAlign = 'center';
                formattedNoteText1.style.textAlign = 'left';

                noteContentDiv.appendChild(formattedNoteTitle1); //append 
                noteContentDiv.appendChild(formattedNoteText1);

                // append the container div to the document body
                document.body.appendChild(noteContentDiv);

                document.body.innerHTML += deleteConfirmTableHTML; //add the table

                //remove the note list
                const noteList = document.querySelector('.noteList');
                if (noteList) {
                    //remove notelist.
                    noteList.remove();
                }

                //remove create note button
                const bottomBar = document.querySelector('.bottombar');
                if (bottomBar) {
                    bottomBar.remove();
                }

                //get the yes and no buttons
                const yesButton = document.getElementById('yesButton');
                const noButton = document.getElementById('noButton');

                //add an event listener to the yes button
                yesButton.addEventListener('click', function () {

                    // Remove the note from Firebase
                    remove(noteRef)
                        .then(() => {
                            console.log("Note deleted successfully.");

                            loadFolderNotes(folderNum, userID);
                            const deleteConfirmText = document.getElementById(deleteConfirmText);
                            if (deleteConfirmText) {
                                deleteConfirmText.remove();
                            }
                            const noteContentText = document.getElementById(noteContentText);
                            if (noteContentText) {
                                noteContentText.remove();
                            }
                            const deleteConfirmTable = document.getElementById(deleteConfirmTable);
                            if (deleteConfirmTable) {
                                deleteConfirmTable.remove();
                            }
                            loadFolderEventListener("alreadyLogged", userID);
                        })
                        .catch((error) => {
                            console.error("Error deleting note: ", error);
                        });

                })

                //add an event listener to no button
                noButton.addEventListener('click', function () {
                    loadFolderNotes(folderNum, userID);
                    loadFolderEventListener("alreadyLogged", userID);

                })

            } else {
                console.error("Note not found in Firebase");
            }
        })
        .catch((error) => {
            console.error("Error fetching note from Firebase: ", error);
        });



}

function addNewNoteTakingHTML() { //adds the note taking html content to the display
    document.body.style.backgroundColor = '#FFF6F6';
    const folderNav = document.querySelector('.folderNav');
    if (folderNav) {
        folderNav.remove();
    }
    //create the html for the new note page. 
    const newNoteTableHTML = `  
    <table class="titleNote" style="margin-top: 40px; padding:0px;">
            <tr style="padding: 0px;">
                <td style="font-weight: bold; font-size: 14px;">TITLE:</td>
                <td><input type="text" id="noteTitle"></td>
            </tr>
        </table>
    `;
    const noteContentTableHTML = `
    <table class="noteContent" style="margin-top: 1px;">
        <tr>
            <td>
                <textarea id="noteText" style="width: 250px; height: 250px; background-color: #f5f5f5; font-family: 'Times New Roman', Times, serif; font-size: 15px;"></textarea>
            </td>
        </tr>
        <tr>
            <td>
                <button height: 30px;" id="saveNoteButton" style="font-family: calibri; font-size: 19px; background-color: #e1f2e6; ">Save Note!</button>
            </td>
        </tr>
    </table>
    `;
    //add both to the document
    document.body.innerHTML += newNoteTableHTML + noteContentTableHTML;
}
