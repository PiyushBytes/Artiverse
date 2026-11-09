import { AnimatePresence, motion } from 'framer-motion'
export default function Toast({ message, onClose }) {
  return <AnimatePresence>{message && <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18}} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-lime/40 bg-[#11151d] px-5 py-3 text-sm shadow-xl" role="status">{message}<button onClick={onClose} className="ml-4 text-lime" aria-label="Dismiss">×</button></motion.div>}</AnimatePresence>
}