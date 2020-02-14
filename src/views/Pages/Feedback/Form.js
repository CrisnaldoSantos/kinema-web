import React, { Component } from 'react';
import { FormGroup, Button, Card, CardBody, CardGroup, Col, Container, 
    Form, Input, InputGroup, InputGroupAddon, Row, CardHeader, Label } from 'reactstrap';
import api from '../../../services/api';
import header from '../../../services/header';
import sessionExpired from '../../../util/sessionExpired';
import alertSW from '../../../util/sweetAlerts';

export default class FilmesAssistidosForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      sinopse: "",
      debut_date:"2000-01-01",
      watched_flag:false,
      genre_id: "1",
      genres:[],
      carregando: false
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  loadGenres = async () => {
    try{
    const response = await api.get('/genres',header);
    this.setState({genres: response.data})
    }catch{
      sessionExpired();
    }
  };
  handleChange(e, key){
    this.setState({[key]:e.target.value});
  }

  async componentDidMount(){
    this.loadGenres();

  }

  resetState(){
    this.setState({
        title: " ",
        sinopse: " ",
        debut_date:"2000-01-01",
        watched_flag:false,
        genre_id: "1",
        carregando: false
    });
  }

  async handleSubmit(){
    const data = {
      title: this.state.title,
      sinopse: this.state.sinopse,
      debut_date:this.state.debut_date,
      watched_flag:false,
      genre_id: parseInt(this.state.genre_id,10),
    }
    await api.post('/movies',data,header).then(()=>{
      this.resetState();
      alertSW.fire({
        icon: 'success',
        title: 'Filme adicionado!',
        text: ''
      });
    }
      
    )
    .catch(function(error){
      console.log(error.response);
    })
    
  }

    render() {
      
        return (
        <div >
        <Container >
          <Row className="justify-content-center">
            <Col >
              <CardGroup>
                <Card>
                <CardHeader><h2>Feedback <i class="fa fa-video-camera" aria-hidden="true"></i></h2></CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col lg="8">
                          <Label for="title"><h6>Título do filme:</h6></Label>
                          <InputGroup className="mb-3">
                              <InputGroupAddon addonType="append">
                              </InputGroupAddon>
                              <Input type="text"  id="title" value={this.state.title} onChange={(e) => this.handleChange(e, 'title')}/>
                            </InputGroup>
                          </Col>
                          <Col lg="4">
                          <Label for="debut-date"><h6>Data de estréia: (Opcional)</h6></Label>
                          <InputGroup className="mb-3">
                              <InputGroupAddon addonType="append">
                              </InputGroupAddon>
                              <Input type="date" placeholder="Data de estréia" id="debut-date" value={this.state.debut_date} onChange={(e) => this.handleChange(e, 'debut_date')}/>
                            </InputGroup>
                          </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <Label for="genre"><h6>Gênero</h6></Label>
                            <Input type="select" name="genre" id="genre" value={this.state.genre_id} onChange={(e) => this.handleChange(e, 'genre_id')}>
                            {this.state.genres.map(genres => (
                              <option key={genres.id} value={genres.id}>{genres.description}</option>
                            ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="8">
                          <FormGroup>
                            <Label for="sinopse"><h6>Sinopse</h6></Label>
                            <Input type="textarea" name="text" id="sinopse" value={this.state.sinopse} onChange={(e) => this.handleChange(e, 'sinopse')}/>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="2" md="6" sm="12" xs="12" className="p-1">
                          <Button color="success" block onClick={this.handleSubmit}>Cadastrar</Button>
                        </Col>
                        {/*<Col lg="2" md="6" sm="12" xs="12" className="p-1">
                          <Button color="danger" block onClick={sessionExpired}>Cancelar</Button>
                            </Col>*/}
                      </Row>
                    </Form>
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
