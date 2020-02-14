import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row, ModalHeader, ModalBody, Modal, ModalFooter
 } from 'reactstrap';
import api from "../../../services/api";
import "./sty.css";
import header from '../../../services/header';
import alertSW from '../../../util/sweetAlerts';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailRecovery:"",
      carregando: false,
      modal:false,
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleChange(e, key){
    this.setState({[key]:e.target.value});
  }

  async handleSubmit(){
	  
	  let data = {
		  userData:{
		  email: this.state.email,
		  password: this.state.password
		  }
	  }
	  var header = {
      headers: {
        'Content-Type': 'application/json'
      }
	  };
    this.setState({
      carregando:true
    })
    
	  await api.post('/authenticated',data.userData,header).then(function(response){
		  
      localStorage.setItem("kinema-token",response.data.token);
      window.history.replaceState(null,"Filmes desejados","/filmesdesejados/list");
      window.history.go();
		}).catch(function(error){
      alertSW.fire({
        icon: 'error',
        title: error.response.statusText,
        text: error.response.data[0].message
      })
		});
		this.setState({
      carregando:false
    })

  }
  
  btSolicitar=()=>{
    this.setState({
      modal:true
    })
  }

  resetState=()=>{
    this.setState({
      emailRecovery:""
    })
  }

  btCancel=()=>{
    this.setState({
      modal:false
    })
  }

  solicitarSenha=async()=>{
    this.setState({carregando:true})
    const data = {
      email: this.state.emailRecovery,
    }
    await api.post('/forgotpassword',data,header).then((response)=>{
      this.resetState();
      console.log(response);
      this.setState({carregando:false})
      alertSW.fire({
        icon: 'success',
        title: 'Uma nova senha foi enviada para o email',
        text: '',
        onClose: () => {
          this.btCancel()
        }
      });
      }).catch((err)=>{
        console.log(err);
        alertSW.fire({
          icon: 'error',
          title: 'Não foi possível solicitar uma nova senha',
          text: '',
          onClose: () => {
            this.btCancel()
          }
        });
        this.resetState();
        this.setState({carregando:false});
      })
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Modal isOpen={this.state.modal} className="modal-dialog modal-dialog-centered">
          <ModalHeader className="justify-content-center">Solicitar nova senha</ModalHeader>
          <ModalBody  className="justify-content-center">
            Informe o e-mail cadastrado ao qual deseja solicitar uma nova senha:
            
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>                            
              <i class="fa fa-envelope-o" aria-hidden="true"/>
              </InputGroupText>
              </InputGroupAddon>
            <Input type="text" placeholder="E-mail" autoComplete="email" value={this.state.emailRecovery} onChange={(e) => this.handleChange(e, 'emailRecovery')} />
          </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={this.state.carregando} onClick={this.solicitarSenha}>{this.state.carregando?"Solicitando":"Solicitar"}</Button>{' '}
            <Button color="danger" disabled={this.state.carregando} onClick={this.btCancel}>Cancelar</Button>
          </ModalFooter>
        </Modal>
        <Container>
          <Row className="justify-content-center">
            <Col md="8" sm='12' lg='6' xl='5'>
              <CardGroup>
                <Card >
                  <CardBody>
                    <Form onSubmit={this.handleSubmit} >
                      <Row>
                        <Col lg='6' sm='6'>
                          <h1>Login</h1>
                          <p className="text-muted">Entre no app com suas credenciais</p>
                        </Col>
                        <Col lg='6' sm='6'>
                          <img  src={require("../../../img/Logo Kinema.png")} alt="logo" width="100px"/>
                        </Col>
                      </Row>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            @
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Email" autoComplete="email" value={this.state.email} onChange={(e) => this.handleChange(e, 'email')}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')}/>
                      </InputGroup>
                      <Row >
                        <Col lg="6" sm="12" className="pb-2">
                          <Button color="success" type="submit" disabled={this.state.carregando} block  onClick={this.handleSubmit}>Entrar</Button>
                        </Col>
                        <Col lg="6" sm="12">
                        <Link to="/register">
                          <Button color="primary" disabled={this.state.carregando} block>Registre-se!</Button>
                        </Link>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12" className="text-left">
                          <Button color="link" className="px-0" disabled={this.state.carregando} onClick={this.btSolicitar}>Esqueceu sua senha?</Button>
                        </Col>
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

export default Login;
