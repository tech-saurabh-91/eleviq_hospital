import React from 'react'
import SignInForm from '@/components/auth/signin-form'
import Image from 'next/image'
import logoIcon from '../../../../public/images/opmd-logo.png'
const SignInPage = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4 relative overflow-hidden">
      {/* Medical equipment background elements */}
      <div className="absolute inset-0 file:bg-customTeal/50 bg-cover bg-center w-full h-full bg-blend-multiply
        bg-[url('https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg?t=st=1746139347~exp=1746142947~hmac=c73e58a65605a23c92ca600973692cc8372440233a35d7e4552b6ae9d820da4c&w=1060')] ">
        <div className="absolute inset-0 bg-customTeal/20"></div>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-44 -my-16 h-44 relative">
            <Image src={logoIcon} alt="Logo" fill className="object-contain" />
          </div>
        </div>
        
        
        <SignInForm />
        
        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="font-bold text-red-600 text-sm">CUSTOMER SUPPORT/APPOINTMENT BY PHONE</p>
          <p className="font-bold text-gray-900">(270) 769-0110</p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
