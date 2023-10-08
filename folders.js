function showFolders() {
    //variable folderNavHTML represents the new navigation bar to look at folders
    const folderNavHTML = `
        <div class="folderNav" style="background-color: white; width: 100%; 
         margin-top: 44px;">
            <button id="folder1" style="background-color: #add8e6;">Folder 1</button>
        </div>
    `;
    //variable showNotesTableHTML represents the new table to show any notes made
    const showNotesTableHTML = `
        <table class="showNotes">
            <tr>
                <td>Nothing here! Add a note!</td>
            </tr>
            <tr>
                <td><button id="createNote">Create Note!</button></td>
            </tr>
        </table>
    `;
    //add the two variables to the body of popup.html
    document.body.innerHTML += folderNavHTML + showNotesTableHTML;

    const createNoteButton = document.getElementById('createNote');
    createNoteButton.addEventListener('click', function(){
        const script = document.createElement('script');
    //the script source is notes.js
    script.src = 'notes.js';
    //add notes.js to the document
    document.head.appendChild(script);
    //when notes.js is loaded, call newNote()
    script.onload = function() {
        newNote();
    } 
    });
    
}

function loadNotes(noteTextArray, noteTitlesArray){
    const noteContentTable = document.querySelector('.noteContent');
    noteContentTable.parentNode.removeChild(noteContentTable);

    const titleNoteTable = document.querySelector('.titleNote');
    titleNoteTable.parentNode.removeChild(titleNoteTable);

    const noteListContainer = document.createElement('div');
    noteListContainer.classList.add('noteListContainer');

    const noteListTable = document.createElement('table');
    noteListTable.classList.add('noteList');
    

    noteTitlesArray.forEach((title, index) => {
        const row = document.createElement('tr');
        const buttonCell = document.createElement('td');
        const noteButton = document.createElement('button');
    
        noteButton.style.width = '250px'; 
        noteButton.style.textAlign = 'left';
    
        noteButton.innerText = title;
        noteButton.id = `noteID${index}`;
        buttonCell.appendChild(noteButton);
        row.appendChild(buttonCell);
        noteListTable.appendChild(row);
    });    

    
    noteListContainer.style.width = '100%';
    noteListTable.style.height = '600px';
    noteListTable.style.overflowY = 'scroll';
    noteListTable.style.display = 'block';



    if (!document.getElementById('createNote')) {
        const newNoteButtonHTML = `
            <button id="createNote">Create Note!</button>
        `;
        document.body.innerHTML += newNoteButtonHTML;
    }
    
    document.body.appendChild(noteListTable);
    document.body.appendChild(noteListContainer);

    const createNoteButton = document.getElementById('createNote');

    createNoteButton.addEventListener('click', function(){

        const script = document.createElement('script');
        //the script source is notes.js
        script.src = 'notes.js';
        //add notes.js to the document
        document.head.appendChild(script);
        //when notes.js is loaded, call newNote()
        script.onload = function() {
            newNote();
        } 

    });
    
    
}


