import bashEmulator from "bash-emulator";

export class WindowManager extends HTMLElement{
  constructor(){
    super();
    this.innerHTML = `<window-column class="window-column"></window-column>`
    this.lastKeypress = Date.now()
  }

  get windowColumns(){
    return this.querySelectorAll(".window-column")
  }

  get allWindows(){
    return this.querySelectorAll(".window-container")
  }

  get selectedWindow(){
    if(this._selectedWindow == undefined){
      this._selectedWindow = this.querySelector(".window-container")
      return this._selectedWindow
    }
    return this._selectedWindow
  }

  set selectedWindow(val){
    this.selectedWindow.classList.remove("selected-window")
    this._selectedWindow = val;
    if(this._selectedWindow){
      this._selectedWindow.customFocus();
      console.log(document.activeElement, val)
      val.classList.add("selected-window")
    }
  }

  createNewColumn(axis){
    let column = document.createElement("window-column")
    column.classList.add("window-column")
    if(axis > 0){
      this.appendChild(column)
    }else{
      this.prepend(column)
    }
    return column
  }

  moveSelectedWindowHorizontally(axis){
    let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(this.children)
    let index = children.indexOf(selectedColumn)+axis
    
    let outOfBounds = (index < 0 || index > children.length -1)
    let moreThanOneChild = (selectedColumn.children.length > 1)

    if(moreThanOneChild){
      if(outOfBounds){
        let column = this.createNewColumn(axis)
        column.appendChild(this.selectedWindow)
      }
      else{
        let column = children[index]
        column.appendChild(this.selectedWindow)
      }
    }
    else if(!outOfBounds){
      let column = children[index]
      this.selectedWindow.parentElement.remove();
      column.appendChild(this.selectedWindow)
    }
    /*
    if(outOfBounds && moreThanOneChild){
      let column = this.createNewColumn(axis)
      column.appendChild(this.selectedWindow)
    }
    if(!outOfBounds && moreThanOneChild ){
      let column = children[index]
      column.appendChild(this.selectedWindow)
    }
    if(!outOfBounds){
      let column = children[index]
      this.selectedWindow.parentElement.remove();
      column.appendChild(this.selectedWindow)
    }
  */
    
  }

  moveSelectedWindowVertically(axis){
    /*let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(selectedColumn.children)
    let index = children.indexOf(this.selectedWindow)+axis
    let outOfBounds = (index < 0 || index > children.length -1)

    if(selectedColumn.children.length > 1){
      if(!outOfBounds){
        let temp = children[index]
        selectedColumn.replaceChild(this.selectedWindow, children[index])
        selectedColumn.appendChild(temp)
        //children[index] = this.selectedWindow
        console.log(selectedColumn, children, axis, index)
      }
    }*/
    
  }

  selectWindowInColumn(axis){
    let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(selectedColumn.children)
    let index = children.indexOf(this.selectedWindow)+axis
    if(index < 0){index = children.length+axis}
    if(index > children.length-1){index = 0}
    this.selectedWindow = children[index]
  }

  selectWindowInRow(axis){
    let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(this.children)
    let index = children.indexOf(selectedColumn)+axis
    if(index < 0){index = children.length+axis}
    if(index > children.length-1){index = 0}
    let result = children[index].children[0]
    this.selectedWindow = result
  }

  createNewWindow(tag){
    let customWindow = document.createElement(tag)
    if(!this.querySelector('window-column')){
      this.appendChild(document.createElement("window-column"))
    }
    this.querySelector("window-column").appendChild(customWindow)
    this.selectedWindow = customWindow
  }

  connectedCallback(){
    this.createNewWindow("terminal-emulator")
    document.addEventListener("keydown", (e)=>{

      if(e.key == "ArrowDown" && e.shiftKey){
        this.moveSelectedWindowVertically(1)
        return;
      }
      if(e.key == "ArrowDown"){
        this.selectWindowInColumn(1);
        return;
      }

      if(e.key == "ArrowUp" && e.shiftKey){
        this.moveSelectedWindowVertically(-1)
        return;
      }
      if(e.key == "ArrowUp"){
        this.selectWindowInColumn(-1);        
        return;
      }

      if(e.key == "ArrowLeft" && e.shiftKey){
        this.moveSelectedWindowHorizontally(-1);        
        return;
      }
      if(e.key == "ArrowLeft"){
        this.selectWindowInRow(-1);       
        return;
      }

      if(e.key == "ArrowRight" && e.shiftKey){
        this.moveSelectedWindowHorizontally(1);       
        return;
      }

      if(e.key == "ArrowRight"){
        this.selectWindowInRow(1);        
        return;
      }

      if(e.key == "Enter" && e.shiftKey){
        this.createNewWindow("terminal-emulator");
        return;
      }
      if(e.key == "W"){
        this.selectedWindow.removeWindow();
        this.selectedWindow = this.querySelector('.window-container')
        return;
      }
    })
  }
}

export class CustomWindow extends HTMLElement{
  constructor(){
    super();
  }

  get windowManager(){
    return this.parentElement.parentElement
  }

  set created(val){
    this.setAttribute("created", val)
  }

  get created(){
    if(!this.hasAttribute("created")){
      return false
    }
    return this.getAttribute("created") === "true"
  }

