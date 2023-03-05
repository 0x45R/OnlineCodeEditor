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
    if(!this.created || this.reloadEverytime){
      this.created =  true
      this.basicStructure();
      
      let buttons = document.createElement('div')
      buttons.classList.add("basic-buttons")
      buttons.innerHTML = `<i class="ti ti-arrows-move window-move-button window-button"></i><i class="ti ti-x window-close-button window-button"></i>`
      this.querySelector(".window-buttons").appendChild(buttons)

      this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})
      this.addEventListener('mouseover', ()=>{this.customFocus()})
    
      document.addEventListener('mousemove', (e)=>{
        floatWindow(e)
      })

      this.querySelector('.window-move-button').addEventListener('mousedown', (e)=>{
        if(!this.classList.contains("follow-cusor")){
          this.classList.add('follow-cursor')
          this.classList.add("window-floating")
          floatWindow(e)
        }
      })

      this.querySelector('.window-move-button').addEventListener('mouseup', (e)=>{
        if(this.classList.contains("follow-cursor")){
          this.classList.remove('follow-cursor')
          this.classList.remove('window-floating')
        }
      })

      const floatWindow = (e) => {
        let result = this.querySelector('.window-move-button')
        let childBoundingRect = result.getBoundingClientRect()
        let parentBoundingRect = this.getBoundingClientRect()

        let leftOffset = childBoundingRect.left - parentBoundingRect.left
        let topOffset = childBoundingRect.top - parentBoundingRect.top

        if(this.classList.contains("follow-cursor")){
          this.style.top = e.clientY-(topOffset + childBoundingRect.height*2.5)+"px"//childBoundingRect.top - parentBoundingRect.top  +"px"//e.clientY-result.getBoundingClientRect().y + "px"
          this.style.left = e.clientX-(leftOffset + childBoundingRect.width)+'px'//childBoundingRect.left - parentBoundingRect.left   + "px"//e.clientX-result.getBoundingClientRect().x+ "px"
        }
      }
    } 
  }
  basicStructure(){
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
