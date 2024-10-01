
type DropzoneProps = {
    inputType: string,
    callBack: Function
}

/**
 * 
 * @param {Function}callBack - The function that will be called when the user uploads a file and should set the value of an variable in the parent component
 * @returns {JSX.Element} - The image dropzone component
 */

export const Dropzone = ({callBack, inputType}:DropzoneProps) => {
    return (
        <div>

          {/* The dotted line */}
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-600 px-10 pt-5 pb-6">
                {/* The little image of a mountain */}
                <div className="space-y-1 text-center"> 
                    <svg
                        className="mx-auto h-6 w-6 text-gray-600"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* Text with a link to upload a file */}
                    <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md  font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primaryHover"
                        >
                            <span>Carregamento de arquivo</span>
                            {inputType === "image" ? 
                                <input id="file-upload" name="file-upload" accept="image/*" type="file" className="sr-only" onChange={(e)=>{callBack(e.target.files?.item(0))}}/>
                                :
                                inputType === "video" ? 
                                <input id="file-upload" name="file-upload" accept="video/*" type="file" className="sr-only" onChange={(e)=>{console.log(e.target.files?.item(0)); callBack(e.target.files?.item(0))}}/>
                                :
                                <p>Tipo de arquivo não reconhecido</p> /*File type not recognized*/
                                
                            }
                        </label>
                     
                    </div>
                   
                </div>
            </div>
        </div>
    )
}
