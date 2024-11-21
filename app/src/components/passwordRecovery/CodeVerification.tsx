import PinField from "react-pin-field";
import TextInput from "../general/TextInput";

type propsType = {
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  emailSent: boolean;
  codeError: string;
  setCode: (code: string) => void;
  setCodeEntered: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailError: (error: string) => void;
}

/**
 * Screen that allows the user to verify their email and insert the code sent to it.
 * @param {propsType} props properties of the component:
 * - `email`: the email hook
 * - `setEmail`: the function that sets the email hook
 * - `emailError`: the email error hook
 * - `emailSent`: boolean that indicates if the email has been sent
 * - `codeError`: the code error hook
 * - `setCode`: the function that sets the code hook
 * - `setCodeEntered`: the function that sets the code entered hook
 * @returns {JSX.Element} the screen component
 */
export default function CodeVerification(props: propsType) : JSX.Element {
  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      {!props.emailSent && (
        <div className="-mb-1">
          <TextInput 
            id='reset-password-email-field' 
            className='' 
            placeholder="Insira sua Email" // Enter your email
            label="Email"
            value={props.email} 
            onChange={props.setEmail} 
          />
          {props.emailError && <p className="text-error">{props.emailError}</p>} {/* Display email error in red */}
        </div>
      )}
      {props.emailSent &&
        <div className="flex h-full flex-col justify-center items-center">
          {/** We sent a code to your email to reset your password, please insert it below */}
          <p>Enviamos um código para o email <span style={{ fontWeight: 'bold', color: 'black' }}>{props.email}</span> redefinição de senha, por favor, insira o mesmo abaixo.</p> 
          <div className="flex flex-row justify-center items-center w-[420px] h-[38px] space-x-2.5">
            <PinField
              id="pin-field"
              length={4}
              className="flex flex-row justify-center items-center"
              validate="0123456789"
              inputMode="numeric"
              onChange={props.setCode}
              onComplete={() => {
                props.setCodeEntered(true);
              }}
              style={{
                width: '99px', // Width
                height: '38px', // Height
                padding: '8px 16px', // Padding: Top 8px, Right 16px, Bottom 8px, Left 16px
                marginRight: '0px', // Gap
                borderRadius: '8px', // Border radius
                borderColor: '#e8effa',
                opacity: '1', // Opacity
                textAlign: 'center', // Center text
              }}
            />
          </div>
          <p id="pin-error" className="text-warning h-0">{props.codeError}</p>
        </div>}
    </div>
  )
}