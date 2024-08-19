import "./App.css";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import { Route, Switch } from "react-router-dom";
import OTPVerification from "./Pages/OTPVerification";
import UpdateProfile from "./Pages/UpdateProfile";
function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div className="App" style={{ backgroundColor: "white" }}>
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/chat" component={ChatPage} />
        <Route path="/forgot-password" component={ForgetPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/otp-verification" component={OTPVerification} />
        {userInfo && <Route path="/updateProfile" component={UpdateProfile} />}
      </Switch>
    </div>
  );
}

export default App;
