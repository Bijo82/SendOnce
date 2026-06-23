import { motion } from 'framer-motion'
import { FileSharePanel } from '../components/file-sharing/FileSharePanel'
import { TextSharePanel } from '../components/text-sharing/TextSharePanel'
import { BackgroundScene } from '../components/layout/BackgroundScene'
import { Header } from '../components/layout/Header'
import { RetrieveSection } from '../components/retrieve/RetrieveSection'

export function HomePage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundScene />
      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-7xl px-4 pb-8">
          {/* Split panels */}
          <div className="relative flex flex-col gap-6 lg:flex-row lg:gap-0">
            {/* Left - File Sharing */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex-1 lg:pr-6"
            >
              <FileSharePanel />
            </motion.div>

            {/* Glowing divider */}
            <div className="relative hidden lg:flex lg:w-px lg:shrink-0" aria-hidden>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent" />
              <motion.div
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Mobile divider */}
            <div className="relative h-px lg:hidden" aria-hidden>
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            </div>

            {/* Right - Text Sharing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex-1 lg:pl-6"
            >
              <TextSharePanel />
            </motion.div>
          </div>
        </main>

        <RetrieveSection />
      </div>
    </div>
  )
}
