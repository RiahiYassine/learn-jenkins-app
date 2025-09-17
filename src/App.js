import './App.css';

function App() {
  const version = process.env.REACT_APP_VERSION || '1';

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Hello, I'm Yassine Riahi</h1>
          <p>
            I'm a full-stack software engineer with hands-on experience in Java and Angular. I’ve worked extensively with GitHub Actions for CI/CD, and I'm currently expanding my DevOps skills by exploring Jenkins. The idea behind this transition is to externalize the CI/CD process for greater flexibility, control, and integration across different environments and tools.
          </p>
          <p>
            This site is part of my personal DevOps workflow — fully automated with Jenkins and Playwright end-to-end tests, and deployed through Netlify.
          </p>
          <a
            className="App-link"
            href="https://www.linkedin.com/in/yassine-riahi-012307255/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect with me on LinkedIn
          </a>
        </header>
      </div>
      <footer className="App-footer">
        <p className="version">Application version: {process.env.REACT_APP_VERSION}</p>
      </footer>
    </>

  );
}

export default App;