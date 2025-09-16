"use client";

import { useEffect, useRef, useState } from "react";
import "./recruiter-envelope.css";

export function RecruiterEnvelope({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 800);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (wrapperRef.current && wrapperRef.current.matches(":hover")) {
        createSparkle(e.clientX, e.clientY);
      }
    };

    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement("div");
      sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: sparkleAnimation 0.6s ease-out forwards;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => {
        sparkle.remove();
      }, 600);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay" onClick={handleClose}>
      <div
        ref={wrapperRef}
        className={`wrapper ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lid one"></div>
        <div className="lid two"></div>
        <div className="envelope"></div>
        <div className="letter">
          <div className="letter-content">
            <h2>Hi!</h2>
            <p>
              I'm Gautam Krishna, M.Tech student from VIT Vellore. Excited to
              apply for the Full Stack Intern role at Succesship! With
              Next.js/React and ML experience, I am excited to learn from your
              innovative team and contribute to building impactful B2B
              automation solutions. Hope to work with the Succesship team and
              grow together Best regards, Gautam Krishna
            </p>
          </div>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
