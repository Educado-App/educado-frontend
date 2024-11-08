import { createContext, useEffect, useState } from "react";
import * as Services from '../../services/passwordRecovery.services';
import CodeVerification from "./CodeVerification";
import NewPasswordScreen from "./NewPasswordScreen";
import NavigationFooter from "./NavigationFooter";
import { validatePasswords, validateEmail } from "../../utilities/validation";

type propTypes = {
  toggleModal: () => void;
  setErrorMessage: (message: string, error?: string) => void;
}

export const HandleContinueContext = createContext<() => void>(() => { });

/**
 * Modal that allows the user to reset their password.
 * @param {propTypes} props properties of the component:
 * - `setError`: function that sets the error message
 * - `setErrorMessage`: function that sets the error message
 * @returns {JSX.Element} the modal component
 */
const PasswordRecoveryModal = (props: propTypes) : JSX.Element => {

  // States that control the flow of the modal
  const [emailSent, setEmailSent] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  // User input
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Password validation
  const [passwordContainsLetter, setPasswordContainsLetter] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);

  // Error messages
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');  
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('');

  /**
   * Handles the continue button click. If the email has not been sent yet, validates the email and sends it.
   * If the code has not been verified yet, validates the code and verifies it.
   * If the code has been verified, validates the passwords and updates the password.
   */
  function handleContinue() {
    if (!emailSent) {
      try {
        validateEmail(email);
      } catch (err: any) {
        setEmailError(err.message);
        return;
      }
      sendEmail(email);
      return;
    }
    if (codeEntered && !codeVerified) {
      verifyCode(email, code);
      return;
    }
    if (codeVerified) {
      try {
        validatePasswords(password, passwordConfirmation)
      } catch (err: any) {
        // Password needs to contain at least one letter
        if(err.message === 'Os campos de senha precisam ser iguais') {
          setPasswordConfirmationError(err.message);
          return;
        }
        setPasswordError(err.message);
        return;
      }
      
      updatePassword();
      return;
    }
  }

  /**
   * Updates the user's password. If an unexpected error occurs, sets error to the appropriate error message.
   */
  async function updatePassword() {
    Services.updatePassword(email, password, code)
      .then(() => {
        props.setErrorMessage('Senha alterada com sucesso!', 'Sucesso') // Password changed successfully!
        props.toggleModal();
      })
      .catch((error) => {
        switch (error?.error?.code) {
          default:
            props.setErrorMessage('Erro inesperado: Tente novamente mais tarde.') // Unexpected error, try again later
        }
      });
  }


  /**
   * Sends an email to the user with a verification code to reset the password. 
   * If the email is not registered, sets emailError to the appropriate error message. 
   * If an unexpected error occurs, sets error to the appropriate error message.
   * @param email the user's email
   */
  async function sendEmail(email: string) {
    Services.sendEmail(email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((error) => {
        switch (error.error?.code) {
          case 'E0401':
            setEmailError('Email não cadastrado'); // Email not registered
            break;
          case 'E0406':
            props.setErrorMessage('Muitas tentativas de reenvio! Espere 5 minutos...') // Too many attempts, wait 5 minutes
            break;
          default:
            props.setErrorMessage('Erro inesperado: Tente novamente mais tarde.') // Unexpected error, try again later
        }
      });
  }

  /**
   * Verifies the code entered by the user. If the code is valid, sets codeVerified to true. 
   * If the code is invalid, sets codeError to the appropriate error message.
   * @param email the user's email
   * @param code the verification code used to reset the password
   */
  async function verifyCode(email: string, code: string) {
    Services.verifyCode(email, code)
      .then(() => {
        setCodeVerified(true);
      })
      .catch((error) => {
        console.log(error)
        switch (error?.error?.code) {
          case 'E0404':
            setCodeError('Código expirado'); // Expired code
            break;
          case 'E0405':
            setCodeError('Código inválido'); // Invalid code
            break;
          default:
            // Unexpected error
            props.setErrorMessage('Erro inesperado: Tente novamente mais tarde.') // Unexpected error, try again later
        }
      })

  }

  useEffect(() => { // Resets errors upon changes
    setEmailError('');
    setCodeError('');
  }, [email, code]);

  return (
    <div id="password-reset-modal" className="absolute inset-0 grid place-items-center">
  {/* Background overlay */}
  <div className="absolute inset-0 bg-[#383838] opacity-60"></div>

  {/* Modal content */}
  <HandleContinueContext.Provider value={handleContinue}>
    <div className="bg-gradient-to-b p-10 rounded-xl w-11/12 xl:max-w-[35%] overflow-scroll lg:max-w-[40%] md:max-w-[50%] sm:max-w-[60%] max-w-[80%] max-h-[100%] relative z-10">
      <h3 className="font-bold text-xl mb-4">Redefinção de senha</h3> {/** Reset password */}

      {!codeVerified ? (
        <CodeVerification
          email={email}
          setEmail={setEmail}
          setCode={setCode}
          codeError={codeError}
          emailError={emailError}
          emailSent={emailSent}
          setCodeEntered={setCodeEntered}
        />
      ) : (
        <NewPasswordScreen
          password={password}
          setPassword={setPassword}
          passwordError={passwordError}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          passwordConfirmationError={passwordConfirmationError}
          passwordContainsLetter={passwordContainsLetter}
          passwordLengthValid={passwordLengthValid}
          setPasswordContainsLetter={setPasswordContainsLetter}
          setPasswordLengthValid={setPasswordLengthValid}
        />
      )}
      <NavigationFooter codeVerified={codeVerified} />
    </div>
  </HandleContinueContext.Provider>
</div>
  )
}

export default PasswordRecoveryModal;