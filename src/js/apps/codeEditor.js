import { CustomWindow } from '/src/js/apps/customWindow.js'
import {emulator, saveState} from '/src/js/apps/terminalEmulator.js'

export class CodeEditor extends CustomWindow{
  constructor(){
    super();

  }
   get content(){
    if(this._content == undefined){
      return "Empty"
    }
    return this._content
  }
 
  set content(val){
    this._content = val;   
    this.querySelector(".custom-text-editor").innerHTML = val
  }

  saveContent(){
    emulator.remove(this.file).then(()=>{emulator.write(this.file, this.content)}).then(()=>{saveState()})
    console.log(this.file, this.content, "CONTENT")
  }

  set file(val){
    this._file = val
  }

  get file(){
    if(this._file == undefined){
      this._file = "new file"
    }
    return this._file
  }

  static new(file){
    let elem = document.createElement("code-editor")
    elem.file = file
    console.log("E", emulator)
    emulator.read(file).then((data)=>{console.log(data);elem.content=data})
    return elem
  }

  customFocus(){
    this.windowManager.selectedWindow = this
    this.querySelector(".custom-text-editor").focus()
  }

  parseTextEditor(e){
    let val = e.target.value
    let lines = val.split("\n").length
    let editorcols = this.querySelector(".custom-text-editor-columns")
    this.content = val
    console.log(this.content, "CONTENT")
    editorcols.innerHTML = ""
    for(let i = 1; i < lines+1; i++){
      let paragraph = document.createElement("p")
      paragraph.innerText = i
      editorcols.appendChild(paragraph)
    }
  }
  connectedCallback(){
    this.title = `code editor - ${this.file}`
    this.innerHTML = `
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">          
          <i class="ti ti-player-play"></i>
          <i class="ti ti-device-floppy code-save-button"></i>
          <i class="ti ti-download code-download-button"></i>
          <i class="ti ti-x window-close-button"></i>
        </div>
      </div>
      <div class="window-content">
        <div class='custom-text-editor-columns'>1</div><textarea wrap='off' class='custom-text-editor' spellcheck='false'></textarea>
      </div>
    `  
    this.querySelector(".custom-text-editor").innerHTML = this.content
    this.classList.add("window-container")

    this.querySelector(".custom-text-editor").addEventListener("input", (e)=>{this.parseTextEditor(e)})
    this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})
    this.querySelector(".code-save-button").addEventListener("click", ()=>{this.saveContent()})
    
    this.querySelector(".window-title").innerHTML = this.title

    this.addEventListener('mouseover', ()=>{this.customFocus()})


  }
  //  this.content =  "<div class='custom-text-editor-columns'>1</div><textarea wrap='off' class='custom-text-editor' spellcheck='false'></textarea>"
 
     //this.querySelector(".custom-text-editor").addEventListener("input", (e)=>{this.parseTextEditor(e)})

}

customElements.define("code-editor",CodeEditor)
