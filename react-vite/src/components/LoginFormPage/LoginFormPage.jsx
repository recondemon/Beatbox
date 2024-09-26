import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate("/");
    }
  };

  const handleDemoLogin = async () => {
    const serverResponse = await dispatch(
      thunkLogin({
        email: "demo@google.com",
        password: "password",
      })
    );

    if (!serverResponse) {
      closeModal();
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h1 className="text-2vw mb-4">Log In</h1>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col text-1vw">
          <label>
            Email:
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
          {errors.email && <p>{errors.email}</p>}
        <div className="flex flex-col text-1vw">
          <label>
            Password:
          </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </div>
        <div>
          <p>
            Don&apos;t have an account?
            <span className="text-primary text-center list-none hover:underline hover:text-foreground">
            <OpenModalMenuItem
                itemText="Sign Up"
                // onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
            />          
            </span>  
          </p>          
        </div>
          {errors.password && <p>{errors.password}</p>}
          <button 
          type="submit"
          className="bg-primary text-foreground text-.8vw p-2 rounded-lg w-[10vw] hover:bg-muted"
          >
            Log In
          </button>
          <button
          type="button"
          onClick={handleDemoLogin}
          className="bg-primary text-foreground text-.8vw p-2 rounded-lg w-[10vw] hover:bg-muted"
        >
          Demo Login
        </button>
        </form>
    </div>
  );
}

export default LoginFormPage;
