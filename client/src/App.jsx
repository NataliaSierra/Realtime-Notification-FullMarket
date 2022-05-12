import { useEffect, useState } from "react";
import "./app.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { io } from "socket.io-client";
import axios from "axios";

const App = () => {
  const [alias, setAlias] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [userApi, setUserApi] = useState([]);

  const URL =
    "https://fullmarket-provitional-backend.herokuapp.com/getallusers";

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
  const viewUsers = async () => {
    await fetch(URL)
      .then((res) => res.json())
      .then((data) => setUserApi(data))
       //{
      //   data.forEach((element) => {
      //     setUserApi(element);
      //   });
      // });
  };

  useEffect(() => {
    viewUsers();
  }, []);
//  console.log(userApi);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user);
  }, [socket, user]);
console.log(user);
  return (
    <div className="container">
      {user ? (
        <>
          <Navbar socket={socket} />
          {userApi.map((user) => (
            <Card key={user.uid} post={user} socket={socket} user={user}/>
          ))}
          <span className="alias">{user}</span>
        </>
      ) : (
        <div className="login">
          <h2>Notifications</h2>
          <input
            type="text"
            placeholder="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <button onClick={() => setUser(alias)}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;
