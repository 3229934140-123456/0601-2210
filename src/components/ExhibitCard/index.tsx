import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Exhibit } from '@/types';
import classnames from 'classnames';

interface ExhibitCardProps {
  exhibit: Exhibit;
  visited?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const ExhibitCard: React.FC<ExhibitCardProps> = ({ exhibit, visited, onClick, compact }) => {
  const handleClick = () => {
    console.log('[ExhibitCard] click exhibit:', exhibit.id);
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/exhibit-detail/index?id=${exhibit.id}`,
      });
    }
  };

  return (
    <View
      className={classnames(styles.card, compact && styles.compact)}
      onClick={handleClick}
    >
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={exhibit.image}
          mode="aspectFill"
          onError={(e) => console.error('[ExhibitCard] image error:', e)}
        />
        {visited && (
          <View className={styles.visitedBadge}>
            <Text className={styles.visitedText}>已参观</Text>
          </View>
        )}
        <View className={styles.categoryTag}>
          <Text className={styles.categoryText}>{exhibit.category}</Text>
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{exhibit.name}</Text>
        {!compact && (
          <Text className={styles.era}>
            {exhibit.era} · {exhibit.hallName}
          </Text>
        )}
        {!compact && (
          <Text className={styles.desc}>{exhibit.description}</Text>
        )}
        <View className={styles.footer}>
          <View className={styles.langList}>
            {exhibit.audioLanguages.slice(0, 2).map((lang) => (
              <View key={lang} className={styles.langTag}>
                <Text className={styles.langText}>{lang}</Text>
              </View>
            ))}
            {exhibit.audioLanguages.length > 2 && (
                <Text className={styles.langMore}>+{exhibit.audioLanguages.length - 2}</Text>
              )}
          </View>
          <Text className={styles.views}>浏览 {exhibit.views.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default ExhibitCard;
