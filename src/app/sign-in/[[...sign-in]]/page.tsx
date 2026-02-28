import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white">
       
        <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-200 p-6">
          <div className="w-full h-full min-h-[500px] rounded-2xl bg-gray-300 flex items-center justify-center text-gray-400 text-sm">
            <img
  src="/register_3.png"
  alt="BonVoyage"
  className="w-full h-full object-cover rounded-2xl"
/>
            
          </div>
        </div>

       
        <div className="w-full md:w-1/3 flex items-center justify-end p-8">
          <SignIn />
        </div>
      </div>
    </div>
  )
}