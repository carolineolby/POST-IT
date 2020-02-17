let notes = document.querySelectorAll(".note")

for(let note of notes){
    let editBtn = note.querySelector(".edit-btn")
    let title = note.querySelector(".note__title")
    let content = note.querySelector(".note__content")
    let update = note.querySelector(".form__Update")

    editBtn.addEventListener("click", (event) => {
        update.classList.toggle("hidden")
        title.classList.toggle("hidden")
        content.classList.toggle("hidden")
    })
}