import React, { Component } from 'react';
import {Label, Button, Card, CardBody, Col, Container, 
    Row, CardHeader, CardFooter } from 'reactstrap';
import api from '../../../services/api';
import header from '../../../services/header';
import alertSW from '../../../util/sweetAlerts';


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
        if (response.data.lastPage===0)
            this.setState({ lastpage:1});
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

    deleteMovie = async (e,id)=>{
        
        await api.delete(`/movies/${id}`,header)
            .then(()=>{
                this.loadMovies();
                alertSW.fire({
                    icon: 'success',
                    title: 'Filme excluído com sucesso!',
                    text: ''
                });
            })
            .catch((err)=>{
                console.log(err);
                alertSW.fire({
                    icon: 'error',
                    title: 'Falha ao excluir o filme',
                    text: ''
                });
            })
    }


    render() {
        
        return (
        <div >
        <Container className="fluid flex-1">
            <Row>
                <Col lg="8" sm="12">
                    <Label><h6>Total de filmes: {this.state.total}</h6></Label>
                </Col>
                <Col lg="1" sm="3" xs="3">
                    <Button onClick={this.prevPage} block disabled={this.state.page===1}><i class="fa fa-arrow-left" aria-hidden="true"/></Button>
                </Col>
                <Col lg="2" sm="6" xs="6" className="justify-content-center">
                    <Label><center>{this.state.page} de {this.state.lastpage}</center></Label>
                </Col>
                <Col lg="1" sm="3" xs="3">
                    <Button onClick={this.nextPage} block disabled={this.state.page===this.state.lastpage}><i class="fa fa-arrow-right" aria-hidden="true"/></Button>
                </Col>
            </Row>
          <Row className="pt-2">
            {this.state.movies.map(movie => (
                <Col xs='12' md='6' lg='4'>
                <Card key={movie.id}>
                    <CardHeader>
                        <Row>
                            <Col xs='10' md='9'>
                                <h5> <i class="fa fa-film" aria-hidden="true"></i> Título: {movie.title}</h5>
                            </Col>
                            <Col xs='2' md='3'>
                                <Button block color="danger" onClick={(e) => this.deleteMovie(e,movie.id)}>X</Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <p><h6>Sinopse: </h6>{movie.sinopse}</p>
                    </CardBody>
                    <CardFooter>
                    <Row>
                        <Col xs='6' md='6'>
                            <Button block color="success"><i class="fa fa-check" aria-hidden="true"/> Assistido</Button>
                        </Col>
                        <Col xs='6' md='6'>
                            <Button block color='warning'><i class="fa fa-pencil-square-o" aria-hidden="true"/> Editar</Button>
                        </Col>
                    </Row>
                    </CardFooter>
                </Card>
                </Col>               
            ))}
        </Row>
        </Container>
        </div>   
        );
      }
}