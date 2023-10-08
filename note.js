const noteTextArray = [];
const noteTitlesArray = [];

function newNote() {
  
    const showNotesTable = document.querySelector('.showNotes');
    if (showNotesTable) {
        showNotesTable.parentNode.removeChild(showNotesTable);
    }
    const noteListTable = document.querySelector('.noteList');
    if (noteListTable) {
        noteListTable.parentNode.removeChild(noteListTable);
    }

    const createNote = document.getElementById('createNote');
    if (createNote) {
        createNote.parentNode.removeChild(createNote);
    }



  
    const newNoteTableHTML = `
        <table class="titleNote" style="margin: 0 auto;">
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
                    <textarea id="noteText" style="width: 250px; height: 200px; background-color: #f0f0f0;"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <button height: 30px;" id="saveNoteButton">Save</button>
                    <button style="width: 30px; height: 30px;"></button>
                    <button style="width: 30px; height: 30px;"></button>
                </td>
            </tr>
        </table>
    `;
document.body.innerHTML += newNoteTableHTML + noteContentTableHTML;
    const saveNoteButton = document.getElementById('saveNoteButton');
    saveNoteButton.addEventListener('click', function(){
        const noteText = document.getElementById('noteText').value;
        const noteTitle = document.getElementById('noteTitle').value;
        noteTextArray.push(noteText);
        noteTitlesArray.push(noteTitle);



        const script = document.createElement('script');
        //the script source is notes.js
        script.src = 'folders.js';
        //add notes.js to the document
        document.head.appendChild(script);
        //when notes.js is loaded, call newNote()
        script.onload = function() {
            loadNotes(noteTextArray, noteTitlesArray);
        } 
    });
    
}

function loadNote(){

}
