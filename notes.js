import { ref, getDatabase, push, get, child, set, remove } from "/firebase-database.js";
import { app } from "/firebase-main.js";
import { loadFolderNotes } from "/folders.js";
import { loadFolderEventListener } from "/folders.js";


const database = getDatabase(app);




//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
The purpose of this functionis to create a new note. To do so, remove any existing content from the existing document and add a new html document
with input boxes for the title and text content. 
*/

//Purpose: let user create a new note using text boxes then add them to firebase and the plugin display
export function newNote(folderNum, userID) {

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

    //add the note taking html
    addNewNoteTakingHTML();


    //add event listeners
    const saveNoteButton = document.getElementById('saveNoteButton');
    const italicizeButton = document.getElementById('italicizeButton');
    const underlineButton = document.getElementById('underlineButton');
    const boldButton = document.getElementById('boldTextButton');
    //add an event listener to the button...
    italicizeButton.addEventListener('click', function () {
        italicizeButton();
    });
    boldButton.addEventListener('click', function () {
        boldText();
    });
    underlineButton.addEventListener('click', function () {
        underlineText();
    });

    //for the save button, get the title and text and add them into one string seperated by a * symbol



    //if it exists


    saveNoteButton.addEventListener('click', function () {
        saveNote(folderNum, userID);

    });



}

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
The purpose of this function is to reload the content of a note when the note button is clicked in the folder.
*/
export function loadNote(folderNum, noteID, userId) {
    console.log("On function loadNote().");

    const noteIndex = parseInt(noteID.substring(3)); // Get the index from noteID
    //remove the folder navigation menu

    //remove the create a note button
    const createanote = document.getElementById('createanote');
    if (createanote) {
        createanote.remove();
    }

    //add the note taking html
    addNewNoteTakingHTML();

    //add event listeners to buttons
    const italicizeButton = document.getElementById('italicizeButton');
    const changeFolderButton = document.getElementById('changeFolder');
    const underlineButton = document.getElementById('underlineButton');
    const saveNoteButton = document.getElementById('saveNoteButton');
    italicizeButton.addEventListener('click', function () {
        boldText();
    });
    underlineButton.addEventListener('click', function () {
        underlineText();
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
                for (const firebaseNoteId in folderData) {
                    if (Object.hasOwnProperty.call(folderData, firebaseNoteId)) {
                        const note = folderData[firebaseNoteId];

                        if (note === noteData) {
                            console.log("Found matching note with ID:", firebaseNoteId);
                            console.log(note);
                            matchingNoteId = firebaseNoteId;
                            break;
                        }
                    }
                }
                //seperate it by the * symbol into title and text
                const [title, text] = noteData.split('¶');
                console.log("Title:", title);
                console.log("Text:", text);

                //get the text and title boxes
                const noteText = document.getElementById('noteText');
                const noteTitle = document.getElementById('noteTitle');

                noteText.value = text;
                noteTitle.value = title;
                saveNoteButton.addEventListener('click', function () {
                    saveReloadNote(folderNum, userId, matchingNoteId);
                });

            } else {
                console.log(`Folder${folderNum} does not exist.`);
            }
        }).catch((error) => {

        });


}

function saveReloadNote(folderNum, userId, matchingNoteId) {
    console.log("Saving edited note to folder" + folderNum);

    //get the text and titles
    const noteText = document.getElementById('noteText').value;
    const noteTitle = document.getElementById('noteTitle').value;

    //fullNote is both strings added together
    const fullNote = `${noteTitle}¶${noteText}`;


    //get the user's folder from firebase
    const userFolderRef = ref(database, `users/${userId}/folder${folderNum}`);
    const matchingNoteRef = child(userFolderRef, matchingNoteId);
    set(matchingNoteRef, fullNote)
        .then(() => {
            console.log(`Note with ID ${matchingNoteId} updated successfully.`);
            const folderNavHTML = `
 <div class="folderNav" style="background-color: white; width: 100%; 
 margin-top: 47px;">
     <button id="folder1" style="background-color: #add8e6;">Folder 1</button>
     <button id="folder2" style="background-color: #add8e6;">Folder 2</button>
     <button id="folder3" style="background-color: #add8e6;">Folder 3</button>
     <button id="folder4" style="background-color: #add8e6;">Folder 4</button>
 </div>
 `;
            const folderNav = document.querySelector('.folderNav');
            if (!folderNav) {
                document.body.innerHTML += folderNavHTML;
            }

            //load the folder's notes
            loadFolderNotes(folderNum, userId);

            //add event listeners to the folder buttons
            loadFolderEventListener("alreadyLogged", userId);

        })
        .catch((error) => {
            console.error("Error updating note: ", error);
        });
}

