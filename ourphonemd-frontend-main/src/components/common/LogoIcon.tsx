"use client"
import React from 'react'
import logoIconWithText from "../../../public/images/opmd-logo.png"
import LogoIconOnly from "../../../public/images/logo-icon.png"

import Image from 'next/image'
export const LogoIcon = () => {
  return (
    <div>
      <Image src={logoIconWithText} alt="logo" width={120} height={80} />
    </div>
  )
}
export const SidebarLogoIcon = () => {
  return (
    <div>
      <Image src={LogoIconOnly} alt="logo" width={50} height={50} />
    </div>
  )
}

