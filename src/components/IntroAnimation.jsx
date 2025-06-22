// components/IntroAnimation.jsx
import { motion } from "framer-motion";
import "./IntroAnimation.css";

const IntroAnimation = ({ text, onFinish }) => {
  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 1 }}
      onAnimationComplete={onFinish}
    >
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="intro-text"
      >
        {text}
      </motion.h1>
    </motion.div>
  );
};

export default IntroAnimation;
