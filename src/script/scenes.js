let html = {
    "main menu": {
        onenter: () => {
            add(new Button("CANVAS_WIDTH/2", "CANVAS_HEIGHT/2 + 20", 400, 40, "New project", "#111", false, () => {
                    changeScene("creation menu")
                }
            ))
            add(new Button("CANVAS_WIDTH/2", "CANVAS_HEIGHT/2 + 70", 400, 40, "Load project", "#111", false,() => {
                    changeScene("loadsave menu")
                }
            ))
            add(new Button("CANVAS_WIDTH/2", "CANVAS_HEIGHT/2 + 120", 400, 40, "Options", "#111", false, () => {
                }, () => (true)
            ))
        },
        draw: () => {
            ctx.textAlign = "center"
            ctx.font = "bold 40px Arial"
            ctx.fillStyle = "#000"
            ctx.fillText("Simple Program Editor", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 70)
        },
        onexit: () => {
        }
    },
    "loadsave menu": {
        enter: [loadMenu],
        exit: [loadMenu],
        onenter: () => {
            currentSaveFile = -1;
            loadMenu.innerHTML = "";
            for(let i=0; i<saveData.length; i++) {
                let project = document.createElement("div");
                project.className = "project"
                project.innerHTML = saveData[i].name;
                project.onclick = () => {
                    let selection = document.getElementsByClassName("project");
                    for(let select of selection) {
                        select.classList.remove("selected")
                    }
                    project.classList.add("selected")
                    currentSaveFile = Array.from(selection).indexOf(project);
                }
                loadMenu.appendChild(project)
            }

            add(new Button("CANVAS_WIDTH/2 + 150", "CANVAS_HEIGHT - 90", 140, 40, "Load", "#111", false, () => {
                    loadCurrentState()
                }, () => (currentSaveFile == -1)
            ))
            add(new Button("CANVAS_WIDTH/2", "CANVAS_HEIGHT - 90", 140, 40, "Delete", "#111", false, () => {
                    saveData.splice(currentSaveFile, 1);
                    localStorage.setItem("saveData", JSON.stringify(saveData));
                    let selection = document.getElementsByClassName("project");
                    loadMenu.removeChild(Array.from(selection)[currentSaveFile]);
                    currentSaveFile = -1;
                }, () => (currentSaveFile == -1)
            ))
            add(new Button("CANVAS_WIDTH/2 - 150", "CANVAS_HEIGHT - 90", 140, 40, "Back", "#111", false, () => {
                changeScene("main menu")
                }
            ))
        },
        draw: () => {
            ctx.textAlign = "center"
            ctx.font = "bold 20px Arial"
            ctx.fillStyle = "#000"
            ctx.fillText("Load file", CANVAS_WIDTH/2 - 175, 80)
        }
    },
    "creation menu": {
        enter: [titleInput],
        exit: [titleInput],
        onenter: () => {
            titleInput.value = "";
            titleInput.style.textTransform = "none";
            titleInput.placeholder = "Enter project title";
            add(new Button("CANVAS_WIDTH/2 + 105", "CANVAS_HEIGHT/2", 200, 40, "Create", "#111", false, () => {
                    addSaveData(titleInput.value)
                }, () => (titleInput.value.length == 0)
            ))
            add(new Button("CANVAS_WIDTH/2 - 105", "CANVAS_HEIGHT/2", 200, 40, "Back", "#111", false, () => {
                    changeScene("main menu")
                }
            ))
        },        
        draw: () => {
            ctx.textAlign = "center"
            ctx.font = "bold 20px Arial"
            ctx.fillStyle = "#000"
            ctx.fillText("Create file", CANVAS_WIDTH/2 - 155, CANVAS_HEIGHT/2 - 70)
        }
    },
    "play": {
        onenter: () => {
            add(new SideBar())
            add(new Selector())
            add(new WireHandle())
            add(new Button("CANVAS_WIDTH - 80", 20, 120, 40, "Create", "#111", false, () => {
                    openPopUp("colour")
                }
            ))
            add(new Button("CANVAS_WIDTH - 80", 60, 120, 40, "Clear", "#111", false, () => {
                    clearBlocks()
                }
            ))
            add(new Button("CANVAS_WIDTH - 80", 100, 120, 40, "Save", "#111", false, () => {
                    saveCurrentState()
                }
            ))
            add(new Button("CANVAS_WIDTH - 80", 140, 120, 40, "Exit", "#111", false, () => {
                    changeScene("main menu")
                }
            ))
            add(new scrollBar(200, 0, 20, 100))
        }
    }
}

let popUps = {
    "colour": {
        enter: [titleInput],
        exit: [titleInput],
        entities: [
            new popUp(0, 15, 500, 250, "#292929", "colour"), 
            new Button("CANVAS_WIDTH / 2", "CANVAS_HEIGHT / 2", 410, 40, "Colour Preview", "value", false, () => {
                    colourValue = "#"+(Math.random()*0xFFFFFF<<0).toString(16);
                }
            ),
            new Button("CANVAS_WIDTH / 2 - 105", "CANVAS_HEIGHT / 2 + 50", 200, 40, "Cancel", "#111", false, () => {
                    closePopUp("colour")
                }
            ), 
            new Button("CANVAS_WIDTH / 2 + 105", "CANVAS_HEIGHT / 2 + 50", 200, 40, "Create", "#111", false, () => {
                    createNewBlock()
                }, () => (titleInput.value.trim().length == 0 || types[titleInput.value.toUpperCase()] != undefined || Array.from(category("blocks")).filter((gate) => gate.type == "input").length == 0)
            )
        ],
        onenter: () => {
            titleInput.value = "",
            titleInput.placeholder = "Enter block name";
            titleInput.style.textTransform = "Uppercase";
        }
    }
}
