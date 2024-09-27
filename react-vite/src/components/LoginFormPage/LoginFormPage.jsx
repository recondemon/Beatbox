// import { useState } from 'react';
// import { thunkLogin } from '../../redux/session';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, useNavigate } from 'react-router-dom';
// import './LoginForm.css';
// import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
// import SignupFormModal from '../SignupFormModal';
import { useModal } from '../../context/Modal';

export default function LoginFormPage() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { closeModal } = useModal();
  // const sessionUser = useSelector(state => state.session.user);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [errors, setErrors] = useState({});
  // if (sessionUser)
  //   return (
  //     <Navigate
  //       to='/'
  //       replace={true}
  //     />
  //   );
  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   const serverResponse = await dispatch(
  //     thunkLogin({
  //       email,
  //       password,
  //     }),
  //   );
  //   if (serverResponse) {
  //     setErrors(serverResponse);
  //   } else {
  //     closeModal();
  //     navigate('/');
  //   }
  // };
  // const handleDemoLogin = async () => {
  //   const serverResponse = await dispatch(
  //     thunkLogin({
  //       email: 'demo@google.com',
  //       password: 'password',
  //     }),
  //   );
  //   if (!serverResponse) {
  //     closeModal();
  //     navigate('/');
  //   }
  // };
  // return (
  // );
}
