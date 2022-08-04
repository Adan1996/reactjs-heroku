import React, {useState, useEffect} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import { Button, Card, Container, Row, Col, Form} from 'react-bootstrap';
import './App.css';


const App = () => {

  const [search, setSearch] = useState("music");
  const [weatherData, setWeatherData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');

  const getData = () => {
    setLoading(true);
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
      .then(response => {
        setWeatherData(response.data.items);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log("error", error);
      });
  };

  const handleSubmit = event => {
    event.preventDefault();

    axios.post(`http://localhost:2000/whislist-api/whislist`, { title })
    .then(res => {
      if(res.data.title === "") {
        alert("Title is empty");
      } else {
        alert(res.data.title + " success to whislist!");
      }
    })
  }


  useEffect(() => {
    getData();
  }, [search]);

    return (
      <div className = "App">
        <h1 className="mb-5"> Book List </h1>  
        <Container>
        <Form.Control placeholder="Search..." onBlur={e => setSearch(e.target.value)}/>
        <Button variant="secondary" onClick={getData}>Search</Button>
        {
          loading === true ? <h3>Please wait....</h3> : ""
        }
          <Row>         
          {
              weatherData.map((data) => (
                    <Col md={4}>
                      <div key = {data.id} className="my-5">
                        <Card style={{ width: '25rem' }}>
                          <Card.Img variant="top" src={data.volumeInfo.imageLinks.smallThumbnail} />
                          <Card.Body>
                            <Card.Title>{data.volumeInfo.title}</Card.Title>
                            <Card.Text>
                              Author: {
                                data.volumeInfo.authors === undefined ? "-" : data.volumeInfo.authors
                              }
                            </Card.Text>
                            <Card.Text>
                              Ratings: <Rater total={5} rating={5} />
                            </Card.Text>
                          </Card.Body>
                          <form>
                              <input type="hidden" value={data.volumeInfo.title} onChange={(e) => setTitle(e.target.value)}/>
                              <button onClick={handleSubmit}>whislist</button>
                          </form>
                        </Card>
                      </div>
                    </Col>
                  
                  ))
                }
          </Row>
        </Container>
      </div>
    )
  }

export default App;
