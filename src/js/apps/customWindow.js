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
    this.windowManager.selectedWindow = this
    this.querySelector('.window-content').focus()
  }

  removeWindow(){
    if(!this.parentElement){
      return;
    }
    if(this.windowManager){
      console.log(this.windowManager.selectedWindow);
    }
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
    this.querySelector(".window-content").innerHTML = this.content
    this.classList.add("window-container")
    this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})
    this.addEventListener('mouseover', ()=>{this.customFocus()})

    this.querySelector(".window-title").innerHTML = this.title

    
  }
}
customElements.define("custom-window", CustomWindow)
