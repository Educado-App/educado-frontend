import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"

import Logo from "../assets/educado.png"

const Welcome = () => {


    return (
    <main className="flex flex-none bg-gradient-to-br from-[#c8e5ec] to-[white]">
        <header>
            <nav className="navbar top-0 z-10 bg-base-100 border-b fixed shadow">
                <div className="navbar-start">
                        <img src={Logo} alt="ecs-logo" className='h-6' />
                </div>

                <div className="navbar-nav ml-auto hidden lg:flex">
                    <ul className="menu menu-horizontal p-0">
                        <li>
                            <Link to={"/Login"}>
                            <span>Login</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/Signup"}>
                                <span>Sign Up</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>

        <body>
        
        </body>

             
    </main>
    )
}

export default Welcome