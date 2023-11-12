import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState(" ");
  const [pageNumber, setPageNumber] = useState(1);
  const [offset, setOffset] = useState(0);
  const [tableData, setTableData] = useState(null);
  const [month, setMonth] = useState("March");
  const [barData ,setbarData] = useState(null)
   
  const fetchData = async () => {
    try {
      const dataApi = await fetch(
        `http://localhost:3000/product-transactions/${month}?search=${search}&offset=${offset}`
      );
      console.log(
        `http://localhost:3000/product-transactions/${month}?search=${search}&offset=${offset}`
      );
      const data = await dataApi.json();
      console.log("ddd",data[1][0].TotalSale);
      setTableData(data);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [offset, month, search]);

  const next = () => {
    setOffset((prevValue) => prevValue + 10);
    setPageNumber((prevValue) => prevValue + 1);
  };

  const previous = () => {
    
    if(offset ==0 || pageNumber ==0){

    }
    else{
      setOffset((prevOffset) => prevOffset - 10);
      setPageNumber((prevPageNum) => prevPageNum - 1);
    }
  };

  const handleChange = (event) => {
    setMonth(event.target.value);

  };

  const inputChange = (event) => {
    setSearch(event.target.value );

  };

  return (
    <div className="rootCont">
      <div className="title-container">
        <h1 className="title">Transaction Dashboard</h1>
      </div>
      <div>
        <div className='card-1'>
          <div>
            <input type='text' value={search} onChange={inputChange}></input>
          </div>
          <div>
            <select
              id="months"
              name="months"
              value={month}
              onChange={handleChange}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        </div>
        {tableData && (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Sold</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {tableData[0].map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    <td>{item.category}</td>
                    <td>{item.sold}</td>
                    <td>
                      <a href={item.image}>Link</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card-2">
          <p>Page No: {pageNumber}</p>
          <div>
            <button onClick={next}>Next</button>
            <button onClick={previous}>Previous</button>
          </div>
          <p>Per Page: upto 10</p>
        </div>
      </div>
      {
        tableData && <div className='card-3'>
        <h3>Statistics -{month}</h3>
        <p>Total Sale    {tableData[1][0].TotalSale}</p>
        <p>Total Sold item  {tableData[1][0].totalSoldItems}</p>
        <p>Total not sold item {tableData[1][0].totalNotSoldItems}</p>
      </div>
      }

    </div>
  );
}

export default App;
