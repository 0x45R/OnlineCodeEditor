import { CustomWindow } from './customWindow.js'
import { CodeEditor } from './codeEditor.js'
import { IFrameWindow } from './iframe.js'
import bashEmulator from "bash-emulator";

export const getEmulator = () => {
  let result
  if(!localStorage.bashEmulator){
    result = bashEmulator({
      workingDirectory: "/",
      fileSystem: {
        "/":{type:'dir', modified:Date.now()},
      }
    })
  }
  else{
    var state = JSON.parse(localStorage.bashEmulator || '{}')
    result = bashEmulator(state)
  }
  return result;
}

export const emulator = getEmulator()


emulator.commands.commands = (env) => {
  env.output("Available commands:\n")
  env.output(Object.keys(emulator.commands).join("\n"))
  env.exit()
}
emulator.commands.clear = (env, args) => {
  env.output("pleaseclear")
  env.exit()
}
emulator.commands.exit = (env, args) => {
  env.output("exitnowplease")
  env.exit()
}
emulator.commands.edit = (env, args) => {
  if(args.join('').trim().length == 0){
    env.error("No file to open")
    env.exit()
    return;
  }
  document.querySelector('window-manager').createNewWindow(CodeEditor.new(args[0]))
  env.exit()
}
emulator.commands.iframe = (env, args) => {
  if(args.join('').trim().length == 0){
    env.error("No file to open")
    env.exit()
    return;
  }
  document.querySelector('window-manager').createNewWindow(IFrameWindow.new(args[0]))
  env.exit()
}
// https://gist.github.com/zentala/1e6f72438796d74531803cc3833c039c
function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Bytes';
   var k = 1024,
       dm = decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/*
    this.emulator.commands.clear = (env)=> {
      console.log(env)
      this.content = ''
    }
    this.emulator.commands.exit = (env) => {
      console.log(this) 
      this.removeWindow();
    }
    this.emulator.commands.edit = (env) => {
      this.windowManager.createNewWindow('code-editor')
    }*/

export var storageLeft = () => {
 return formatBytes(1024 * 1024 * 5 - escape(encodeURIComponent(JSON.stringify(localStorage))).length, 2)
}

export const saveState = () => {
  localStorage.bashEmulator = JSON.stringify(emulator.state)
  document.querySelector(".status-indicator").innerText= `Storage left: ${storageLeft()}`
}
//emulator.run().then(saveState)

export class TerminalEmulator extends CustomWindow{
  constructor(){
    super();
  }

  static new(){
    let elem = document.createElement("terminal-emulator")
    console.log(elem)
    return elem
  }

  set content(val){
    this._content = val;
    if(this.querySelector('.terminal-emulator-content')){
      this.querySelector('.terminal-emulator-content').innerText = val;
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
    this.log(`$ ${cmd}`)
    return emulator.run(cmd).then((value)=>{this.log(value)}, (value)=>{this.error(value)}).then(saveState)
  }

  log(result){
    if(result == `pleaseclear`){
      this.content = ""
      return;
    }if(result == `exitnowplease`){
      this.removeWindow()
      return;
    }if(result){
      this.content = this.content + result+"\n"          
      this.querySelector('.terminal-emulator-content').scrollTop = this.querySelector(".terminal-emulator-content").scrollHeight
    }
  }
 
  customFocus(){
    this.windowManager.selectedWindow = this
    this.querySelector(".terminal-emulator-input").focus()
  }


  connectedCallback(){
    if(!this.created){
      this.created =  true
      this.title = "terminal emulator"
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
      this.terminal_emulator_content = this.querySelector(".terminal-emulator-content")
      this.terminal_emulator_content.innerHTML = this.content
      this.classList.add("window-container")

      this.querySelector(".window-title").innerHTML = this.title

      this.terminal_emulator_input = this.querySelector('.terminal-emulator-input')
      this.terminal_emulator_input.addEventListener('keydown', (e)=>{
        console.log(e)
        let target = this.terminal_emulator_input
        if(e.key == "Enter"){
          if(target.value.trim().length != 0){
            this.run(target.value)
            target.value = ""
          }
        }
      })
      this.querySelector(".window-close-button").addEventListener('click', ()=>{this.removeWindow()})
      this.addEventListener('mouseover', ()=>{this.customFocus()})


      this.run('pwd')
    }
  }
}

customElements.define("terminal-emulator",TerminalEmulator)

