import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignUp } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.secondary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.secondary + 90};
`;

const Signup = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const [buttonDisabled,setButtonDisabled] = useState(false);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
  
    const validateInputs = () => {
      if(!email || !password){
        alert("Please fill in all fields")
        return false;
      }
      return true;
    }
  
    const handleSignUp = async () => {
      setLoading(true)
      setButtonDisabled(true)
  
      if(validateInputs){
        await UserSignUp({name, email,password})
        .then((res) => {
          dispatch(loginSuccess(res.data));
          setOpenAuth(false)
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
        .finally(() => {
          setLoading   (false)
          setButtonDisabled(false)
        })
      }
    }
  
  return <Container>
    <div>
      <Title>Welcome to Airbnb</Title>
      <Span>Please Sign Up with your details here</Span>
    </div>
    <div style={{display:"flex",gap:"20px",flexDirection:"column"}}>
      <TextInput label="Full Name" placeholder="Enter your full name" handelChange={(e) => setName(e.target.value)}/>
      <TextInput label="Email Address" placeholder="Enter your email address" handelChange={(e) => setEmail(e.target.value)}/>
      <TextInput label="Password" placeholder="Enter your password" password handelChange={(e) => setPassword(e.target.value)}/>
      <Button text="Sign Up" onClick={handleSignUp} isLoading={loading} isDisabled={buttonDisabled}/>
    </div>
  </Container>;;
};

export default Signup;
