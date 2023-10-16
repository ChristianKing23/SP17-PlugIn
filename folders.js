/*
The purpose of buttonClick is to load the event listeners for the folder buttons and the create note button.
1. if this is the first time accessing the folders, AKA logging in/registering, call loadFolderNotes(1) (1 being folder 1).
2. Get the folder buttons from the html file and add event listeners to it to show a list of any notes created for that folder.
3. Get the button to create a new note, and add an event listener to it.
*/
function buttonClick(string){
    console.log("Currently on buttonClick.");
    //1. "login" means this is the first time accessing a folder for an account.
    //load the folder notes for folder 1, the default folder. Then, come back.
    if(string == "login"){
        console.log("logged in. loading folder1.");
        loadFolderNotes(1);
    }
    //2. Get all 4 folder buttons.
    const folder1 = document.getElementById('folder1');
    const folder2 = document.getElementById('folder2');
    const folder3 = document.getElementById('folder3');
    const folder4 = document.getElementById('folder4');
    //2. Add an event listener to all 4.
    //When clicked, load the folder notes for that folder using function loadFolderNotes().
    folder1.addEventListener('click', function(){
        console.log("You clicked folder1.");
        folder2.color=
        loadFolderNotes(1);
    });
    folder2.addEventListener('click', function(){
        console.log("You clicked folder2.");
        loadFolderNotes(2); 
    });
    folder3.addEventListener('click', function(){
        console.log("You clicked folder3.");
        loadFolderNotes(3); 
    });
    folder4.addEventListener('click', function(){
        console.log("You clicked folder4.");
        loadFolderNotes(4);
    });
    //3. Add an event listener to the create note button. The purpose is to open a popup windo
    //so the user can choose which folder to add the note to.
    createanote.addEventListener('click', function(){
        //Create the popup window.
        const popup = window.open('', '_blank', 'width=300,height=50');
        //create the html code the popup window will look like. There are 4 buttons for the 4 folders.
        const buttonsHTML = `
        <table class="buttons">
        <tr>
        <td><button id="folder1newnote">Folder1</button></td>
        <td><button id="folder2newnote">Folder2</button></td>
        <td><button id="folder3newnote">Folder3</button></td>
        <td><button id="folder4newnote">Folder4</button></td>
        </tr>
        </table>
        `
        //add the html to the popup window.
        popup.document.body.innerHTML += buttonsHTML;
        //Get the folder buttons from the popupwindow.
        const folder1newnote = popup.document.getElementById('folder1newnote');
        const folder2newnote = popup.document.getElementById('folder2newnote');
        const folder3newnote = popup.document.getElementById('folder3newnote');
        const folder4newnote = popup.document.getElementById('folder4newnote');
        console.log("Opened popup.");
        //3. Add an event listener to every button in the popup.
        //When click, the popup should close and load the original window to a note making menu
        //using newNote() from notes.js.
        folder1newnote.addEventListener('click',function(){
            console.log("Chose to create note for folder1.");
            popup.close();
            newNote(1);
        });
        folder2newnote.addEventListener('click',function(){
            console.log("Chose to create note for folder2.");
            popup.close();
            newNote(2);
        });
        folder3newnote.addEventListener('click',function(){
            console.log("Chose to create note for folder3.");
            popup.close();
            newNote(3);
        });
        folder4newnote.addEventListener('click',function(){
            console.log("Chose to create note for folder4.");
            popup.close();
            newNote(4);
        });
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
function emptyNoteScreen(folderNum, titles, text){
    console.log("On emptyNoteScreen for folder"+folderNum+".");
    //create the folder navigation bar and the "no notes" screen
    const folderNavHTML = `
            <div class="folderNav" style="background-color: white; width: 100%; 
            margin-top: 44px;">
                <button id="folder1" style="background-color: #add8e6;">Folder 1</button>
                <button id="folder2" style="background-color: #add8e6;">Folder 2</button>
                <button id="folder3" style="background-color: #add8e6;">Folder 3</button>
                <button id="folder4" style="background-color: #add8e6;">Folder 4</button>
            </div>
            `
            const notebuttonHTML = `
            <table class="noNoteandCreateNote">
            <tr>
            <td><p>No Notes.</p>
            </td>
            <tr>
            <tr>
                <td><button class = "newNoteButton" id = "createanote">Create Note.</button>
                </td>
                <tr>
                </table>
        `;

        //if the folder is empty, aka no notes in the folder
        if(titles == '' && text == ''){
        //get the folder navigation bar, the note list table, and create note button
        const folderNav = document.querySelector('.folderNav');
        const noteList = document.querySelector('.noteList');
        const createanote = document.getElementById('createanote');
        //if there is no foldernav, that means we logged in for first time. 
        //add it to the document along the create note button/table.
        if(!folderNav){
            document.body.innerHTML += folderNavHTML+notebuttonHTML;
        }
        //if there IS a foldernav, along with the folder we're going to being an empty folder, then remove notelist if it exists.
        //only add create note button because the text "no notes" will already be there.
        else if (folderNav){
            //if notelist exists, that means previous folder had notes. remove it since the current folder has no list because no notes to make a list.
            if(noteList){
                //remove notelist.
                noteList.remove();
                //remove the createanote button since we're adding a new one.
                createanote.remove();
                //add the no note table.
                document.body.innerHTML += notebuttonHTML;
                //go back to buttonClick to travel between folders again.
                buttonClick();
            }
            //if notelist does NOT exist, then previous button was also empty. Nothing to change.
            else if(!noteList){
            }  
        }
        
    }
    //if the folder we're going to DOES have notes...
    else{
    //if the previous had no notes, remove the no notes table.
    const noNoteandCreateNote = document.querySelector('.noNoteandCreateNote');
        if(noNoteandCreateNote){
            noNoteandCreateNote.remove();
            /*createanote2.remove();
            const createnoteHTML = `
            <button id="createanote">Create Note</button>
            `
            document.body.innerHTML += createnoteHTML;*/
        } 
        //if the previous did not have a no notes table, then it had a noteList.
        //to go from a folder with notes to another folder with notes then dont do anything
        else if(!noNoteandCreateNote){
            
        }
        console.log("There are notes. Loading page...");
        buttonClick("hi");
    }
    
}
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################
/*
This is takes in a folder and an id of one of the folder's notes. 
its index in the array comes from the last number in the id (example: id F4N40, the index of the note in the array is 40)
Call loadNote in notes.js to load the note.
*/
function reLoadANote(folderNum, id){
    const index = parseInt(id.substring(3));
    loadNote(folderNum, index);
}

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
function showNotes(folderNum, titles, text){
    console.log("Loading notes list for folder"+folderNum);
    //If, somehow, a folder with no notes is passed in, then go straight to the empty note screen using emptyNoteScreen().
    if(titles == '' && text == ''){
        console.log("No notes to load. Going to empty note screen for folder"+folderNum);
        emptyNoteScreen(folderNum, titles, text);
    }
    //Otherwise, if there are notes, then remove the previous elements. This is because a new element will be added.
    else{
        //remove createanote button if it is there.
        const createanote2 = document.getElementById('createanote');
        if(createanote2){
            createanote2.remove();
        }
        //remove the previous notes list if its shown, as the new one will be the updated one.
        const notelists = document.querySelector('.noteList');
        if(notelists){
            notelists.remove();
        }
        //html for the folder navigation bar.
        const folderNavHTML = `
        <div class="folderNav" style="background-color: white; width: 100%; 
         margin-top: 44px;">
            <button id="folder1" style="background-color: #add8e6;">Folder 1</button>
            <button id="folder2" style="background-color: #add8e6;">Folder 2</button>
            <button id="folder3" style="background-color: #add8e6;">Folder 3</button>
            <button id="folder4" style="background-color: #add8e6;">Folder 4</button>
        </div>
        `;
        //if the folder nav is somehow not on the screen already, add it.
        const folderNav = document.querySelector('.folderNav');
        if(!folderNav){
            document.body.innerHTML += folderNavHTML;
        }
        //create a new table for the list of notes to show.
        const noteListTable = document.createElement('table');
        //the table should have an id equal to "noteList"+the number of the current folder.
        noteListTable.id = `noteList${folderNum}`;
        //Give the noteList table a class called "noteList"
        noteListTable.classList.add('noteList');
        //Create a "Create Note" button.
        const createanote = document.createElement('button');
        //give it id "creatanote"
        createanote.id = 'createanote';
        //update its text content
        createanote.textContent = 'Create Note';
        //create an array to hold the id of every individual note
        const noteidsarray = [];
        //for every note in the folder, update the noteList table.
        for (let i = 0; i < titles.length; i++) {
            //for every note, add a row, a cell for the button, and a button for the individual note.
            const row = document.createElement('tr');
            const buttonCell = document.createElement('td');
            const noteButton = document.createElement('button');
            //style the note buttons.
            noteButton.style.width = '250px'; 
            noteButton.style.textAlign = 'left';
            //make the text of the note buttons the title of the note itself.
            noteButton.innerText = titles[i];
            //make an ID for each note equal to the folder number and the index of the note in the array.
            //for example: if the note is in folder 3 and its place in the array is 5, then the id of the note's button is F3N5.
            const noteButtonID = "F"+folderNum+"N"+i;
            //put the id of the note into the note id array.
            noteidsarray.push(noteButtonID);
            //make the id of every button equal to the noteButtonID created above.
            noteButton.id = noteButtonID;
            console.log("Added button for title "+titles[i]);
            //add the note's button to the buttoncell (basically the table data), then the button cell into the noteList table's row, then the row into the noteList table.
            buttonCell.appendChild(noteButton);
            row.appendChild(buttonCell);
            noteListTable.appendChild(row);
        }
        //style the noteList table.
        noteListTable.style.height = '300px';
        noteListTable.style.overflowY = 'scroll';
        noteListTable.style.display = 'block';
        console.log("Note list appended.");
        //Add the noteList table onto the document along with the create a note button.
        document.body.appendChild(noteListTable);
        document.body.appendChild(createanote);
        //call emptyNoteScreen even if the folder actually have notes. this is because without it, you
        //1. wouldnt be able to view other folders after appending the tables and
        //2. calling buttonClick() here would cause formatting issues for the other folders.
        emptyNoteScreen(folderNum, titles, text);
        //for each id in the noteidsarray call reLoadNote whenever they are clicked. This will reload the notes for editting.
        noteidsarray.forEach(id => {
            //get button based on the id
            const button = document.getElementById(id);
            //add an event listener to the buttons made
            button.addEventListener('click', function() {
                //call reLoadNote with the folderNum and the id of the note
                reLoadANote(folderNum, id); // Call your function here
            });
        });
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
function loadFolderNotes(folderID){
    //1. Remove any existing html elements.
    const noteContent = document.querySelector('.noteContent');
    if(noteContent){
        noteContent.remove();
    }
    const titleNote  = document.querySelector('.titleNote ');
    if(titleNote ){
        titleNote .remove();
    }
    //2. Use retrieveNoteTitle to retrieve the titles entered in the title box for new notes.
    //Do the same for note text.
    const noteTitle = retrieveNoteTitle(folderID);
    const noteText = retrieveNoteText(folderID);
    console.log("Checking folder"+folderID+" for notes....");
    //If the retrieve functions return nothing, then go to emptyNoteScreen() to load a table that tells the user there are no notes to show.
    if(noteText == '' && noteTitle == ''){
        console.log("Checked. No notes for Folder"+folderID);
        console.log("Going to emptyscreen for folder"+folderID);
        emptyNoteScreen(folderID, noteText, noteTitle);
    }
    //Otherwise, if the retrieve functions return SOMETHING (meaning the folder has a note),
    //add those titles and texts into 2 arrays. Pass those arrays into showNotes to load a table with the notes onto the screen.
    else{
        console.log("Checked. There are notes, beginning to load for Folder "+folderID);
        //Two arrays for the titles and texts
        let noteTitleArray = [];
        let noteTextArray = []; 
        //add titles and texts into the array
        noteTitleArray = noteTitleArray.concat(noteTitle);
        noteTextArray = noteTextArray.concat(noteText);
        //Call showNotes with the folder id and the two arrays.
        console.log("Adding Titles: "+noteTitleArray);
        console.log("Adding Texts: ");
        showNotes(folderID, noteTitleArray, noteTextArray)
    }
}

    
    
