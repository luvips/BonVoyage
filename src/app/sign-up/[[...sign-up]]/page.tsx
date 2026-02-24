import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'
import COVER_IMAGE from '../../../../public/register.jpg'

const colors = {
  primary:"#060606",
  background:"#f5f5f5",
  disabled:"#D9D9D9",
}
  
export default function Page() {
  return(
<div className='w-full h-screen flex items-start'>
  <div className='relative w-1/2 h-full flex flex-col'>
  <div className='absolute top-[20%] left-[10%] flex flex col'>
    <h1 className='text-4xl text-white font bold my-4'>Tu proxima aventura te espera</h1>
    <p className='text-xl text-white font normal'>Regístrate para comenzar tu viaje</p>

  </div>
  <Image src={COVER_IMAGE} alt="Cover" className="w-full h-full object-cover" />
  </div>

  <div className='w-1/2 h-full bg-[#f5f5f5] flex flex-col p-20'>
  <h1 className='text-xl text-[#060606] font-semibold'>VonBoyage</h1>

  </div>
  <SignUp />

</div>
  ) 
  
}


//<SignUp />