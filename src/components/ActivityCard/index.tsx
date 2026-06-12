import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Activity } from '@/types';
import classnames from 'classnames';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const handleClick = () => {
    console.log('[ActivityCard] click:', activity.id);
    if (onClick) {
      onClick();
    }
  };

  const slotPercent = Math.round((activity.availableSlots / activity.totalSlots) * 100);
  const isFull = activity.availableSlots === 0;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={activity.image}
          mode="aspectFill"
          onError={(e) => console.error('[ActivityCard] image error:', e)}
        />
        <View className={styles.typeTag}>
          <Text className={styles.typeText}>{activity.type}</Text>
        </View>
        {activity.isBooked && (
          <View className={styles.bookedTag}>
            <Text className={styles.bookedText}>已预约</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{activity.title}</Text>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoDot}></Text>
            <Text className={styles.infoText}>{activity.date}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoDot}></Text>
            <Text className={styles.infoText}>{activity.time}</Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
          <Text className={styles.infoDot}></Text>
            <Text className={styles.infoText}>{activity.location}</Text>
          </View>
        </View>
        <View className={styles.progressWrap}>
          <View className={styles.progressBar}>
            <View
              className={classnames(styles.progressFill, isFull && styles.full)}
              style={{ width: `${100 - slotPercent}%` }}
            ></View>
          </View>
          <Text className={classnames(styles.slotText, isFull && styles.fullText)}>
            {isFull ? '已满员' : `剩余${activity.availableSlots}个名额`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
