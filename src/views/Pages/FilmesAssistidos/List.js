import React, { Component } from 'react';
import {Label, Button, Card, CardBody, Col, Container, 
    Row, CardHeader, CardFooter} from 'reactstrap';
import api from '../../../services/api';
import header from '../../../services/header';
import alertSW from '../../../util/sweetAlerts';
//import {NavLink} from 'react-router-dom'


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
        const response = await api.get(`/watchedmovies/page/${page}`,header);
        let moviesArray = response.data.data;
        moviesArray.sort(function(a,b){
            if (a.id > b.id){
                return -1;
            }
            if (a.ratingUsuario < b.ratingUsuario){
                return 1;
            }
            return 0;
        });
        this.setState({
            movies: moviesArray,
            total:response.data.total,
            page:response.data.page,
            lastpage:response.data.lastPage,
        })
        if (response.data.lastPage===0)
            this.setState({ lastpage:1});
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
        await api.delete(`/watched/${id}`,header);
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

    feedback = async(id) =>{
        await api.get(`/watched/${id}`,header).then((response)=>{
            let movieFilter = this.state.movies.filter(movie=>{
                return movie.id === id;
            });
            const {title} = movieFilter[0];
            alertSW.fire({
                imageUrl: require(`../../../img/${response.data.ratting.id}.png`),
                imageWidth: 70,
                imageHeight: 70,
                imageAlt: 'Face ratting',
                title: "Você classificou:  "+title+ " como: "+response.data.ratting.description,
                text: response.data.watched.observations
            });
        }).catch((err)=>{
            console.log(err);
                alertSW.fire({
                    icon: 'error',
                    title: 'Falha ao excluir o filme',
                    text: ''
                });
        });
        
    }

    watchedMovie = async (id_movie) =>{
        let movieFilter = this.state.movies.filter(movie=>{
            return movie.id === id_movie;
        });
        const {id, title, debut_date, sinopse, genre_id} = movieFilter[0];
        const data = {
            title,
            debut_date,
            sinopse,
            genre_id,
            watched_flag:false
        }
        console.log(data);
        await api.delete(`/watched/${id}`,header);
        await api.put(`/movies/${id}`,data,header).then(()=>{
            //this.resetState();
            alertSW.fire({
              icon: 'success',
              title: `De volta para lista de desejos!`,
              text: `Filme ${title} foi retornado para a lista de desejos, e foi removido da sua lista de assistidos!`
            });
        })
        this.loadMovies();
        
        
    }

    render() {
        
        return (
        <div >
        <Container >
            <Row>
                <Col lg="8" sm="12">
                    <Label><h6>Total de filmes: {this.state.total}</h6></Label>
                </Col>
                <Col lg="1" sm="3" xs="3">
                    <Button onClick={this.prevPage} block disabled={this.state.page===1}><i className="fa fa-arrow-left" aria-hidden="true"/></Button>
                </Col>
                <Col lg="2" sm="6" xs="6" className="justify-content-center">
                    <Label><center>{this.state.page} de {this.state.lastpage}</center></Label>
                </Col>
                <Col lg="1" sm="3" xs="3">
                    <Button onClick={this.nextPage} block disabled={this.state.page===this.state.lastpage}><i className="fa fa-arrow-right" aria-hidden="true"/></Button>
                </Col>
            </Row>
          <Row className="pt-2">
            {this.state.movies.map(movie => (
                <Col key={movie.id} xs='12' sm='12' md='6' lg='6' xl='4'>
                <Card >
                    <CardHeader>
                        <Row>
                            <Col xs='8' sm='9' md='9'>
                                <h5> <i className="fa fa-film" aria-hidden="true"></i> {movie.title}</h5>
                            </Col>
                            <Col xs='4' sm='3' md='3'>
                                <Button block color="danger" onClick={(e) => this.deleteMovie(e,movie.id)}>X</Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <h6>Sinopse: </h6>
                        <p>{movie.sinopse}</p>
                    </CardBody>
                    <CardFooter>
                    <Row>
                        <Col xs='12' md='12' sm='12' className="mt-1">
            <Button  color="warning" block  onClick={(e) => this.watchedMovie(movie.id)}><i className="fa fa-undo" aria-hidden="true"/>{' '}Retornar filme para lista de desejos</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='12' md='12' sm='12' className="mt-1">
                            <Button block  color="secondary" onClick={(e) => this.feedback(movie.id)}><i className="fa fa-commenting-o" aria-hidden="true"/>{' '}Exibir meu Feedback</Button>
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