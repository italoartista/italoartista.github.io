import dynamic from 'next/dynamic'

const ParticleSystem = dynamic(() => import('@/components/ParticleSystem'), { ssr: false })

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <ParticleSystem />
      <div className="absolute top-4 left-4 z-10 p-2 bg-black rounded">
        <h1 className="text-4xl font-bold text-white" id="artist-name"></h1>
      </div>
    </main>
  )
}

