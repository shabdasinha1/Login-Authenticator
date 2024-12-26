import {BrowserRouter,Routes,Route} from "react-router-dom";
import './App.css';
import Login from "./pages/Login.js";
import Email from "./pages/Email.js";
import Error from "./pages/Error.js";
import Password from "./pages/Password.js";
import Recovery from "./pages/Recovery.js";
import Register from "./pages/Register.js";
import Reset from "./pages/Reset.js";
import Profile from "./pages/Profile.js";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/email" element={<Email/>}/>
        <Route path="*" element={<Error/>}/>
        <Route path="/password" element={<Password/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/recovery" element={<Recovery/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/reset" element={<Reset/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
