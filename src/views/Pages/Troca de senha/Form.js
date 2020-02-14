import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardTitle, CardGroup, Col, Container,  Row
   } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
class ChangePassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          currentPassword: "",
          carregando: false,
          modal:false,
        };
        this.handleChange=this.handleChange.bind(this);
        
      }


handleChange(e, key){
    this.setState({[key]:e.target.value});
}

verificaUsuario(){

}

handleInvalidSubmit(){

}

render(){
    return(
     
    <Container>
        <Row className="justify-content-center mt-4">
            <Col md="8">
                <CardGroup >
                    <Card className="p-4 w-100 h-100">
                        <CardTitle className="mb-4"><center>Alterar Senha</center></CardTitle>
                    <AvForm onValidSubmit={this.verificarUsuario} onInvalidSubmit={this.handleInvalidSubmit}>
                        {/** email do Usuario */}
                        <AvField name="senhaAtual" placeholder="Senha atual" type="password"  value={this.state.currentPassword} onChange={(e) => this.handleChange(e, 'currentPassword')} validate={{
                                required: {value: true, errorMessage: 'Digite a senha atual'}
                        }} />

                        {/** senha do Usuario */}
                        <AvField name="originalPassword" placeholder="Nova senha" type="password" validate={{
                                required: {value: true, errorMessage: 'Por Favor, digite uma senha'}
                        }}/>

                        <AvField name="confirmationPassword" placeholder="Digite a senha novamente" type="password" autoComplete="password" value={this.state.newPassword} onChange={(e) => this.handleChange(e, 'newPassword')} validate={{
                        required: {value: true, errorMessage: 'Por Favor, digite a senha novamente'},
                        match:{value:'originalPassword', errorMessage: 'Parece que agora você digitou uma senha diferente'}}} />

                        <Button disabled={this.state.carregando} color="success" className='mb-2' block>{this.state.carregando?'Executando':'Alterar Senha'}</Button>
                        <Link to={'/'}>
                            <Button disabled={this.state.carregando} color="danger" block>Cancelar</Button>
                        </Link>
                    </AvForm>
                    </Card>
                </CardGroup>
            </Col>
        </Row>
    </Container>
    );
}
}
export default ChangePassword;