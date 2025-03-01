"use client"
import CardWrapper from "./CardWrapper"
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import FormError from "../common/FormError";
import FormSuccess from "../common/FormSuccess";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const onSubmit = useCallback(() => {
    if (success || error) return;
    
    if (!token) {
      setError("Missing token");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something Went Wrong")
      })
  }, [token, success, error])
  
  useEffect(() => {
    onSubmit();
  }, [onSubmit])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md px-4">
        <CardWrapper
          headerLabel="Confirming Your Verification"
          backButtonLabel="Back to Login"
          backButtonHref="/auth/login"
        >
          <div className="flex flex-col items-center justify-center w-full p-6 space-y-4">
            {!success && !error && (
              <div className="py-8">
                <BeatLoader color="#3b82f6" />
              </div>
            )}
            
            {success && (
              <div className="w-full">
                <FormSuccess message={success} />
              </div>
            )}
            
            {!success && error && (
              <div className="w-full">
                <FormError message={error} />
              </div>
            )}
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}
// "use client"

// import CardWrapper from "./CardWrapper"
// import { BeatLoader } from 'react-spinners';
// import {  useSearchParams
// } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";
// import { newVerification } from "@/actions/new-verification";
// import FormError from "../common/FormError";
// import FormSuccess from "../common/FormSuccess";

// export const NewVerificationForm = () => {
//   const [error, setError] = useState<string | undefined>();
//   const [success, setSuccess] = useState<string | undefined >();
  
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
  
//   const onSubmit = useCallback(() => {
//     if (success || error) return;
    
//     if (!token) {
//       setError("Missing token");
//       return;
//     }
//     newVerification(token)
//     .then((data) => {
//       setSuccess(data.success);
//       setError(data.error);
      
//     })
//     .catch(() => {
//       setError("something Went Wrong")
//     })
//   }, [token, success, error])
  
//   useEffect(() => {
//     onSubmit();
    
//   }, [onSubmit])
  
//   return (
//     <CardWrapper
//     headerLabel="Confirming Your Verification"
//     backButtonLabel="Back to Login"
//     backButtonHref="/auth/login"
//     >
//     <div className="flex items-center w-full justify-center">
    
//     {!success && !error && (
//       <BeatLoader />
      
//     )
//   }
//   <FormSuccess message={success} />
  
//   {!success && (
//     <FormError message={error} />)}
    
    
//     </div>
//     </CardWrapper>   
    
    
//   )  
  
// }