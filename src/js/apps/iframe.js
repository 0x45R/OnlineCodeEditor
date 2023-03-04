import { CustomWindow } from '/src/js/apps/customWindow.js'
import {emulator, saveState} from '/src/js/apps/terminalEmulator.js'


export class IFrameWindow extends CustomWindow{
  constructor(){
    super();
  }
 
  static new(file){
    let elem = document.createElement("iframe-window")
    elem.file = file
    emulator.read(file).then((data)=>{console.log(data);elem.content=data})
    return elem
  }
   get content(){
    if(this._content == undefined){
      return ""
    }
    return this._content
  }
 
  set content(val){
    this._content = val;  
    let iframecontent = this.querySelector(".iframe-window-content")
    if(iframecontent != undefined){
      iframecontent.contentWindow.document.open();
      iframecontent.contentWindow.document.write(val);
      iframecontent.contentWindow.document.close();
    }
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
  connectedCallback(){
    this.created =  true
    this.title = `iframe - ${this.file}`
    this.innerHTML = `
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">          
          <i class="ti ti-refresh window-refresh-button"></i>         
          <i class="ti ti-download code-download-button"></i>
          <i class="ti ti-x window-close-button"></i>
        </div>
      </div>
      <div class="window-content">
        <iframe wrap='off' class='iframe-window-content' spellcheck='false'></iframe>
      </div>
    `  
    this.content = this.content
    this.classList.add("window-container")

    this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})
    this.querySelector(".window-refresh-button").addEventListener("click", ()=>{
      emulator.read(this.file).then((data)=>{
        console.log(data);this.content=data;this.connectedCallback()
      })
      
    })

    this.querySelector(".window-title").innerHTML = this.title

    this.addEventListener('mouseover', ()=>{this.customFocus()})
  
  }
}

customElements.define("iframe-window",IFrameWindow)