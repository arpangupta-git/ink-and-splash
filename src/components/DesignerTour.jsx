import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function DesignerTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run tour once per user
    const hasSeenTour = localStorage.getItem('inkAndSplash_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => setRun(true), 1000); // Wait for scene to load
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('inkAndSplash_tour_seen', 'true');
    }
  };

  const steps = [
    {
      target: '.designer-container',
      content: 'Welcome to the 3D Designer! Let\'s take a quick tour of how to customize your apparel.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-layers',
      content: 'Here you can add your custom logos and images. You can manage multiple layers or delete them.',
      placement: 'right',
    },
    {
      target: '.tshirt-canvas',
      content: 'Once added, click and drag your logo directly on the T-shirt to perfectly position it. Use the slider below to scale it.',
      placement: 'center',
    },
    {
      target: '.tour-colors',
      content: 'Choose the base color for your apparel from our premium palette.',
      placement: 'top',
    },
    {
      target: '.tour-camera',
      content: 'Use these controls to zoom in for precise details, or flip the shirt to design on the back.',
      placement: 'left',
    },
    {
      target: '.tour-mode-switch',
      content: 'Switch to "Preview" mode to freely rotate the 3D model and see how it looks from every angle.',
      placement: 'bottom',
    },
    {
      target: '.tour-download',
      content: 'Once you love it, save a snapshot of your design and attach it to your order! Have fun designing!',
      placement: 'bottom',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#7c3aed',
          zIndex: 10000,
          backgroundColor: '#1e1e1e',
          textColor: '#f1f5f9',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
        },
        buttonClose: {
          display: 'none',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        },
        buttonNext: {
          backgroundColor: '#7c3aed',
          borderRadius: '8px',
          fontWeight: 600,
        },
        buttonBack: {
          color: '#94a3b8',
        },
        buttonSkip: {
          color: '#ef4444',
          fontWeight: 600,
        }
      }}
    />
  );
}
