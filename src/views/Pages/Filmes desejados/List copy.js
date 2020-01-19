import React, { Component } from 'react';
import {Label, Button, Card, CardBody, CardGroup, Col, Container, 
    Row, CardHeader, Table } from 'reactstrap';
import api from '../../../services/api';
import header from '../../../services/header';

export default class FilmesAssistidosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
          movies:[],
          carregando: false,
          total:0,
          page:1,
          lastpage:1,
        };
        //this.handleChange=this.handleChange.bind(this);
        //this.handleSubmit=this.handleSubmit.bind(this);
      }

    loadMovies = async (page=1) => {
        const response = await api.get(`/movies/page/${page}`,header);
        this.setState({
            movies: response.data.data,
            total:response.data.total,
            page:response.data.page,
            lastpage:response.data.lastPage,
        })
        console.log(response)
        //console.log(this.state.movies)
    };

    componentDidMount(){
        this.loadMovies();
    }

    //Função para retroceder a página
    prevPage=() =>{
        const {page} =this.state;
        if (page === 1) return;
        const pageNumber = page - 1;
        this.loadMovies(pageNumber);
    };
//Função para avançar a página  
    nextPage=() =>{
        const {page, lastpage} =this.state;
        if (page === lastpage) return;
        const pageNumber = page + 1;
        this.loadMovies(pageNumber);
    };


    render() {
        
        return (
        <div >
        <Container className="fluid">
            <Row>
                <Col lg="12" sm="12">
                    <Label><h6>Total de filmes: {this.state.total}</h6></Label>
                </Col>
                
            </Row>
            <Row className="justify-content-center">
                <Col lg="2" sm="3" xs="3">
                    <Button onClick={this.prevPage} block disabled={this.state.page===1}><i class="fa fa-arrow-left" aria-hidden="true"/></Button>
                </Col>
                <Col lg="8" sm="6" xs="6" className="justify-content-center">
                    <Label><center>{this.state.page} de {this.state.lastpage}</center></Label>
                </Col>
                <Col lg="2" sm="3" xs="3">
                    <Button onClick={this.nextPage} block disabled={this.state.page===this.state.lastpage}><i class="fa fa-arrow-right" aria-hidden="true"/></Button>
                </Col>
            </Row>
          <Row className="justify-content-center">
            <Col >
              <CardGroup>
                <Card>
                <CardHeader><h4>Filmes para assistir <i class="fa fa-video-camera" aria-hidden="true"></i></h4></CardHeader>
                  <CardBody>
                    <Table responsive>
                        <thead>
                            <th>Título:</th>
                            <th>Gênero:</th>
                            <th>Sinopse:</th>
                            <th> </th>
                            <th> </th>
                        </thead>
                        <tbody>
                            {this.state.movies.map(movie => (
                              <tr key={movie.id}>
                                  <td>{movie.title}</td>
                                  <td>{movie.genre_id}</td>
                                  <td>{movie.sinopse}</td>
                                  <td><Button color="success"><i class="fa fa-check" aria-hidden="true"/></Button></td>
                                  <td><Button color="danger">X</Button></td>
                              </tr>
                            ))}
                        </tbody>
                    </Table>
                  </CardBody>
                </Card>
                </CardGroup>
            </Col>
            </Row>
            </Container>
        </div>   
        );
      }
}