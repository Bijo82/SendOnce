import { useParams } from 'react-router-dom'
import { BackgroundScene } from '../components/layout/BackgroundScene'
import { Header } from '../components/layout/Header'
import { RetrieveSection } from '../components/retrieve/RetrieveSection'

export function SharePage() {
  const { otp = '' } = useParams<{ otp: string }>()

  return (
    <div className="relative min-h-screen">
      <BackgroundScene />
      <div className="relative z-10">
        <Header />
        <RetrieveSection initialOtp={otp} />
      </div>
    </div>
  )
}