  set title(val){
    this.setAttribute("title", val)
  }

  get title(){
    if(!this.hasAttribute("title")){
      this.setAttribute('title', "empty")
    }
    return this.getAttribute("title")
  }

  set content(val){
    this._content = val;
  }

  get content(){
    if(this._content == undefined){
      return "Empty"
    }
    return this._content
  }
 
  customFocus(){
    this.querySelector('.window-content').focus()
  }

  removeWindow(){
    if(!this.parentElement){
      return;
    }
    if(this.parentElement.children.length==1){
      this.parentElement.remove()
    }
    if(this.windowManager){
      console.log(this.windowManager.selectedWindow);
    }
    this.remove()
  }

  connectedCallback(){
    this.innerHTML = `
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">
          <i class="ti ti-x window-close-button"></i>
        </div>
      </div>
      <div class="window-content">
        ${this.content}
      </div>
    `  
    this.querySelector(".window-content").innerHTML = this.content
    this.classList.add("window-container")
    this.queryselector(".window-close-button").addeventlistener('click', ()=>{this.removewindow()})

    this.querySelector(".window-title").innerHTML = this.title

    
  }
}

export class TerminalEmulator extends CustomWindow{
  constructor(){
    super();
    this.emulator = bashEmulator({
      workingDirectory: "/",
      fileSystem: {
        '/':{
          type:'dir',
          modified: Date.now()
        },
        '/README.txt':{
          type: "file",
          modified: Date.now(),
          content: "Hello!"
        }
      }
    })
    this.emulator.commands.clear = (env)=> {
      this.content = ''
    }
    this.emulator.commands.exit = (env) => {
      console.log(this) 
      this.removeWindow();
    }
  }
  set content(val){
    this._content = val;
    if(this.querySelector('.terminal-emulator-content')){
      this.querySelector('.terminal-emulator-content').innerHTML = val;
    }
  }
  get content(){
    return this._content;
  }

  error(result){
    if(result){
      this.content = this.content + result+"\n"
    }
  }

  run (cmd){
    this.log('$ ' + cmd)
    return this.emulator.run(cmd).then((value)=>{this.log(value)}, (value)=>{this.error(value)})
  }

  log(result){
    if(result){
      this.content = this.content + result+"\n"          
      this.querySelector('.terminal-emulator-content').scrollTop = this.querySelector(".terminal-emulator-content").scrollHeight
    }
  }
 
  customFocus(){
    this.querySelector(".terminal-emulator-input").focus()
  }


  connectedCallback(){
    if(!this.created){
      this.created =  true
      this.title = "Terminal Emulator"
      this.content = ""
      this.innerHTML = `
        <div class="window-titlebar">
          <p class="window-title">${this.title}</p>
          <div class="window-buttons">     
            <i class="ti ti-x window-close-button"></i>
          </div>
        </div>
        <div class="window-terminal-content">
          <p class='terminal-emulator-content' spellcheck='false'></p>
          <input type='text' class='terminal-emulator-input'></input>
        </div>
      `  
      this.querySelector(".terminal-emulator-content").innerHTML = this.content
      this.classList.add("window-container")

      this.querySelector(".window-title").innerHTML = this.title

      this.querySelector(".terminal-emulator-input").addEventListener('keydown', (e)=>{
        console.log(e)
        let target = this.querySelector('.terminal-emulator-input')
        if(e.key == "Enter"){
          this.run(target.value)
          target.value = ""
        }
      })
      this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})

      this.run('pwd')
    }
  }
}
export class CustomTextEditor extends CustomWindow{
  constructor(){
    super();

  }

  customFocus(){
    this.querySelector(".custom-text-editor").focus()
  }

  parseTextEditor(e){
    let val = e.target.value
    let lines = val.split("\n").length
    let editorcols = this.querySelector(".custom-text-editor-columns")
    this.content = val
    editorcols.innerHTML = ""
    for(let i = 1; i < lines+1; i++){
      let paragraph = document.createElement("p")
      paragraph.innerText = i
      editorcols.appendChild(paragraph)
    }
  }
  connectedCallback(){
    this.title = "Code editor"
    this.content = ""
    this.innerHTML = `
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">
        </div>
      </div>
      <div class="window-content">
        <div class='custom-text-editor-columns'>1</div><textarea wrap='off' class='custom-text-editor' spellcheck='false'></textarea>
      </div>
    `  
    this.querySelector(".custom-text-editor").innerHTML = this.content
    this.classList.add("window-container")

    this.querySelector(".custom-text-editor").addEventListener("input", (e)=>{this.parseTextEditor(e)})
  
    this.querySelector(".window-title").innerHTML = this.title
  }
  //  this.content =  "<div class='custom-text-editor-columns'>1</div><textarea wrap='off' class='custom-text-editor' spellcheck='false'></textarea>"
 
     //this.querySelector(".custom-text-editor").addEventListener("input", (e)=>{this.parseTextEditor(e)})

}

customElements.define("window-manager", WindowManager)
customElements.define("custom-window", CustomWindow)
customElements.define("code-editor",CustomTextEditor)
customElements.define("terminal-emulator",TerminalEmulator)
