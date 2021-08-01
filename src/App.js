import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Directory from './pages/Directory';
import Account from './pages/Account';
import Credits from './pages/Credits';
import Reload from './components/Reload'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/" component={Account } exact />
          <Route path="/directory" component={Directory} exact />
          <Route path="/credits" component={Credits} exact />
          <Route path="/gallery" component={Reload} />
        </Router>
      </div>
    )
  }
}
export default App;
