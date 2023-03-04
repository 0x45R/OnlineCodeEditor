import '../css/style.css'
import './windowManager.js'
//https://unixpapa.com/js/testkey.html
document.querySelector('#app').innerHTML = `
  <main>
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
  </main>
`
