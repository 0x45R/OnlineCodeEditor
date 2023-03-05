import { IFrameWindow } from "./apps/iframe";
import { CustomWindow } from "/src/js/apps/customWindow.js";
import { TerminalEmulator } from "/src/js/apps/terminalEmulator.js";

export class WindowManager extends HTMLElement{
  constructor(){
    super();
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
    if(this._selectedWindow != undefined){
      if(this._selectedWindow != val){
        this._selectedWindow.customFocus();
      }
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

  createNewWindow(element){
    let customWindow = element
    if(!this.querySelector('window-column')){
      this.appendChild(document.createElement("window-column"))
    }
    this.querySelector("window-column").appendChild(customWindow)
    this.selectedWindow = customWindow
    return customWindow
  }

  connectedCallback(){
    this.createNewWindow(TerminalEmulator.new("run autostart.js"))

    document.addEventListener("keydown", (e)=>{
      console.log(e.key, e.shiftKey, e.altKey)
      if(e.key == "ArrowDown" && e.shiftKey && e.altKey){
        this.moveSelectedWindowVertically(1)
        return;
      }
      if(e.key == "ArrowDown" && e.altKey){
        this.selectWindowInColumn(1);
        return;
      }

      if(e.key == "ArrowUp" && e.shiftKey){
        this.moveSelectedWindowVertically(-1)
        return;
      }
      if(e.key == "ArrowUp" && e.ctrlKey){
        this.selectWindowInColumn(-1);        
        return;
      }

      if(e.key == "ArrowLeft" && e.shiftKey){
        e.preventDefault();
        this.moveSelectedWindowHorizontally(-1);        
        return;
      }
      if(e.key == "ArrowLeft" && e.altKey ){
        e.preventDefault();
        this.selectWindowInRow(-1);       
        return;
      }

      if(e.key == "ArrowRight" && e.shiftKey){
        e.preventDefault();
        this.moveSelectedWindowHorizontally(1);       
        return;
      }

      if(e.key == "ArrowRight" && e.altKey ){
        e.preventDefault();
        this.selectWindowInRow(1);       
        return;
      }

      if(e.key == "Enter" && e.altKey){
        this.createNewWindow(TerminalEmulator.new())
        return;
      }
      if(e.key == "Q"  && e.altKey){
        this.selectedWindow.removeWindow();
        this.selectedWindow = this.querySelector('.window-container')
        return;
      }
    })
  }
}



customElements.define("window-manager", WindowManager)
