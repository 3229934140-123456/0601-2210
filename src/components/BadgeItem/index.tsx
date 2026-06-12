import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Badge } from '@/types';
import { getBadgeTypeColor } from '@/utils';

interface BadgeItemProps {
  badge: Badge;
  size?: 'small' | 'large';
  onClick?: () => void;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge, size = 'small', onClick }) => {
  const borderColor = getBadgeTypeColor(badge.type);

  return (
    <View
      className={size === 'large' ? styles.large : styles.small}
      onClick={onClick}
      style={{
        borderColor: badge.obtained ? borderColor : 'transparent',
      }}
    >
      <View className={badge.obtained ? styles.obtainedWrap : styles.lockWrap}>
        <Image
          className={styles.badgeImage}
          src={badge.image}
          mode="aspectFill"
          style={{ opacity: badge.obtained ? 1 : 0.4 }}
          onError={(e) => console.error('[BadgeItem] image error:', e)}
        />
        {!badge.obtained && (
          <View className={styles.lockMask}>
            <Text className={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
      <Text className={badge.obtained ? styles.name : styles.nameLocked}>
        {badge.name}
      </Text>
      {size === 'large' && (
        <Text className={styles.desc}>{badge.condition}</Text>
      )}
      {badge.obtained && size === 'large' && badge.obtainedDate && (
        <Text className={styles.date}>获得于 {badge.obtainedDate}</Text>
      )}
    </View>
  );
};

export default BadgeItem;
