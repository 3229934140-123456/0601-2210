import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import ActivityCard from '@/components/ActivityCard';
import { activities, guides } from '@/data/activities';
import classnames from 'classnames';

const ActivityPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const activityTypes = useMemo(() => {
    const set = new Set(activities.map((a) => a.type));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredActivities = useMemo(() => {
    if (typeFilter === 'all') return activities;
    return activities.filter((a) => a.type === typeFilter);
  }, [typeFilter]);

  const handleActivityClick = (activityId: string) => {
    console.log('[Activity] click activity:', activityId);
    const activity = activities.find((a) => a.id === activityId);
    if (activity && activity.availableSlots > 0 && !activity.isBooked) {
      Taro.showModal({
        title: '确认预约',
        content: `确定要预约"${activity.title}"吗？`,
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '预约成功！', icon: 'success' });
          }
        },
      });
    } else if (activity && activity.isBooked) {
      Taro.showToast({ title: '您已预约该活动', icon: 'none' });
    } else {
      Taro.showToast({ title: '该活动已满员', icon: 'none' });
    }
  };

  const handleGuideBooking = (guideId: string) => {
    console.log('[Activity] book guide:', guideId);
    Taro.navigateTo({ url: `/pages/guide-booking/index?id=${guideId}` });
  };

  const handleReminder = () => {
    console.log('[Activity] toggle closing reminder');
    Taro.showToast({ title: '闭馆提醒已开启', icon: 'success' });
  };

  return (
    <ScrollView className={styles.container} scrollY enhanced showScrollbar={false}>
      <View className={styles.section} style={{ marginTop: '$spacing-md' }}>
        <View className={styles.noticeCard}>
          <Text className={styles.noticeTitle}>📢 参观须知</Text>
          <Text className={styles.noticeText}>
            开放时间内可自由参观，16:30停止入馆。请爱护展品，禁止触摸。
          </Text>
          <View className={styles.hoursList}>
            <View className={styles.hourItem}>
              <Text className={styles.hourLabel}>周二至周日</Text>
              <Text className={styles.hourValue}>09:00 - 17:00</Text>
            </View>
            <View className={styles.hourItem}>
              <Text className={styles.hourLabel}>周一</Text>
              <Text className={styles.hourValue} style={{ color: '#F53F3F' }}>闭馆</Text>
            </View>
            <View className={styles.hourItem}>
              <Text className={styles.hourLabel}>闭馆提醒</Text>
              <Text
                className={styles.hourValue}
                style={{ color: '#2E7D5B' }}
                onClick={handleReminder}
              >
                点击开启 →
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader
          title="精彩活动"
          subtitle={`共${activities.length}场`}
          showMore={false}
        />
        <View className={styles.typeTabs}>
          {activityTypes.map((type) => (
            <View
              key={type}
              className={classnames(
                styles.typeTab,
                typeFilter === type && styles.typeTabActive
              )}
              onClick={() => {
                console.log('[Activity] filter type:', type);
                setTypeFilter(type);
              }}
            >
              <Text className={styles.typeTabText}>
                {type === 'all' ? '全部' : type}
              </Text>
            </View>
          ))}
        </View>

        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => handleActivityClick(activity.id)}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无该类型活动</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.guideSection}>
          <View className={styles.guideHeader}>
            <Text className={styles.guideTitle}>专业讲解员</Text>
            <Text
              className={styles.guideMore}
              onClick={() => Taro.navigateTo({ url: '/pages/guide-booking/index' })}
            >
              查看全部 →
            </Text>
          </View>

          <View className={styles.guideList}>
            {guides.slice(0, 3).map((guide) => (
              <View
                key={guide.id}
                className={styles.guideItem}
                onClick={() => handleGuideBooking(guide.id)}
              >
                <Image
                  className={styles.guideAvatar}
                  src={guide.avatar}
                  mode="aspectFill"
                  onError={(e) => console.error('[Activity] guide avatar error:', e)}
                />
                <View className={styles.guideInfo}>
                  <View className={styles.guideNameRow}>
                    <Text className={styles.guideName}>{guide.name}</Text>
                    <Text className={styles.guideRating}>⭐ {guide.rating}</Text>
                  </View>
                  <Text className={styles.guideSpecialty}>专长：{guide.specialty}</Text>
                  <View className={styles.guideMeta}>
                    <Text className={styles.guideMetaItem}>
                      {guide.experience}年经验
                    </Text>
                    {guide.languages.slice(0, 2).map((lang) => (
                      <Text key={lang} className={styles.guideMetaItem}>
                        {lang}
                      </Text>
                    ))}
                  </View>
                </View>
                <View
                  className={styles.guideBookBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGuideBooking(guide.id);
                  }}
                >
                  <Text className={styles.guideBookText}>预约</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityPage;
