import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const alert= withReactContent(Swal); 
export default async function sessionExpired(){
    alert.fire({
        icon: 'error',
        title: 'Sua sessão expirou!',
        text: 'Você será redirecionado para a página de login!'
    });
    localStorage.removeItem("kinema-token");
    await setInterval(8000);
    window.history.replaceState(null,"login","/login");
    window.history.go();
}