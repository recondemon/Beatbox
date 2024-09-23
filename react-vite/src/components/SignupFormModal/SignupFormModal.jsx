import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [bandName, setBandName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        email,
        band_name: bandName,
        bio,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2vw text-center">Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2 mt-4">
          <div className="flex flex-col">
            <label>
              First Name:
            </label>
            <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
            />
          </div>
          <div className="flex flex-col">
            <label>
              Last Name:
            </label>
            <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
            />
          </div>
        </div>
          <div className="flex flex-col">
            <label>
              Email:
            </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <label>
              Band Name(optional):
            </label>
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                placeholder="Enter band name"
              />
            {errors.username && <p>{errors.username}</p>}
          </div>
        <div>
          <div className="flex flex-col">
            <label>
              Bio:
            </label>
            <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Enter bio'
            required
            className="bg-input text-secondary-foreground p-2 rounded-lg"
            />
          </div>
        </div>


        <div className="flex flex-col">
          <label>
            Password:
          </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className="flex flex-col">
          <label>
            Confirm Password
          </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="mt-4">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
