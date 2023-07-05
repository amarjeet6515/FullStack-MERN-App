import React, { useEffect , useState} from 'react';
import {
  Flex,
  Box,
  Image,
  useToast,
  Button,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginSuccess } from '../Redux/action';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { Preloader } from '../components/Preloader';
import swan from '../Images/swan.jpg'
import loginLogo from '../Images/login-page-logo.png'

export default function Login() {


  const [email, setEmail] = useState("");
 
  const [password, setPassword] = useState("");




  const dispatch = useDispatch();
  const { isAuthenticated, privateroute } = useSelector((state) => state);
  const navigate = useNavigate();
  const toast = useToast();

  function handleCredentialResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
    var user_obj = jwtDecode(response.credential);

    var auth = user_obj.email_verified;
    console.log(user_obj);
    if (auth) {
      dispatch(loginSuccess(user_obj));
    localStorage.setItem('user_obj',JSON.stringify(user_obj));
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } else {
      dispatch(loginFailure(user_obj));
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`${privateroute}`);
    }
    console.log(privateroute);
  }, [isAuthenticated]);  

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      dispatch(loginSuccess()); // Assuming you don't need to pass user_obj here
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);





  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email,
      password
    };
    console.log(payload);
    fetch("http://localhost:7000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if(res.token){
          localStorage.setItem("token",res.token);
          dispatch(loginSuccess(res));
        }
        else{
          dispatch(loginFailure());
          alert(res.message)
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <GoogleOAuthProvider 
    clientId="373264275746-eju7u5qlvit8e986i1b552dn49nb0nvt.apps.googleusercontent.com">
      <div
        style={{
          background: `url(${swan})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Rest of the code */
          <Flex className="signin-and-heading-text-flex-box">
          <Box
            width={'50%'}
            height={'100vh'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-around'}
          >
            <Image src={loginLogo} w={'250px'} />
            <Flex textAlign={'center'} flexDirection={'column'}  gap={'10px'}>
            <form onSubmit={handleLogin} style={{
                                    // fontFamily: 'Estonia, cursive',
                                    fontWeight: '100',
                                    fontSize: '2.3rem',
                                    width: '85%',
                                    color: 'white'
                                }}>
                                    <FormControl>
                                        <FormLabel  mb={-15}>Email</FormLabel>
                                        <Input
                                            type="email"
                                            width='250px'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel mb={-15}>Password</FormLabel>
                                        <Input
                                            type="password"
                                            width='250px'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </FormControl>

                                    <Button type="submit" 
                                     colorScheme="green"
                                     shape='square'
                                     width='250px'
                                     >
                                        LOGIN
                                    </Button>
                                </form>
                                <h3 style={{color: 'white'}}>OR</h3>
                                <Link to={`/signup`}><Button  
                                     colorScheme="green"
                                     shape='square'
                                     width='250px'
                                     >
                                        SIGNUP
                                    </Button>
                                    </Link>
              
              <GoogleLogin
                onSuccess={handleCredentialResponse}
                theme='outline'
                shape='square'
                size='medium'
                logo_alignment='center'
                width='250px'
                onError={() => {
                  console.log('Login Failed');
                }}
                text='continue_with'
              />
              <Button 
              className="back-to-home-btn" 
              height={'35px'} 
              border={'2px solid white'} 
              background={'transparent'} 
              color={'white'}
              _hover={{
                color:"black",
                background:"white"
              }}
              fontSize={'.9rem'}
              onClick={()=>{
                navigate('/');           
              }}
              >Back To Home</Button>
            </Flex>
          </Box>
          <Box width={'50%'} textAlign={'left'} color={'white'} className="signin-box-text">
            <h4
              style={{
                fontFamily: 'Italiana, serif',
                fontWeight: '100',
                fontSize: '3.2rem',
                width: '49%',
                display: 'flex',
              }}
              className="login-heading"
            >
              Login to an Authentic eco-tourism Experience
            </h4>
            <h5
              style={{
                fontFamily: 'Estonia, cursive',
                fontWeight: '100',
                fontSize: '2.3rem',
                width: '85%',
              }}
              className="login-para"
            >
              Step into the enchanting world of eco-tourism and embrace the rustic charm of authentic experiences.
              Immerse yourself in the beauty of nature as you embark on a sustainable journey.
            </h5>
          </Box>
          </Flex>
        }
      </div>
    </GoogleOAuthProvider>
  );
}


