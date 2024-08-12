import { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { MdModeEditOutline } from "react-icons/md";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState("");
  const [count, setCount] = useState(1);
  const ref=useRef();
   useEffect(() => {
    handler();
  }, []);

const random=(length=10)=>{
const overall=" ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:',.<>/?";
let id=""
while(true){
  for(let i=0;i<length;i++){
   let temp=Math.floor(Math.random()*overall.length)
    id+=overall[temp]
  }
   if(data.find((d)=>(d.id==id))){
    console.log("yes it is equal")
continue
  }else{
      return  id
      break
  }
}}

  const handler = async () => {
    try {
      let response = await axios.get("http://localhost:3000/todo");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

   const adder = async () => {
    if (temp && temp.trim() !== "") {
      window.alert("added");
      setCount(count + 1);
      let both=random(10)
      const newthing = { id:both , sender: { id: both, data: temp } };
      setData([...data, newthing]);
      setTemp("");
      ref.current.focus()

      try {
        await axios.post("http://localhost:3000/todo", newthing);
      } catch (error) {
        console.error("Error adding data:", error);
      }
    } else {
      window.alert("Cannot be added");
    }
  };

  const remover = async (id) => {
    setData(data.filter((d) => id !== d.id));
    try {
      await axios.delete(`http://localhost:3000/todo/${id}`);
    } catch (error) {
      console.error("Error removing data:", error);
    }
  };

  const updater = async (d1) => {
    const updatedData = window.prompt("Enter the new task", d1.sender.data);
    if (updatedData && updatedData.trim() !== "") {
      const newData = data.map((d) =>
        d.id === d1.id ? { ...d, sender: { ...d.sender, data: updatedData } } : d
      );
      setData(newData);
      try {
        await axios.put(`http://localhost:3000/todo/${d1.id}`, { ...d1,sender: { ...d1.sender, data: updatedData } });
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      window.alert("Update cannot be empty");
    }
  };

  return (
    <div className="container-fluid" style={{ width: "1000px" }}>
      <h1>TODO LIST</h1>
      <hr style={{ height: "2px" }} />
      <div className="d-flex flex-column align-items-center">
        <div>
          <input
            value={temp}
            className="p-3 text-center"
            style={{ minWidth: "700px", outlineColor: "#61dafbaa" }}
            type="text"
            placeholder="Enter the task..."
            onChange={(e) => setTemp(e.target.value)}
            ref={ref}
          />
        </div>
        <div
          type="submit"
          className="mt-2 bg-warning p-2 mt-3"
          style={{ width: "50px", borderRadius: "5px" }}
          onClick={adder}
        >
          ADD
        </div>
      </div>
      <div
        className="board d-flex flex-column align-content-center"
        style={{ width: "90%" }}
      >
        {data.map((d, i) => (
          <div
            className="d-flex mt-3 justify-content-center"
            key={i}
            style={{ background: "grey", borderRadius: "5px" }}
          >
            <div className="h3 d-flex flex-wrap w-50 text-light">
              {d.sender.data}
            </div>
            <div
              className="p-1"
              style={{ borderRadius: "25%" }}
              onClick={() => remover(d.id)}
            >
              <DeleteIcon size="30" />
            </div>
            <div
              className="m ms-5 p-1"
              style={{ borderRadius: "25%" }}
              onClick={() => updater(d)}
            >
              <MdModeEditOutline size="30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
