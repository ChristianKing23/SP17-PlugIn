//We currently only allow 4 folders, so there should be an array for the title of notes and array for the text content of the note for each folder.
let noteTextArray1 = [];
let noteTitleArray1 = [];
let noteTextArray2 = [];
let noteTitleArray2 = [];
let noteTextArray3 = [];
let noteTitleArray3 = [];
let noteTextArray4 = [];
let noteTitleArray4 = [];

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
The purpose of this functionis to create a new note. To do so, remove any existing content from the existing document and add a new html document
with input boxes for the title and text content. 
*/
function newNote(folderNum) {
    //remove the "no notes" table w/ button if it is there
    const noNoteandCreateNote = document.querySelector('.noNoteandCreateNote');
    if(noNoteandCreateNote){
        noNoteandCreateNote.remove();
    }
    //remove the folder navigation menu
    const folderNav = document.querySelector('.folderNav');
    if(folderNav){
        folderNav.remove();
    }
    //create the html for the new note page. 
    const newNoteTableHTML = `  
    <table class="titleNote" style="margin-top: 100px;">
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
                <textarea id="noteText" style="width: 250px; height: 250px; background-color: #f0f0f0;"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <button height: 30px;" id="saveNoteButton">Save</button>
                    <button style= height: 30px;">Bold</button>
                    <button style= height: 30px;">Italicize</button>
                    <button style= height: 30px;">Underline</button>
                    <button style=height: 30px;">Delete</button>
                </td>
            </tr>
        </table>
    `;
    //add both to the document
    document.body.innerHTML += newNoteTableHTML + noteContentTableHTML;
    console.log("Loaded new note page for folder"+folderNum);
    //get the "save" button thats underneath the text area
    const saveNoteButton = document.getElementById('saveNoteButton');
    //add an event listener to the button...
    saveNoteButton.addEventListener('click', function(){
        console.log("Saving note to folder"+folderNum);
        //based on what folder the note is from, get the text entered into the title box and the text area and push into
        //the folder's respective arrays. then, loadFolderNotes()
        if(folderNum == 1){
            //get title and text
            const noteText = document.getElementById('noteText').value;
            const noteTitle = document.getElementById('noteTitle').value;
            //put into the arrays
            noteTextArray1.push(noteText);
            noteTitleArray1.push(noteTitle);
            console.log("Adding Title: "+noteTitle+" Adding text: "+noteText);
            console.log("Adding note to folder"+folderNum+". Back to shownotes.");
            //can loadFolderNotes() to load the list of all notes
            loadFolderNotes(1);
            
        }
        else if(folderNum == 2){
            const noteText = document.getElementById('noteText').value;
            const noteTitle = document.getElementById('noteTitle').value;
            noteTextArray2.push(noteText);
            noteTitleArray2.push(noteTitle);
            console.log("Adding Title: "+noteTitle+" Adding text: "+noteText);
            console.log("Adding note to folder"+folderNum+". Back to homescreen.");
            loadFolderNotes(2);
            
        }
        else if(folderNum == 3){
            const noteText = document.getElementById('noteText').value;
            const noteTitle = document.getElementById('noteTitle').value;
            noteTextArray3.push(noteText);
            noteTitleArray3.push(noteTitle);
            console.log("Adding Title: "+noteTitle+" Adding text: "+noteText);
            console.log("Adding note to folder"+folderNum+". Back to homescreen.");
            loadFolderNotes(3);
        
        }
        else if(folderNum == 4){
            const noteText = document.getElementById('noteText').value;
            const noteTitle = document.getElementById('noteTitle').value;
            noteTextArray4.push(noteText);
            noteTitleArray4.push(noteTitle);
            console.log("Adding Title: "+noteTitle+" Adding text: "+noteText);
            console.log("Adding note to folder"+folderNum+". Back to homescreen.");
            loadFolderNotes(4);
        }
    });
}

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

