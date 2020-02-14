import React, { Component } from 'react';
import {Label, Button, Card, CardBody, Col, Container, 
    Row, CardHeader, CardFooter, Modal, ModalBody,  ModalHeader, FormGroup, Input  } from 'reactstrap';
import api from '../../../services/api';
import header from '../../../services/header';
import alertSW from '../../../util/sweetAlerts';
import {NavLink} from 'react-router-dom'
import sessionExpired from '../../../util/sessionExpired';

export default class FilmesDesejadosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
          movies:[],
          rattings:[],
          carregando: false,
          total:0,
          page:1,
          lastpage:1,
          modal:false,
          rattings_id:"3",
          observations:"",
          movieid_modal:"",
        };
        //this.handleChange=this.handleChange.bind(this);
        //this.handleSubmit=this.handleSubmit.bind(this);
      }

      loadRattings = async () => {
        try{
        const response = await api.get('/rattings',header);
        this.setState({rattings: response.data})
        }catch{
          sessionExpired();
        }
      };

    loadMovies = async (page=1) => {
        const response = await api.get(`/movies/page/${page}`,header);
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
        this.loadRattings();
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

    resetStatesFeedback = () =>{
        this.setState({
            rattings_id:"3",
            observations:""
        })
    }

    registerFeedback = async () =>{
        const data={
            id:parseInt(this.state.movieid_modal,10),
            costs:0,
            rattings_id:parseInt(this.state.rattings_id,10),
            observations:this.state.observations
        }
        await api.post('/watched',data,header).then(()=>{
            this.resetStatesFeedback();
            this.watchedMovie();
        }).catch((err)=>{
            sessionExpired();
        });
    }

    watchedMovie = async () =>{
        let movieFilter = this.state.movies.filter(movie=>{
            return movie.id === this.state.movieid_modal;
        });
        const {id, title, debut_date, sinopse, genre_id} = movieFilter[0];
        const data = {
            title,
            debut_date,
            sinopse,
            genre_id,
            watched_flag:true
        }
        console.log(data);
        await api.put(`/movies/${id}`,data,header).then(()=>{
            //this.resetState();
            alertSW.fire({
              icon: 'success',
              title: `Filme assistido!`,
              text: `Filme ${title} foi marcado como assistido, e foi removido da sua lista de desejos!`
            });
        })
        this.modalCancel();
        this.loadMovies();
        
        
    }

    handleChange(e, key){
        this.setState({[key]:e.target.value});
    }

    modalPress(id_movie){
        let atual=this.state.modal;
        this.setState({
            modal:!atual,
            movieid_modal:id_movie
        })
    }

    modalCancel=()=>{
        this.setState({
            modal:false
        });
        this.resetStatesFeedback();
    }

    render() {
        
        return (
        <div >
        <Container >
        <Modal isOpen={this.state.modal} >
            <ModalHeader ><i className="fa fa-commenting" aria-hidden="true"/> Assistiu? E aí, o que achou do filme?</ModalHeader>
            <ModalBody>
                <Row>
                    <Col lg="12">
                        <FormGroup>
                            <Label for="ratting"><h6>Classificação:</h6></Label>
                            <Input type="select" name="ratting" id="ratting" value={this.state.rattings_id} onChange={(e) => this.handleChange(e, 'rattings_id')}>
                            {this.state.rattings.map(ratting => (
                              <option key={ratting.id} value={ratting.id}>{ratting.description}</option>
                            ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12">
                        <FormGroup>
                            <Label for="sinopse"><h6>Observações:</h6></Label>
                            <Input type="textarea" name="text" id="sinopse" value={this.state.observations} onChange={(e) => this.handleChange(e, 'observations')}/>
                        </FormGroup>
                    </Col>
                </Row>
            
                <Row className="justify-content-center mt-1">
                    <Col lg="4" md="6" sm="12" className="mb-2">
                        <Button color="success" block onClick={this.registerFeedback}>Continuar</Button>            
                    </Col>
                    <Col lg="4" md="6" sm="12">
                        <Button color="danger" block onClick={this.modalCancel}>Cancelar</Button>
                    </Col>
                </Row>
            </ModalBody>
          </Modal>
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
                        <Col xs='12' md='6' sm='12' className="mt-1">
                            <Button block color="success" onClick={(e) => this.modalPress(movie.id)}><i className="fa fa-check" aria-hidden="true"/> Assistido</Button>
                        </Col>
                        <Col xs='12' md='6' sm='12' className="mt-1">
                            <NavLink to={`/filmesdesejados/edit/${movie.id}`}>
                            <Button block color='warning'><i className="fa fa-pencil-square-o" aria-hidden="true"/> Editar</Button>
                            </NavLink>
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