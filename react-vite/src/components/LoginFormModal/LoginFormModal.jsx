import { useState } from 'react';
import { thunkLogin } from '../../redux/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';
import { useModal } from '../../context/Modal';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);

  if (sessionUser)
    return (
      <Navigate
        to='/'
        replace={true}
      />
    );

  const handleSubmit = async e => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      }),
    );

    if (serverResponse) {
      setErrors(serverResponse);
    }

    if (!Object.values(errors).length) {
      closeModal();
    }
  };

  const handleDemoLogin = async () => {
    await dispatch(
      thunkLogin({
        email: 'demo@google.com',
        password: 'password',
      }),
    );

    closeModal();
  };

  return (
    <div className='flex flex-col justify-center items-center p-4'>
      <h1 className='text-2vw mb-4'>Log In</h1>

      {errors.server && <p className='text-destructive italic'>{errors.server}</p>}

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 justify-center items-center'
      >
        <div className='flex flex-col text-1vw'>
          <label>Email:</label>

          <input
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {errors.email && <p className='text-destructive italic'>{errors.email}</p>}

        <div className='flex flex-col text-1vw'>
          <label>Password:</label>

          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {errors.password && <p className='text-destructive italic'>{errors.password}</p>}

        <button
          type='submit'
          className='bg-primary text-foreground text-.8vw p-2 rounded-lg w-[10vw] hover:bg-muted'
        >
          Log In
        </button>

        <button
          type='button'
          onClick={handleDemoLogin}
          className='bg-primary text-foreground text-.8vw p-2 rounded-lg w-[10vw] hover:bg-muted'
        >
          Demo Login
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
