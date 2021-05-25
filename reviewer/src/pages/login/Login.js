import './login.css';

import Header from '../../components/header';
import Form from './components/form';
import blogging from '../../assets/img/blogging.svg';

export default function Login() {
  return (
    <div className="login">
      <Header />
      <Form />
      <div className="image-asset">
        <img src={blogging} alt="blogging" className="blogging-img" />
      </div>
    </div>
  );
}
