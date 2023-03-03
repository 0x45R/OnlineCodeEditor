(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function i(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(t){if(t.ep)return;t.ep=!0;const n=i(t);fetch(t.href,n)}})();class c extends HTMLElement{constructor(){super(),this.innerHTML='<window-column class="window-column"></window-column>',this.lastKeypress=Date.now()}get windowColumns(){return this.querySelectorAll(".window-column")}get allWindows(){return this.querySelectorAll(".window-container")}get selectedWindow(){return this._selectedWindow==null?this.querySelector(".window-container"):this._selectedWindow}set selectedWindow(e){this.selectedWindow.classList.remove("selected-window"),this._selectedWindow=e,e.onFocus(),e.classList.add("selected-window")}createNewColumn(e){let i=document.createElement("window-column");return i.classList.add("window-column"),e>0?this.appendChild(i):this.prepend(i),i}moveSelectedWindowHorizontally(e){let i=this.selectedWindow.parentElement,o=Array.from(this.children),t=o.indexOf(i)+e,n=t<0||t>o.length-1;if(i.children.length>1&&(n?this.createNewColumn(e).appendChild(this.selectedWindow):o[t].appendChild(this.selectedWindow)),!n){let l=o[t];this.selectedWindow.parentElement.remove(),l.appendChild(this.selectedWindow)}}moveSelectedWindowVertically(e){}selectWindowInColumn(e){let i=this.selectedWindow.parentElement,o=Array.from(i.children),t=o.indexOf(this.selectedWindow)+e;t<0&&(t=o.length+e),t>o.length-1&&(t=0),this.selectedWindow=o[t]}selectWindowInRow(e){let i=this.selectedWindow.parentElement,o=Array.from(this.children),t=o.indexOf(i)+e;t<0&&(t=o.length+e),t>o.length-1&&(t=0);let n=o[t].children[0];this.selectedWindow=n}deleteSelectedWindow(){let e=this.selectedWindow.parentElement,i=Array.from(e.children);this.selectedWindow.remove(),this.selectedWindow=this.querySelector(".window-container"),i.length==1&&e.remove()}createNewWindow(e){let i=document.createElement(e);this.querySelector("window-column").appendChild(i),this.selectedWindow=i}connectedCallback(){this.createNewWindow("code-editor"),document.addEventListener("keydown",e=>{if(e.key=="ArrowDown"&&e.shiftKey){this.moveSelectedWindowVertically(1);return}if(e.key=="ArrowDown"){this.selectWindowInColumn(1);return}if(e.key=="ArrowUp"&&e.shiftKey){this.moveSelectedWindowVertically(-1);return}if(e.key=="ArrowUp"){this.selectWindowInColumn(-1);return}if(e.key=="ArrowLeft"&&e.shiftKey){this.moveSelectedWindowHorizontally(-1);return}if(e.key=="ArrowLeft"){this.selectWindowInRow(-1);return}if(e.key=="ArrowRight"&&e.shiftKey){this.moveSelectedWindowHorizontally(1);return}if(e.key=="ArrowRight"){this.selectWindowInRow(1);return}if(e.key=="Enter"&&e.shiftKey){this.createNewWindow("terminal-emulator");return}if(e.key=="W"){this.deleteSelectedWindow();return}})}}class d extends HTMLElement{constructor(){super()}set created(e){this.setAttribute("created",e)}set title(e){this.setAttribute("title",e)}get title(){return this.hasAttribute("title")||this.setAttribute("title","empty"),this.getAttribute("title")}set content(e){this._content=e}get content(){return this._content==null?"Empty":this._content}onFocus(){}removeWindow(){this.parentElement.children.length==1&&this.parentElement.remove(),this.remove()}connectedCallback(){this.innerHTML=`
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">
          <i class="ti ti-x window-close-button"></i>
        </div>
      </div>
      <div class="window-content">
        ${this.content}
      </div>
    `,this.querySelector(".window-content").innerHTML=this.content,this.classList.add("window-container"),this.queryselector(".window-close-button").addeventlistener("click",()=>{this.removewindow()}),this.querySelector(".window-title").innerHTML=this.title}}class a extends d{constructor(){super()}connectedCallback(){this.title="Terminal Emulator",this.content="",this.innerHTML=`
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">     
          <i class="ti ti-x window-close-button"></i>
        </div>
      </div>
      <div class="window-content">
        <textarea wrap='off' class='terminal-emulator-content' spellcheck='false'>${this.content}</textarea>
      </div>
    `,this.querySelector(".terminal-emulator-content").innerHTML=this.content,this.classList.add("window-container"),this.querySelector(".terminal-emulator-content").addEventListener("input",e=>{this.parseTextEditor(e)}),this.querySelector(".window-close-button").addEventListener("click",()=>{this.removeWindow()}),this.querySelector(".window-title").innerHTML=this.title}}class w extends d{constructor(){super()}parseTextEditor(e){let i=e.target.value,o=i.split(`
`).length,t=this.querySelector(".custom-text-editor-columns");this.content=i,t.innerHTML="";for(let n=1;n<o+1;n++){let s=document.createElement("p");s.innerText=n,t.appendChild(s)}}connectedCallback(){this.title="Code editor",this.content="",this.innerHTML=`
      <div class="window-titlebar">
        <p class="window-title">${this.title}</p>
        <div class="window-buttons">
        </div>
      </div>
      <div class="window-content">
        <div class='custom-text-editor-columns'>1</div><textarea wrap='off' class='custom-text-editor' spellcheck='false'></textarea>
      </div>
    `,this.querySelector(".custom-text-editor").innerHTML=this.content,this.classList.add("window-container"),this.querySelector(".custom-text-editor").addEventListener("input",e=>{this.parseTextEditor(e)}),this.querySelector(".window-title").innerHTML=this.title}}customElements.define("window-manager",c);customElements.define("custom-window",d);customElements.define("code-editor",w);customElements.define("terminal-emulator",a);document.querySelector("#app").innerHTML=`
  <div class="main-container">
    <status-bar>
      <div class="branding-container">
        <img src="./src/img/monkey.svg" class="brand-logo">
        <p>aesthetic programming environment</p>
      </div>
      <status-indicator class="status-indicator">
        <i class="ti ti-database"></i>
        <p>1kB/10mB</p>
      </status-indicator>
    </status-bar>
    <window-manager>

    </window-manager>
  </div>
`;
