function showFolders() {
    //variable folderNavHTML represents the new navigation bar to look at folders
    const folderNavHTML = `
        <div class="folderNav" style="background-color: white; width: 100%;">
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
}

