import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showMore?: boolean;
  onMoreClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  showMore = true,
  onMoreClick,
}) => {
  const handleMore = () => {
    if (onMoreClick) {
      onMoreClick();
    } else {
      Taro.showToast({ title: '查看更多', icon: 'none' });
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.left}>
        <View className={styles.decoration}></View>
        <Text className={styles.title}>{title}</Text>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showMore && (
        <View className={styles.more} onClick={handleMore}>
          <Text className={styles.moreText}>更多</Text>
          <Text className={styles.moreArrow}>›</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
