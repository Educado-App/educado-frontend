import { useState } from "react";
import useSWR from "swr";
import { Link, useLocation } from 'react-router-dom';
import AuthServices from "../services/auth.services";
import Loading from "../components/general/Loading";
import Layout from "../components/Layout";

const EducadoAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedButton, setSelectedButton] = useState('users');

    const location = useLocation();
    const { data } = useSWR('api/applications', AuthServices.GetCCApplications);

    if (!data) return <Loading/>

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        let formattedDate = date.toLocaleString('pt-BR', options).replace(' às', '');
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        return formattedDate;
    };

    return (
        <Layout meta="Educado Admin">
            <div className="w-full flex flex-row space-x-2 px-12 py-10">
                <div className="inline-block min-w-full shadow overflow-hidden rounded-xl bg-white">
                    <div className='flex flex-row no-wrap'>
                    </div>

                    <div className="navbar justify-end md:w-full bg-none p-6 mt-4">
                        <div className="flex-none flex w-full">
                            <Link
                                className={`flex-shrink-0 w-1/2 px-12 py-3 text-base font-semibold border-b border-b-[#166276] font-['Montserrat'] ${selectedButton === 'users' ? 'bg-[#166276] text-white' : 'bg-white text-[#166276]'} font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 text-center`}
                                to="/educado-admin/new-user"
                                onClick={() => setSelectedButton('users')}
                            >
                                <button type="submit">Users</button>
                            </Link>
                            <Link
                                className={`flex-shrink-0 w-1/2 px-12 py-3 text-base font-semibold border-b border-b-[#166276] font-['Montserrat'] ${selectedButton === 'institutions' ? 'bg-[#166276] text-white' : 'bg-white text-[#166276]'} font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 text-center`}
                                to="/educado-admin/new-institution"
                                onClick={() => setSelectedButton('institutions')}
                            >
                                <button type="submit">Institutions</button>
                            </Link>
                        </div>
                    </div>

                    <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-full md:space-x-4 space-y-3 md:space-y-0 justify-end p-6 -mt-4">
                        <select className="block bg-white min-w-[175px] flex-grow-0 border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm">
                            <option value="option1">Mais recentes</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                        <div className="relative min-w-[225px] flex-grow-0">
                            <input
                                className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm"
                                type="text"
                                id="search-term"
                                placeholder="Buscar usuário"
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </form>

                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-white border-b border-gray-200 text-[#166276] text-left text-base font-base font-['Lato']">
                                <th scope="col" className="p-5">Admin</th>
                                <th scope="col" className="p-5">Nome</th>
                                <th scope="col" className="p-5">Email</th>
                                <th scope="col" className="p-5">Status</th>
                                <th scope="col" className="p-5">Enviado em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data.data.filter((application: any) => {
                                if (searchTerm === "") return application;
                                if (application.firstName.toLowerCase().includes(searchTerm.toLowerCase())) return application;
                                if (application.lastName.toLowerCase().includes(searchTerm.toLowerCase())) return application;
                                if (application.email.toLowerCase().includes(searchTerm.toLowerCase())) return application;
                            }).map((application: any, key: number) => {
                                return (
                                    <tr key={key} className="px-5 py-5 border-b border-gray-200 bg-white text-base font-['Montserrat']">
                                        <td>
                                            <p className="text-gray-900 whitespace-no-wrap ml-4" id="admin">
                                                <div className="toggle-switch ">
                                                    <label className="inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" value="" className="sr-only peer"/>
                                                            <div className="relative w-10 h-3.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3.5px] after:start-[2px] after:bg-gray-400 peer-checked:after:bg-cyan-800  after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-toggleChecked"></div>
                                                    </label>
                                                </div>
                                            </p>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap" id="name">
                                                        {application.firstName} {application.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-gray-900 whitespace-no-wrap" id="email">
                                                {application.email}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text-gray-900 whitespace-no-wrap" id="status">
                                                Status
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text-gray-900 hover:text-indigo-900" id="date">
                                                {formatDate(application.joinedAt)}
                                            </p>
                                        </td>
                                        <td>
                                            <div className="flex items-center p-4">
                                                <Link to={`${location.pathname}/${application._id}`} id="viewDetails" className="flex items-center justify-center p-4  bg-[#166276] rounded-full font-semibold text-base text-white">
                                                    <svg className="shrink-0 size-3.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center p-4">
                                                <Link to={`${location.pathname}/${application._id}`} id="viewDetails" className="flex items-center justify-center p-4  bg-[#166276] rounded-full font-semibold text-base text-white">
                                                    <svg className="shrink-0 size-3.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between">
                        <div className="flex items-center">
                            <button type="button" className="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100">
                                <svg width="9" fill="currentColor" height="8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
                                </svg>
                            </button>
                            <button type="button" className="w-full px-4 py-2 border-t border-b text-base text-indigo-500 bg-white hover:bg-gray-100">1</button>
                            <button type="button" className="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100">2</button>
                            <button type="button" className="w-full px-4 py-2 border-t border-b text-base text-gray-600 bg-white hover:bg-gray-100">3</button>
                            <button type="button" className="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100">4</button>
                            <button type="button" className="w-full p-4 border-t border-b border-r text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100">
                                <svg width="9" fill="currentColor" height="8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19 19-19 45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default EducadoAdmin;