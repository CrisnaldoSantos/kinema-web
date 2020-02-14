import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from 'reactstrap';
import api from "../../../services/api";
import alertSW from '../../../util/sweetAlerts';
import './sty.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      email: "",
      password: "",
      carregando: false
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleChange(e, key){
    this.setState({[key]:e.target.value});
  }

  toLogin(){
    window.history.replaceState(null,"Login","/login");
    window.history.go();
  }
  async handleSubmit(){
	  
	  let data = {
		  userData:{
        username: this.state.username,
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
    
	  await api.post('/register',data.userData,header).then(async function(response){
		  
      //localStorage.setItem("kinema-token",response.data.token);
      alertSW.fire({
        icon: 'success',
        title: 'Registrado com sucesso!',
        text: 'Você será redirecionado ao login!'
      })
      window.history.replaceState(null,"login","/login");
      window.history.go();
		}).catch(function(error){
      //console.log(error.response);
      alertSW.fire({
        icon: 'error',
        title: 'Falha ao registrar',
        text: 'Verifique os campos obrigatórios e tente novamente!'
      })
		});
		this.setState({
      carregando:false
    })

	}


  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleSubmit}>
                    <h1>Registre-se</h1>
                    <p className="text-muted">Crie sua conta:</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" value={this.state.username} onChange={(e) => this.handleChange(e, 'username')}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" autoComplete="email" value={this.state.email} onChange={(e) => this.handleChange(e, 'email')}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="new-password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Repeat password" autoComplete="new-password" />
                    </InputGroup>
                    <Button color="success" type="submit" disabled={this.state.carregando}  onClick={this.handleSubmit} block>Criar conta</Button>
                      <Button color="secondary"  disabled={this.state.carregando} onClick={this.toLogin} block>Cancelar</Button>
                    
                  </Form>
                </CardBody>
                
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
