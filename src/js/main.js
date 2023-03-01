import '../css/style.css'
import './windowManager.js'

document.querySelector('#app').innerHTML = `
  <div class="main-container">
    <status-bar>
      <div class="branding-container">
        <img src="/src/img/monkey.svg" class="brand-logo" credit="https://www.svgrepo.com/svg/310921/incognito">
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
`
