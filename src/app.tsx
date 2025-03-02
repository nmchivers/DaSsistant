import { useState } from 'preact/hooks'
import './app.scss'

export function App() {
  const [count, setCount] = useState(0)

  function handleOnChange(e: Event) {
    const target = e.target as HTMLInputElement;
    setCount(parseInt(target.value));
  }

  function handleOnCreate() {
    parent.postMessage({ pluginMessage: { type: 'create-shapes', count } }, '*')
  }

  function handleOnCancel() {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }
    
  return (
    <>
      <h2>Rectangle Creator in Preact</h2>
      <p>Count: <input id="count" type="number" value={count} onChange={handleOnChange} /></p>
      <button id="create" onClick={handleOnCreate}>Create</button>
      <button id="cancel" onClick={handleOnCancel}>Cancel</button>
    </>
  )
}
