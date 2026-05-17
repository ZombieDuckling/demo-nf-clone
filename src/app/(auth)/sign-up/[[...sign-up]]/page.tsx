import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e6-40c4-821e-42b6e8a6edd7/f9368347-e982-4856-a5a4-396796381f28/US-en-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}
      />
      <div className="relative z-10">
        <SignUp />
      </div>
    </div>
  )
}
