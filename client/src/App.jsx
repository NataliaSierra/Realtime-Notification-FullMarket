import { useEffect, useState } from "react";
import "./app.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { io } from "socket.io-client";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [userApi, setUserApi] = useState([]);

  const URL = 'https://fullmarket-provitional-backend.herokuapp.com/getallusers';

  const getallusers = (e) => {
    axios.get(URL).then(( res => {
      let users = res.data
      setUserApi(users)
    })) .catch(( err => {
      console.log(err);
    }))
  }

  userApi.map(user => {
    console.log(user);
  }) 

  useEffect(() => {
    getallusers()
  }, [])
  //Backend URL
  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user);
  }, [socket, user]);

  return (
    <div className="container">
      {user ? (
        <>
          <Navbar socket={socket} />
          {userApi.map((user) => (
            <Card key={user.uid} post={user} socket={socket} user={user}/>
          ))}
          <span className="username">{user}</span>
        </>
      ) : (
        <div className="login">
          <h2>Lama App</h2>
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => setUser(username)}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;
