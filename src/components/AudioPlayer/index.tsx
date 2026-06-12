import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface AudioPlayerProps {
  languages: string[];
  title?: string;
  currentLang?: string;
  onLangChange?: (lang: string) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  languages,
  title = '语音讲解',
  currentLang,
  onLangChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration] = useState(180);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedLang, setSelectedLang] = useState(currentLang || languages[0] || '中文');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    console.log('[AudioPlayer] toggle play:', !isPlaying, 'lang:', selectedLang);
    if (isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      Taro.showToast({ title: `正在播放${selectedLang}讲解`, icon: 'none' });
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= duration) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            return 0;
          }
          setProgress((next / duration) * 100);
          return next;
        });
      }, 1000);
    }
  };

  const handleLangSelect = (lang: string) => {
    console.log('[AudioPlayer] select lang:', lang);
    setSelectedLang(lang);
    setProgress(0);
    setCurrentTime(0);
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    }
    onLangChange && onLangChange(lang);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = () => {
    Taro.showToast({ title: '拖动调整进度', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        <View className={styles.langList}>
          {languages.map((lang) => (
            <View
              key={lang}
              className={classnames(
                styles.langTag,
                selectedLang === lang && styles.langTagActive
              )}
              onClick={() => handleLangSelect(lang)}
            >
              <Text
                className={classnames(
                  styles.langText,
                  selectedLang === lang && styles.langTextActive
                )}
              >
                {lang}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.player}>
        <View
          className={classnames(styles.playBtn, isPlaying && styles.playingBtn)}
          onClick={handlePlayPause}
        >
          <Text className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </View>

        <View className={styles.progressWrap} onClick={handleSeek}>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></View>
            <View
              className={styles.progressThumb}
              style={{ left: `${progress}%` }}
            ></View>
          </View>
          <View className={styles.timeRow}>
            <Text className={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text className={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;