function saveNote(folderNum, userId) {
    console.log("Saving note to folder" + folderNum);

    //get the text and titles
    const noteText = document.getElementById('noteText').value;
    const noteTitle = document.getElementById('noteTitle').value;
   
    //fullNote is both strings added together
    const fullNote = `${noteTitle}¶${noteText}`;

    //push the note into the folder in firebase based on the users id, taken from the chrome storage


    //get userid
    //get the user's folder from firebase
    const userFolderRef = ref(database, `users/${userId}/folder${folderNum}`);

    //push the fullNote into the respective folder
    push(userFolderRef, fullNote)


    //add the folderNav again
    const folderNavHTML = `
            <div class="folderNav" style="background-color: white; width: 100%; 
            margin-top: 47px;">
                <button id="folder1" style="background-color: #add8e6;">Folder 1</button>
                <button id="folder2" style="background-color: #add8e6;">Folder 2</button>
                <button id="folder3" style="background-color: #add8e6;">Folder 3</button>
                <button id="folder4" style="background-color: #add8e6;">Folder 4</button>
            </div>
            `;
    const folderNav = document.querySelector('.folderNav');
    if (!folderNav) {
        document.body.innerHTML += folderNavHTML;
    }

    //load the folder's notes
    loadFolderNotes(folderNum, userId);

    //add event listeners to the folder buttons
    loadFolderEventListener("alreadyLogged", userId);


}

export function deleteNote(deleteNoteButtonID, userID, folderNum) {

    //remove the word "delete" from the delete button id
    const noteID = deleteNoteButtonID.slice(6);

    const noteRef = ref(getDatabase(), `users/${userID}/folder${folderNum}/${noteID}`);



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

    //add it to the document




    get(noteRef)
        .then((snapshot) => {
            if (snapshot.exists()) {

                document.body.innerHTML += deleteConfirmTextHTML;
                const noteContent = snapshot.val();

                // Separate note content by the '*' symbol
                const [title, text] = noteContent.split('¶');

                // Create a formatted note text
                const formattedNoteTitle = `${title}`;
                const formattedNoteText = `${text}`;

                const noteContentDiv = document.createElement('div');
                noteContentDiv.id = 'noteContentText';
                noteContentDiv.style.backgroundColor = '#e6e6e6';
                noteContentDiv.style.width = '90%';
                noteContentDiv.style.height = '200px';
                noteContentDiv.style.border = '1px solid black';
                noteContentDiv.style.padding = '5px';
                noteContentDiv.style.overflowY = 'auto';

                const formattedNoteTitle1 = document.createElement('p');
                formattedNoteTitle1.id = 'formattedNoteTitle';
                formattedNoteTitle1.textContent = formattedNoteTitle;
                formattedNoteTitle1.style.fontSize = '18px';
                formattedNoteTitle1.style.fontFamily = 'Calibri';
                formattedNoteTitle1.style.fontWeight = 'bold';
                formattedNoteTitle1.style.marginTop = '0px';


                const formattedNoteText1 = document.createElement('p');
                formattedNoteText1.id = 'formattedNoteText';
                formattedNoteText1.textContent = formattedNoteText;
                formattedNoteText1.style.fontSize = '14px';
                formattedNoteText1.style.fontFamily = 'Calibri';

                formattedNoteTitle1.style.textAlign = 'center';
                formattedNoteText1.style.textAlign = 'left';

                noteContentDiv.appendChild(formattedNoteTitle1);
                noteContentDiv.appendChild(formattedNoteText1);

                // Append the container div to the document body
                document.body.appendChild(noteContentDiv);

                document.body.innerHTML += deleteConfirmTableHTML;
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


                    // Get a reference to the specific note in the folder



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
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
function boldText() {

}
function underlineText() {

}
function ItalicizeText() {
}
function changeFolder() {

}
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

function addNewNoteTakingHTML() {
    const folderNav = document.querySelector('.folderNav');
    if (folderNav) {
        folderNav.remove();
    }
    //create the html for the new note page. 
    const newNoteTableHTML = `  
    <table class="titleNote" style="margin-top: 70px;">
            <tr>
                <td>TITLE:</td>
                <td><input type="text" id="noteTitle"></td>
            </tr>
        </table>
    `;
    const noteContentTableHTML = `
    <table class="noteContent">
        <tr>
            <td>
                <textarea id="noteText" style="width: 250px; height: 250px; background-color: #f0f0f0; font-family: 'Times New Roman', Times, serif; font-size: 15px;"></textarea>
            </td>
        </tr>
        <tr>
            <td>
                <button style= height: 30px;" id="boldTextButton">Bold</button>
                <button style= height: 30px;" id="italicizeButton">Italicize</button>
                <button style= height: 30px;" id="underlineButton">Underline</button>
            </td>
        </tr>
        <tr>
            <td>
                <button height: 30px;" id="saveNoteButton">Save</button>
            </td>
        </tr>
    </table>
    `;
    //add both to the document
    document.body.innerHTML += newNoteTableHTML + noteContentTableHTML;
}
