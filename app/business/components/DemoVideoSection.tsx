'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DEMO_VIDEO_URL =
  'https://moilapp-my.sharepoint.com/:v:/p/ablad/IQBBjjLycVvTTbVRKZ9loSE3AXC7nN_1EZyHBsbVkoBIHPI?download=1';

type DemoVideoCopy = {
  tag: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  featureOne: string;
  featureTwo: string;
  featureThree: string;
  viewportHint: string;
  playing: string;
  paused: string;
  playLabel: string;
  pauseLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  fullscreenLabel: string;
};

type DemoVideoSectionProps = {
  copy: DemoVideoCopy;
};

function PlayIcon({ paused }: { paused: boolean }) {
  return paused ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" fill="currentColor" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      {muted ? (
        <path d="m17 9 4 4m0-4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      ) : (
        <path d="M16 8.4a5 5 0 0 1 0 7.2M18.6 6a8.2 8.2 0 0 1 0 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      )}
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export function DemoVideoSection({ copy }: DemoVideoSectionProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInViewRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    // Request audible playback. Browsers may block this until the visitor's
    // first interaction; in that case the video remains paused instead of
    // silently playing and resumes with sound on that first interaction.
    video.muted = false;
    video.volume = 0.9;
    setIsMuted(false);
    try {
      await video.play();
    } catch {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldPlay = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        isInViewRef.current = shouldPlay;

        if (shouldPlay && !reduceMotion && document.visibilityState === 'visible') {
          void playVideo();
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9] }
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        video.pause();
      } else if (isInViewRef.current && !reduceMotion) {
        void playVideo();
      }
    };

    const handleUserActivation = () => {
      if (isInViewRef.current && video.paused) void playVideo();
    };

    observer.observe(frame);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('pointerdown', handleUserActivation);
    document.addEventListener('keydown', handleUserActivation);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('pointerdown', handleUserActivation);
      document.removeEventListener('keydown', handleUserActivation);
      video.pause();
    };
  }, [playVideo]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.volume = 0.9;
      setIsMuted(false);
      void video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const enterFullscreen = () => {
    const frame = frameRef.current;
    if (frame?.requestFullscreen) void frame.requestFullscreen();
  };

  const seek = (value: string) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(value);
    setCurrentTime(video.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="demo" className="demo-section" aria-labelledby="demo-title">
      <div className="demo-section__backdrop" aria-hidden="true" />
      <div className="demo-glow demo-glow--orange" aria-hidden="true" />
      <div className="demo-glow demo-glow--purple" aria-hidden="true" />

      <div className="demo-section__inner">
        <div className="demo-section__heading">
          <div className="section-tag rv">{copy.tag}</div>
          <h2 id="demo-title" className="section-headline rv">
            {copy.headline} <span>{copy.headlineHighlight}</span>
          </h2>
          <p className="demo-section__description rv">{copy.description}</p>
          <div className="demo-feature-list rv" aria-label="Demo highlights">
            {[copy.featureOne, copy.featureTwo, copy.featureThree].map((feature) => (
              <span key={feature}><i aria-hidden="true" />{feature}</span>
            ))}
          </div>
        </div>

        <div className="demo-stage rv d2">
          <div className="demo-stage__topbar" aria-hidden="true">
            <div className="demo-window-dots"><i /><i /><i /></div>
            <div className="demo-window-title"><span /> moilapp.com / product demo</div>
            <div className="demo-live-pill"><i /> {isPlaying ? copy.playing : copy.paused}</div>
          </div>

          <div ref={frameRef} className="demo-video-frame">
            <video
              ref={videoRef}
              className="demo-video"
              src={DEMO_VIDEO_URL}
              preload="metadata"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onDurationChange={(event) => setDuration(event.currentTarget.duration)}
              onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
              onEnded={() => setIsPlaying(false)}
            >
              Your browser does not support HTML video.
            </video>

            {!isPlaying && (
              <button className="demo-center-play" type="button" onClick={togglePlayback} aria-label={copy.playLabel}>
                <PlayIcon paused />
                <span>{copy.playLabel}</span>
              </button>
            )}

            <div className="demo-video-controls">
              <button type="button" onClick={togglePlayback} aria-label={isPlaying ? copy.pauseLabel : copy.playLabel}>
                <PlayIcon paused={!isPlaying} />
              </button>
              <span className="demo-video-time">{formatTime(currentTime)}</span>
              <input
                aria-label="Video progress"
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => seek(event.target.value)}
                style={{ '--demo-progress': `${progress}%` } as React.CSSProperties}
              />
              <span className="demo-video-time">{formatTime(duration)}</span>
              <button type="button" onClick={toggleMute} aria-label={isMuted ? copy.unmuteLabel : copy.muteLabel}>
                <VolumeIcon muted={isMuted} />
              </button>
              <button type="button" onClick={enterFullscreen} aria-label={copy.fullscreenLabel}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.5 4H4v4.5M15.5 4H20v4.5M20 15.5V20h-4.5M8.5 20H4v-4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </div>

          <div className="demo-stage__footer">
            <span><i className={isPlaying ? 'is-playing' : ''} />{copy.viewportHint}</span>
            <span>Moil · AI business platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}
