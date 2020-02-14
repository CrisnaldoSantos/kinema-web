import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardTitle, CardGroup, Col, Container,  Row, CardBody,
    Input, InputGroup, InputGroupAddon, InputGroupText
   } from 'reactstrap';
import header from '../../../services/header';
import api from '../../../services/api';

import alertSW from '../../../util/sweetAlerts';
export default class ChangePassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
          newpassword:"",
          password:"",
          carregando: false,
          modal:false,
        }
        this.handleChange=this.handleChange.bind(this);
        //this.handleSubmit=this.handleSubmit.bind(this);
    }
    
redirectPage=()=>{
    
    window.history.replaceState(null,"Filmes desejados","/");
    window.history.go();
}

handleChange(e, key){
    this.setState({[key]:e.target.value});
}

changePW=async()=>{
    const data={
        password:this.state.newpassword
    }
    await api.post('/alterpassword',data,header).then(()=>{
        console.log('ok2');
        alertSW.fire({
            icon: 'success',
            title: 'Senha alterada com sucesso!',
            text: '',
            onClose: () => {
                this.redirectPage();
            }
        });
    });
}

verificaUsuario=async()=>{
    var header = {
        headers: {
          'Content-Type': 'application/json'
        }
        };
      this.setState({
        carregando:true
      })
    if(this.state.password==="" || this.state.newpassword===""){
        this.handleInvalidSubmit();
    }else{
    const data={
        email:localStorage.getItem("kinema-email"),
        password:this.state.password,
    }
    await api.post('/authenticated',data,header).then((response)=>{
        localStorage.setItem("kinema-token",response.data.token);
        console.log(localStorage.getItem("kinema-email"));
        this.changePW();
    }).catch((err)=>{
        console.log(err);
        alertSW.fire({
            icon: 'error',
            title: 'Não foi possível alterar sua senha!',
            text: 'Esta sessão será encerrada e você será redirecionado ao login!',
            onClose: () => {
                localStorage.removeItem("kinema-token");
                localStorage.removeItem("kinema-email");
                this.redirectPage();
            }
        });
    })
}
}

handleInvalidSubmit=()=>{
    alertSW.fire({
        icon: 'error',
        title: 'Os campos não estão em conformidade!',
        text: 'Campos vazios não serão aceitos!',
        onClose: () => {
            this.setState({carregando:false});
        }
    });
}

render(){
    return(
     
    <Container>
        <Row className="justify-content-center mt-4">
            <Col sm="12" md="10" lg="11" xl="8">
                <CardGroup >
                    <Card className="p-4 w-100 h-100">
                        <CardTitle className="mb-4"><center><h4>Alterar Senha</h4></center></CardTitle>
                    <CardBody>
                    <Row className="justify-content-center mt-4">
                        <InputGroup className="mb-4 ">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="icon-lock"></i>
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input type="password" placeholder="Senha atual" autoComplete="current-password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')}/>
                        </InputGroup>
                        <InputGroup className="mb-4 ">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="icon-lock"></i>
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input type="password" placeholder="Nova senha" autoComplete="current-password" value={this.state.newpassword} onChange={(e) => this.handleChange(e, 'newpassword')}/>
                        </InputGroup>
                        
                      </Row>
                        <Row>
                            <Col lg="6" md="12" sm="12"/>
                            <Col lg="3" md="6" sm="12">
                                <Button disabled={this.state.carregando} onClick={this.verificaUsuario} block color="success"  className='mb-2' >{this.state.carregando?'Executando':'Alterar Senha'}</Button>
                            </Col>
                            <Col lg="3" md="6" sm="12">
                                <Link to={'/'}>
                                    <Button disabled={this.state.carregando} block color="danger" >Cancelar</Button>
                                </Link>
                            </Col>
                        </Row>
                    </CardBody>
                    </Card>
                </CardGroup>
            </Col>
        </Row>
    </Container>
    );
}
}
