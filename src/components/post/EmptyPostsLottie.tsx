import React from "react";
import Lottie from "lottie-react";
import emptyAnimation from "./empty-lottie.json";

const EmptyPostsLottie: React.FC<{ className?: string }> = ({ className }) => (
  <Lottie animationData={emptyAnimation} loop={true} className={className} />
);

export default EmptyPostsLottie;
