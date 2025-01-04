function openPopUp() {
    popUp.style.display = "block";
}
function closePopUp() {
    popUp.style.display = "none";
    nameInput.value = "";
}

window.onclick = function(event) {
    if (event.target == popUp) {
        closePopUp()
    }
}

colourInput.onchange = function() {
	colourPickerWrapper.style.backgroundColor = colourInput.value;    
}
colourPickerWrapper.style.backgroundColor = colourInput.value;