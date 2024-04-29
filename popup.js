var brdToggleWrapper = document.querySelector('.brd__status')
var brdToggleButton = document.querySelector('.brd__status-toggle')

var brdRefreshPanel = document.querySelector('.brd__refresh-panel')
var brdRefreshPanelButtonRefresh = brdRefreshPanel.querySelector('.brd__refresh-panel-button.refresh')
var brdRefreshPanelButtonNotNow = brdRefreshPanel.querySelector('.brd__refresh-panel-button.not-now')

var brdStatusEnabled = true

function init() {
  brdToggleButton.addEventListener('click', () => {
    brdToggleWrapper.classList.add('transitioning')
    toggleStatus()
    setTimeout(() => {
      brdToggleWrapper.classList.remove('transitioning')
    }, 400)
  })

  initRefreshPanel()

  chrome.storage.sync.get(['berdEnabled'], (result) => {
    brdStatusEnabled = result.berdEnabled
    updateToggleButton()
    updateExtIcon()
  })
}

function toggleStatus() {
  chrome.storage.sync.set({ berdEnabled: !brdStatusEnabled }, () => {
    brdStatusEnabled = !brdStatusEnabled
    updateToggleButton()
    updateExtIcon()
    showRefreshPanel()
  })
}

function updateToggleButton() {
  brdToggleButton.setAttribute('data-enabled', brdStatusEnabled)
  brdToggleButton.innerHTML = brdStatusEnabled ? 'on' : 'off'
}

function initRefreshPanel() {
  brdRefreshPanel.querySelector('.brd__refresh-panel-text').innerHTML = chrome.i18n.getMessage('refreshPanelText')

  brdRefreshPanelButtonNotNow.innerHTML = chrome.i18n.getMessage('refreshPanelButtonNotNow')
  brdRefreshPanelButtonNotNow.addEventListener('click', hideRefreshPanel)

  brdRefreshPanelButtonRefresh.innerHTML = chrome.i18n.getMessage('refreshPanelButtonRefresh')
  brdRefreshPanelButtonRefresh.addEventListener('click', refreshActiveTab)
}

function showRefreshPanel() {
  brdRefreshPanel.classList.add('visible')
}
function hideRefreshPanel() {
  brdRefreshPanel.classList.remove('visible')
  setTimeout(() => {
    window.close()
  }, 500)
}

function refreshActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (current) => {
    chrome.tabs.reload(current[0].tabId)
    window.close()
  })
}

function updateExtIcon() {
  if (brdStatusEnabled) {
    chrome.action.setIcon({
      path: {
        16: 'images/icon16.png',
        24: 'images/icon24.png',
        32: 'images/icon32.png',
        48: 'images/icon48.png',
        128: 'images/icon128.png',
      },
    })
  } else {
    chrome.action.setIcon({
      path: {
        16: 'images/icon16-inactive.png',
        24: 'images/icon24-inactive.png',
        32: 'images/icon32-inactive.png',
        48: 'images/icon48-inactive.png',
        128: 'images/icon128-inactive.png',
      },
    })
  }
}

init()
