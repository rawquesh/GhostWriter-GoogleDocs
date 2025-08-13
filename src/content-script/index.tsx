import { render } from 'preact'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'

async function mount() {
  const container = document.createElement('div')
  container.className = 'sim-text-ip-container'
  container.setAttribute('draggable', 'true')
  container.style.position = 'absolute'
  let initialX: number
  let initialY: number

  container.addEventListener('dragstart', (e) => {
    initialX = e.clientX - container.getBoundingClientRect().left
    initialY = e.clientY - container.getBoundingClientRect().top
  })

  container.addEventListener('dragover', (e) => {
    e.preventDefault()
    const currentX = e.clientX - initialX
    const currentY = e.clientY - initialY
    container.style.left = `${currentX}px`
    container.style.top = `${currentY}px`
  })

  const mainContainer = document.body
  if (mainContainer) {
    mainContainer.prepend(container)
  }

  const mountPoint = document.createElement('div');
  container.appendChild(mountPoint);

  const cssUrl = chrome.runtime.getURL('content-script.css');
  try {
    const response = await fetch(cssUrl);
    const cssText = await response.text();
    const styleEl = document.createElement('style');
    styleEl.textContent = cssText;
    container.appendChild(styleEl);
  } catch (e) {
    console.error('Failed to load CSS', e);
  }

  const close = document.createElement('button')
  close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
`

  close.className = 'sim-text-ip-close'

  close.addEventListener('click', () => {
    container.remove()
  })

  container.appendChild(close)

  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>,
    mountPoint,
  )
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'show-dialog') {
    if (!document.querySelector('.sim-text-ip-container')) {
      mount()
    }
  }
})