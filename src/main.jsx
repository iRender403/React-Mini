import { createRoot } from "./lib/react-dom/ReactDOM.js"

const root = createRoot(document.getElementById('root'));


// root.render(
//   1111
// )

root.render(
  <div className="container">
    <div className="one">
      <div className="two">
        <p>1</p>
        <p>2</p>
      </div>
      <div className="three">
        <p>3</p>
        <p>4</p>
      </div>
    </div>
    <p>this is a tes1</p>
  </div>
)


// root.render(
//   <App />
// )