/*
The purpose of this function is to reload the content of a note when the note button is clicked in the folder.
*/
function loadNote(folderNum, index){
    //remove the create a note button
    const createanote = document.getElementById('createanote');
    if(createanote){
        createanote.remove();
    }
    //create the new note tables
    const newNoteTableHTML = `
        <table class="titleNote" style="margin-top: 50px;">
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
                    <textarea id="noteText" style="width: 250px; height: 250px; background-color: #f0f0f0;"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <button height: 30px;" id="saveNoteButton">Save</button>
                    <button style= height: 30px;">Bold</button>
                    <button style= height: 30px;">Italicize</button>
                    <button style= height: 30px;">Underline</button>
                    <button style=height: 30px;">Delete</button>
                </td>
            </tr>
        </table>
    `;

    //add both html codes inside of the document
    document.body.innerHTML += newNoteTableHTML + noteContentTableHTML;
    console.log("Recreated note boxes for folder"+folderNum);
    //put the title and text that was previously entered back into the boxes
    const noteTextBox = document.getElementById('noteText');
    const noteTitleBox = document.getElementById('noteTitle');
    //depending on which folder the note was for, use the index of the title's place in the array to get the values
    //example: if folder2 has a note called "box", and its the 5th note in the note list, then its place in
    //folder2's note arrays is 4
    //then, make the title and text boxes have the content from the note
    if(folderNum === 1){
        const noteText = noteTextArray1[index];
        const noteTitle = noteTitleArray1[index];
        noteTextBox.value = noteText;
        noteTitleBox.value = noteTitle;
    }
    else if(folderNum == 2){
        const noteText = noteTextArray2[index];
        const noteTitle = noteTitleArray2[index];
        noteTextBox.value = noteText;
        noteTitleBox.value = noteTitle;
    }
    else if(folderNum == 3){
        const noteText = noteTextArray3[index];
        const noteTitle = noteTitleArray3[index];
        noteTextBox.value = noteText;
        noteTitleBox.value = noteTitle;
    }
    else if(folderNum == 4){
        const noteText = noteTextArray4[index];
        const noteTitle = noteTitleArray4[index];
        noteTextBox.value = noteText;
        noteTitleBox.value = noteTitle;
    }
    //add event listener to save button
    const saveNoteButton = document.getElementById('saveNoteButton');
    saveNoteButton.addEventListener('click', function(){
        //according to which folder the note was for, resave the title and text into its array and call loadFolderNotes()
        if(folderNum == 1){
            const newTitle = noteTitleBox.value;
            const newText = noteTextBox.value;
            noteTextArray1[index] = newText;
            noteTitleArray1[index] = newTitle;
            loadFolderNotes(1);
        }
        else if(folderNum == 2){
            const newTitle = noteTitleBox.value;
            const newText = noteTextBox.value;
            noteTextArray2[index] = newText;
            noteTitleArray2[index] = newTitle;
            loadFolderNotes(2);
        }
        else if(folderNum == 3){
            const newTitle = noteTitleBox.value;
            const newText = noteTextBox.value;
            noteTextArray3[index] = newText;
            noteTitleArray3[index] = newTitle;
            loadFolderNotes(3);
        }
        else if(folderNum == 4){
            const newTitle = noteTitleBox.value;
            const newText = noteTextBox.value;
            noteTextArray4[index] = newText;
            noteTitleArray4[index] = newTitle;
            loadFolderNotes(4);
        }
        
    });
}

//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
/*
These 2 functions return the titles and text contents of each of the folders back into folders.js.
this helps 
*/
function retrieveNoteTitle(folderid) {
    switch (folderid) {
        case 1:
            if(noteTitleArray1 === null){
                noteTitleArray1 = [];
                
            }
            return noteTitleArray1;
        case 2:
            if(noteTitleArray2 === null){
              
                noteTitleArray2 = [];
            }
            return noteTitleArray2;
        case 3:
            if(noteTitleArray3 === null){
          
                noteTitleArray3 = [];
            }
            return noteTitleArray3;
        case 4:
            if(noteTitleArray4 === null){
              
                noteTitleArray4 = [];
            }
            return noteTitleArray4;
    }
}
function retrieveNoteText(folderid) {
    switch (folderid) {
        case 1:
            if(noteTextArray1 === null){
                noteTextArray1 = [];
            }
            return noteTextArray1;
        case 2:
            if(noteTextArray2 === null){
                noteTextArray2 = [];
            }
            return noteTextArray2;
        case 3:
            if(noteTextArray3 === null){
                noteTextArray3 = [];
            }
            return noteTextArray3;
        case 4:
            if(noteTextArray4 === null){
                noteTextArray4 = [];
            }
            return noteTextArray4;
    }
}
