
interface Props {
    tickChange: number;
}

function Checklist ({tickChange}: Props)  {
    
    return (
    
    //ON ALL checkboxes depending on button show other components

        /* Checklist and Header */
        <div className="m-8 flex-grow overflow-x-hidden w-1/5 float-left items-center justify-left space-y-4 grid grid-flow-row auto-rows-max ">
    
            {/* Header */}
            <div >
                <p className="text-2xl text-grayMedium">Novo Curos</p> {/* New course */}
            </div>

            {/* Check-box list */}
            <div className="border-y py-8 w-5/6 border-grayMedium flex flex-col space-y-4 ">

                {/* General Information */}
                {tickChange === 0 ?
                        <label htmlFor="check1" className="pl-2 flex items-center border-l-4 border-primary" >
                            <input className='mr-2 text-primary rounded' type="checkbox" id="check1" disabled />
                        Informações gerais</label> 
                    :
                    <label htmlFor="check1" className="pl-3 flex items-center" >
                        <input className='mr-2 text-primary rounded' type="checkbox" id="check1" disabled checked/>
                    Informações gerais</label>
                }

                
                {/* Course sections */}
                {tickChange === 0 ?
                <label htmlFor="check2" className="pl-3 flex items-center" >
                <input className='mr-2 text-primary rounded' type="checkbox" id="check2" disabled/>
                Seções do curso</label>
                :
                tickChange === 1 ?
                <label htmlFor="check2" className="pl-2 flex items-center border-l-4 border-primary" >
                    <input className='mr-2 text-primary rounded' type="checkbox" id="check2" disabled/>
                Seções do curso</label>
                :
                <label htmlFor="check2" className="pl-3 flex items-center" >
                    <input className='mr-2 text-primary rounded' type="checkbox" id="check2" disabled checked/>
                Seções do curso</label>
                }

    


                {/* Review course */}
                {tickChange < 2 ?
                    <label htmlFor="check3" className="pl-3 flex items-center" >
                        <input className='mr-2 text-primary rounded' type="checkbox" id="check3" disabled/>
                    Revisar curso</label> 
                    :
                    <label htmlFor="check3" className="pl-2 flex items-center border-l-4 border-primary" >
                        <input className='mr-2 text-primary rounded' type="checkbox" id="check3" disabled/>
                    Revisar curso</label>
                }
                    
            </div>
            
        </div>
    
    

    )

}

export default Checklist