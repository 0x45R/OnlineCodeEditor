const KEYPRESSES = [];
const LOCKED = [];
document.addEventListener("keydown", (e)=>{if(!KEYPRESSES.includes(e.key)){KEYPRESSES.push(e.key);}})
document.addEventListener("keyup", (e)=>{KEYPRESSES.pop(e.key)})

export class WindowManager extends HTMLElement{
  constructor(){
    super();
    this.innerHTML = `<window-column class="window-column"></window-column>`
    this.lastKeypress = Date.now()
  }

  get windowColumns(){
    return this.querySelectorAll(".window-column")
  }
 
  get selectedWindow(){
    if(this._selectedWindow == undefined){
      return this.querySelector("custom-window")
    }
    return this._selectedWindow
  }

  set selectedWindow(val){
    this.selectedWindow.classList.remove("selected-window")
    this._selectedWindow = val;
    val.classList.add("selected-window")
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

  moveSelectedWindowFromColumn(axis){
    let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(this.children)
    let index = children.indexOf(selectedColumn)+axis
    if( (index < 0 || index > children.length -1) && selectedColumn.children.length > 1){      
      let column = this.createNewColumn(axis)
      column.appendChild(this.selectedWindow)  
    }
    else if(selectedColumn.children.length > 1) {
      let column = children[index]
      column.appendChild(this.selectedWindow)
    }
    else if(!(index < 0 || index > children.length -1)) {
      let column = children[index]
      this.selectedWindow.parentElement.remove();
      column.appendChild(this.selectedWindow)
    }
    
  }

  selectWindowInColumn(axis){
    let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(selectedColumn.children)
    let index = children.indexOf(this.selectedWindow)+axis
    if(index < 0){index = children.length+axis}
    if(index > children.length-1){index = 0}
    this.selectedWindow = children[index]
  }

  selectNeighboringWindow(axis){
    let selectedColumn = this.selectedWindow.parentElement
    let children = Array.from(this.children)
    let index = children.indexOf(selectedColumn)+axis
    if(index < 0){index = children.length+axis}
    if(index > children.length-1){index = 0}
    let result = children[index].children[0]
    this.selectedWindow = result
  }

  listenForKeyPresses(){
    if(KEYPRESSES.includes("Enter") && KEYPRESSES.includes("e") && !LOCKED.includes("Enter")){
      this.createNewWindow()
      LOCKED.push("Enter")
    }
    if(!KEYPRESSES.includes("Enter") && LOCKED.includes("Enter")){LOCKED.splice(LOCKED.indexOf("Enter", 1))}


    if(KEYPRESSES.includes("ArrowRight") && KEYPRESSES.includes("e") && !LOCKED.includes("ArrowRight")){
      this.moveSelectedWindowFromColumn(1)
      LOCKED.push("ArrowRight")
    }   
    if(KEYPRESSES.includes("ArrowRight") && !KEYPRESSES.includes("e") && !LOCKED.includes("ArrowRight")){
      this.selectNeighboringWindow(1)
      LOCKED.push("ArrowRight")
    }
    if(!KEYPRESSES.includes("ArrowRight") && LOCKED.includes("ArrowRight")){LOCKED.splice(LOCKED.indexOf("ArrowRight", 1))}

    if(KEYPRESSES.includes("ArrowLeft") && KEYPRESSES.includes("e") && !LOCKED.includes("ArrowLeft")){
      this.moveSelectedWindowFromColumn(-1)
      LOCKED.push("ArrowLeft")
    } 
    if(KEYPRESSES.includes("ArrowLeft") && !KEYPRESSES.includes("e") && !LOCKED.includes("ArrowLeft")){
      this.selectNeighboringWindow(-1)
      LOCKED.push("ArrowLeft")
    }
    if(!KEYPRESSES.includes("ArrowLeft") && LOCKED.includes("ArrowLeft")){LOCKED.splice(LOCKED.indexOf("ArrowLeft", 1))}



    if(KEYPRESSES.includes("ArrowUp") && !LOCKED.includes("ArrowUp")){
      this.selectWindowInColumn(-1)
      LOCKED.push("ArrowUp")
    }

    if(!KEYPRESSES.includes("ArrowUp") && LOCKED.includes("ArrowUp")){LOCKED.splice(LOCKED.indexOf("ArrowUp"),1)}


    if(KEYPRESSES.includes("ArrowDown") && !LOCKED.includes("ArrowDown")){
      this.selectWindowInColumn(1)
      LOCKED.push("ArrowDown")
    }
    if(!KEYPRESSES.includes("ArrowDown") && LOCKED.includes("ArrowDown")){LOCKED.splice(LOCKED.indexOf("ArrowDown"),1)}
  
  }

  createNewWindow(args = {title: "none", content:"none"}){
    let customWindow = document.createElement("custom-window")
    customWindow.setAttribute("title", args.title)
    customWindow.setAttribute("content", args.content)
    this.querySelector("window-column").appendChild(customWindow)
    this.selectedWindow = customWindow
  }

  connectedCallback(){
    this.createNewWindow({title: "Hello", content: `<iframe class="window-full" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`});
    this.createNewWindow();

    setInterval(()=>{this.listenForKeyPresses()}, 10)
  }
}

export class CustomWindow extends HTMLElement{
  constructor(){
    super();


  }
 
  set title(val){
    this.setAttribute("title", val)
  }

  get title(){
    return this.getAttribute("title")
  }

  set content(val){
    this.setAttribute("content", val)
  }

  get content(){
    return this.getAttribute("content")
  }

  removeWindow(){
    if(this.parentElement.children.length==1){
      this.parentElement.remove()
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
    this.classList.add("window-container")
    this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})
    
  }
}

customElements.define("window-manager", WindowManager)
customElements.define("custom-window", CustomWindow)
