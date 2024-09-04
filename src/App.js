import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from './Table';

function App() {
  const [pd, setPd] = useState(1)
  const [inSetup, setInSetup] = useState(true)
  const [name, setName] = useState("")
  const [roundData, setRoundData] = useState([])
  const [myData, setMyData] = useState("")
  const [round, setRound] = useState(0)

  const [gridView, setGridView] = useState(false)
  const [pdGrid, setPdGrid] = useState(1)
  const [gridData, setGridData] = useState({})

  const [inputValue, setInputValue] = useState("")

  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    const fetchColorIndex = async () => {
      try {
        const response = await axios.get('http://server.milesacq.com:5001/getRound');
        const roundNum = response.data;
        setRound(prevRound => {
          if (prevRound !== roundNum) {
            return roundNum;
          }
          return prevRound;
        });
        axios.get('http://server.milesacq.com:5001/getRoundData').then(e => {
          if (roundData[0] === e.data[0] && roundData[1] === e.data[1]) return;
          setRoundData(e.data);
          setWaiting(false)
        });
      } catch (error) {
        console.error('Error fetching color index:', error);
      }

      if (pdGrid != 0) {
        axios.get(`http://server.milesacq.com:5001/getPdData?pd=${pdGrid}`).then(e => {
          setGridData(e.data)
        })
      }
    };

    const intervalId = setInterval(fetchColorIndex, 1000);
    return () => clearInterval(intervalId);
  }, [roundData]);

  useEffect(() => {
    if (roundData.length > 0) {
      const myDataIndex = roundData.findIndex(data => data.split('.')[0] === name);
      if (myDataIndex !== -1) {
        setMyData(roundData[myDataIndex]);
      }
    }
  }, [roundData, name]);

  return (
    <div className="App">
      {gridView == false ? (
        inSetup == true ? (
          <header className="App-header">
            <label for="cars">Choose a period<span onClick={() => setGridView(true)}>:</span></label>
            <select onChange={(e) => setPd(e.target.value)}>
              <option value="1">1</option>
              <option value="2-1">2 Day 1</option>
              <option value="2-2">2 Day 2</option>
              <option value="3-1">3 Day 1</option>
              <option value="3-2">3 Day 2</option>
              <option value="7-1">7 Day 1</option>
              <option value="7-2">7 Day 2</option>
              <option value="8-1">8 Day 1</option>
              <option value="8-2">8 Day 2</option>
              <option value="9">9</option>
            </select>
            <br />
            <label>Type your name:</label>
            <input onChange={(e) => setName(e.target.value)} value={name}></input>
            <button onClick={() => {
              axios.get(`http://server.milesacq.com:5001/addChild?name=${name}&pd=${pd}`,)
              setInSetup(false)
            }}>Start</button>
          </header>
        ) : (
          <>
            {
              roundData.length > 1 ? (
                <>
                  {waiting ? (<p>wait for the next round to start!</p>)
                    : (
                      <>
                        <p>Hi {name}, go find {myData.split(".")[1]} and ask their favorite {myData.split(".")[2]}</p>
                        <br />
                        enter here:
                        <input onChange={(e) => setInputValue(e.target.value)} value={inputValue}></input>
                        <button onClick={() => {
                          if (inputValue == '') {
                            alert("you must enter something!")
                            return
                          }
                          const cleanedVal = inputValue.replace(".", ",")
                          axios.post(`http://server.milesacq.com:5001/submitData?pd=${pdGrid}&data=${myData}&val=${cleanedVal}`)
                          setWaiting(true)
                        }}>submit!</button>
                      </>
                    )}
                </>
              ) : <p>waiting for round to start</p>
            }
          </>
        )
      ) : (
        <>
          <label for="cars">Choose a period<span onClick={() => setGridView(true)}>:</span></label>
          <select onChange={(e) => setPdGrid(e.target.value)}>
            <option value="1">1</option>
            <option value="2-1">2 Day 1</option>
            <option value="2-2">2 Day 2</option>
            <option value="3-1">3 Day 1</option>
            <option value="3-2">3 Day 2</option>
            <option value="7-1">7 Day 1</option>
            <option value="7-2">7 Day 2</option>
            <option value="8-1">8 Day 1</option>
            <option value="8-2">8 Day 2</option>
            <option value="9">9</option>
          </select>
          <button onClick={() => {
            axios.get(`http://server.milesacq.com:5001/getPdData?pd=${pdGrid}`).then(e => {
              setGridData(e.data)
            })
          }}>go</button>
          <DataTable data={gridData} />
        </>
      )}
    </div>
  );
}

export default App;
