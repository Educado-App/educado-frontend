import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import { yupResolver } from '@hookform/resolvers/yup'
import React, { Component, useState } from 'react' ;
import * as Yup from 'yup';
import Icon from '@mdi/react';
import { mdiEyeOffOutline, mdiEyeOutline, mdiFormTextboxPassword } from '@mdi/js';
import { mdiChevronLeft } from '@mdi/js';
import { mdiCheckBold } from '@mdi/js';
import educado from "../assets/educado.png"
import background from "../assets/background.jpg"


// services
import AuthServices from '../services/auth.services'

// Form input interface
interface ApplicationInputs {
  name: String,
  email: String, 
  password: String,
  confirmPassword: String,
}

const SignupSchema = Yup.object().shape({
  
  name: Yup.string()
    .required("Your full name is Required!"),
  password: Yup.string()
    .min(8, 'Too Short!')
    .required("Password is not long enough"),
  confirmPassword:  Yup.string().oneOf([Yup.ref('password'), null], "Ss senhas não coincidem"),
  
  email: Yup.string().email('Invalid email format').required('Required'),
});

const Signup = () => {
  let navigate = useNavigate(); // navigation hook

  // use-hook-form setup
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationInputs>({
    resolver: yupResolver(SignupSchema)
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }
  // onSubmit Handler
  const onSubmit = async (data: any) => {
    await AuthServices.postUserSignup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    navigate('/login')

  };
anything
  /*return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#c8e5ec] to-[white]">
      <nav className="navbar bg-base-100 border-b shadow fixed top-0 z-10">
                <div className="navbar-start">
                    <Link to="/" className="flex flex-shrink-0 items-center space-x-1 normal-case text-xl" >
                      <img src={logo} alt="ecs-logo" className='h-6' />
                    </Link>
                </div>
             </nav>
      
      <h1 className="w-[400px] text-[28px] text-center font-bold font-['Lato']">Crie a sua conta gratuitamente!</h1>
        <div className='flex flex-col divide text-gray-700'>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <label className="font-semibold text-xs mt-3" htmlFor="nameField"> 
            Nome <span className="ml-1 text-red-500 text-xs font-normal font-montserrat">*</span>
             </label>
            <input
              type="text" id="nameField"
              className="rounded border flex-1 appearance-none border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Nome Sobrenome"
              {...register("name", { required: "digite seu nome completo." })}
            />
            {errors.name?.message}

            <label className="font-semibold text-xs mt-3" htmlFor="emailField">
              Email <span className="ml-1 text-red-500 text-xs font-normal font-montserrat">*</span>
              </label>
            <input
              type="text" id="emailField"
              className="rounded flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="user@email.com"
              {...register("email", { required: " introduza o seu e-mail." })}
            />
            {errors.email?.message}

            <label className="font-semibold text-xs mt-3" htmlFor="passwordField">
              Senha <span className="ml-1 text-red-500 text-xs font-normal font-montserrat">*</span>
            </label>
            <input
              type="password" id="passwordField"
              className="rounded border flex-1 appearance-none border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="********** "
              {...register("password", { required: "insira a senha." })}
            />
            {errors.password?.message}
              <button type="submit" className= "w-[522px] h-[52px] px-10 py-4 opacity-30 bg-cyan-300 text-black rounded-lg justify-center items-start gap-2.5 inline-flex">
                Entrar
              </button>
              <span className="h-2" /> {/* spacing 
          </form>
        </div>

        <div className="text-center">
          <a className="text-blue-400 hover:text-blue-500" href="#">Esqueceu sua senha</a>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/login" className="text-blue-400 hover:text-blue-500">Já possui conta?</Link>
        </div>
    </main>
  )
}
*/
return (
  <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#c8e5ec] to-[white] overflow-hidden">
       <nav className="navbar bg-base-100 border-b shadow fixed top-0 z-10">
          <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-12">
              <div className="navbar-start">
                   <Link to="/" className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl" >
                     <img src={educado} alt="educado" className='h-6' />
                  </Link>
              </div>    
          </div>
      </nav>
    
  <div className='w-full h-screen flex'>
      <div className='grid grid-cols-2 md:grid-cols'>
          <div className='w-full h-screen overflow-hidden'>
            <img src={background} alt="w-[42.375rem] h-[42.375rem]" className=' w-full h-full' />
      </div>


 <div className=" flex flex-col items-start py-16 px-0 ">
  <div className=" flex flex-col  mt-[1.5rem]">
      <div className="flex text-center text-base text-gray-500 font-normal font-Montserrat underline m-6">
        <Link to="/welcome">
          <Icon path={mdiChevronLeft} size={1} color="gray" />
          <Link to="/welcome" className="flex text-center text-base text-gray-500 font-normal font-Montserrat underline">Back</Link>
      </div>

  <div className='self-stretch flex flex-col justify-center flex-1'>
    <div className="w-[38rem] h-[2.1rem] self-stretch flex flex-col items-start justify-center gap-12  py-20 px-20">
      <h1 className="self-stretch  text-neutral-700 text-[2rem] font-bold font-['Lato'] leading-normal">Crie a sua conta gratuitamente!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="stretch flex flex-col space-y-2">  


  <div className='w-[38rem] h-[22rem]flex flex-col item-end'>
    <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4]  font-['Montserrat'] mt-6" htmlFor="usernameField"> 
       Nome 
      <span className=" text-red-500 text-xs font-normal font-montserrat">*</span>
    </label>
    <form onSubmit={handleSubmit(onSubmit)} className="stretch flex flex-col space-y-2">  
      <input
      type="text" id="usernameField"
      className="w-[38rem] h-[22rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent "
      placeholder="Nome Sobrenome"
      {...register("name", { required: "digite seu nome completo." })}
      />

      <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4] font-['Montserrat'] mt-6" htmlFor="usernameField">
        Email  
        <span className="text-red-500 text-xs font-normal font-montserrat">*</span>
      </label>
      <input
        type="email" id="emailField"
        className="w-[38rem] h-[2.6rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
        placeholder="User@email.com"
        {...register("email", { required: " introduza o seu e-mail." })}
        />

      <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4]  font-['Montserrat'] mt-6" htmlFor="passwordField">
           Senha   
           <span className=" text-red-500 text-xs font-normal font-montserrat">*</span>
        </label>
        <input
            type="password" id="passwordField"
            className="w-[38rem] h-[2.6rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
            placeholder="**********"
            {...register("password", { required: "insira a senha." })}
            
          />
        <Icon path={mdiCheckBold} size={1} />
        <div className="px-3 flex-col justify-start items-start gap-0.5 flex">
          <div className="justify-start items-start gap-0.5 inline-flex">
            <div className="text-gray-400 text-xs font-normal font-['Montserrat'] mt-2">
             &bull; Mínimo 8 caracteres
            </div>
         </div>

        <div className="justify-start items-start gap-0.5 inline-flex">
            <div className="text-gray-400 text-xs font-normal font-['Montserrat'] ">
             &bull; Conter pelo menos uma letra
            </div>
          </div>
        </div>

      <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4] font-['Montserrat'] mt-6 z-10" htmlFor="passwordFieldRepeat">
        Confirmar Senha 
          <span className=" text-red-500 text-xs font-normal font-montserrat">*</span>
        </label>
        <input
            type="password" id="passwordFieldRepeat"
            placeholder="********** "
            className="w-[38rem] h-[2.6rem] rounded border   flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
            {...register("confirmPassword", { required: "insira a senha." })}
          />
        </div>

        <span className="h-[3rem]" /> {/* spacing */}
        
        <button type="submit" className="px-[2rem] py-[1rem] mt-10 bg-cyan-300 text-white opacity-100  ease-in hover:bg-cyan-500 hover:text-gray-50">
            Entrar
        </button>
        </form>
      </div>
  </div>
</div>
</div>
</div>
</div>
</main>
)
}

export default Signup;