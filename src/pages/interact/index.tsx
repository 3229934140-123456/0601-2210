import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { badges } from '@/data/badges';
import { quizzes } from '@/data/quizzes';
import { getBadgeTypeColor } from '@/utils';
import { useAppStore } from '@/store/useAppStore';
import classnames from 'classnames';

const InteractPage: React.FC = () => {
  const { userProgress, userProfile } = useAppStore();

  const obtainedCount = userProgress.collectedBadges.length;
  const totalBadges = badges.length;
  const badgeProgress = Math.round((obtainedCount / totalBadges) * 100);
  const quizCompletedCount = userProgress.completedQuizzes.length;
  const totalQuizCount = quizzes.length;
  const quizProgress = Math.round((quizCompletedCount / totalQuizCount) * 100);
  const nextLevelPoints = userProfile.level * 500;
  const levelProgress = Math.min(Math.round((userProfile.points / nextLevelPoints) * 100), 100);

  const displayBadges = badges.slice(0, 9);
  const pendingQuizzes = quizzes
    .filter((q) => !userProgress.completedQuizzes.includes(q.id))
    .slice(0, 3);
  const completedQuizzesList = quizzes
    .filter((q) => userProgress.completedQuizzes.includes(q.id))
    .slice(0, 2);

  const handleBadgeClick = (badge) => {
    console.log('[Interact] click badge:', badge.id);
    Taro.navigateTo({ url: '/pages/badge-wall/index' });
  };

  const handleQuizClick = (quizId) => {
    console.log('[Interact] click quiz:', quizId);
    Taro.navigateTo({ url: `/pages/quiz/index?id=${quizId}` });
  };

  const badgeEmojiMap = {
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉',
    special: '💎',
  };

  return (
    <ScrollView className={styles.container} scrollY enhanced showScrollbar={false}>
      <View className={styles.statsCard}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{obtainedCount}/{totalBadges}</Text>
            <Text className={styles.statLabel}>纪念章收集</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{quizCompletedCount}</Text>
            <Text className={styles.statLabel}>答题完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{userProfile.points}</Text>
            <Text className={styles.statLabel}>积分总数</Text>
          </View>
        </View>
        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>升级进度 Lv.{userProfile.level} → Lv.{userProfile.level + 1}</Text>
            <Text className={styles.progressText}>{levelProgress}%</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${levelProgress}%` }}></View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader
          title="我的纪念章"
          subtitle={`${badgeProgress}% 已收集`}
          onMoreClick={() => Taro.navigateTo({ url: '/pages/badge-wall/index' })}
        />
        <View className={styles.badgeGrid}>
          {displayBadges.map((badge) => {
            const obtained = userProgress.collectedBadges.includes(badge.id);
            return (
              <View
                key={badge.id}
                className={classnames(
                  styles.badgeCard,
                  obtained && styles.badgeCardObtained
                )}
                onClick={() => handleBadgeClick(badge)}
              >
                <View
                  className={styles.badgeIconWrap}
                  style={{
                    background: obtained
                      ? `linear-gradient(135deg, ${getBadgeTypeColor(badge.type)}33 0%, ${getBadgeTypeColor(badge.type)}11 100%)`
                      : undefined,
                  }}
                >
                  <Text
                    className={classnames(
                      styles.badgeIcon,
                      obtained && styles.badgeIconActive
                    )}
                  >
                    {badgeEmojiMap[badge.type] || '🏅'}
                  </Text>
                </View>
                <Text
                  className={classnames(
                    styles.badgeName,
                    !obtained && styles.badgeNameLocked
                  )}
                >
                  {obtained ? badge.name : '???'}
                </Text>
                <Text className={styles.badgeRarity}>{badge.rarity}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.quizSection}>
          <View className={styles.quizHeader}>
            <View>
              <Text className={styles.quizTitle}>互动问答</Text>
              <Text className={styles.quizSubtitle}>
                完成 {quizCompletedCount}/{totalQuizCount} · {quizProgress}%
              </Text>
            </View>
          </View>

          <View className={styles.quizList}>
            {pendingQuizzes.map((quiz) => (
              <View
                key={quiz.id}
                className={styles.quizItem}
                onClick={() => handleQuizClick(quiz.id)}
              >
                <View className={styles.quizItemIcon}>❓</View>
                <View className={styles.quizItemContent}>
                  <Text className={styles.quizItemTitle}>{quiz.question}</Text>
                  <Text className={styles.quizItemMeta}>
                    展品答题 · 可获得 +20 积分
                  </Text>
                </View>
                <View className={styles.quizItemStatus}>
                  <Text className={classnames(styles.statusTag, styles.statusPending)}>
                    待完成
                  </Text>
                </View>
              </View>
            ))}

            {completedQuizzesList.map((quiz) => (
              <View
                key={quiz.id}
                className={styles.quizItem}
                onClick={() => handleQuizClick(quiz.id)}
              >
                <View className={styles.quizItemIcon}>✅</View>
                <View className={styles.quizItemContent}>
                  <Text className={styles.quizItemTitle}>{quiz.question}</Text>
                  <Text className={styles.quizItemMeta}>已完成 · +20 积分</Text>
                </View>
                <View className={styles.quizItemStatus}>
                  <Text className={classnames(styles.statusTag, styles.statusCompleted)}>
                    已完成
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.actionRow}>
            <View
              className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
              onClick={() => Taro.navigateTo({ url: '/pages/badge-wall/index' })}
            >
              <Text className={styles.actionBtnText}>查看纪念章墙</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
              onClick={() => Taro.navigateTo({ url: '/pages/quiz/index' })}
            >
              <Text className={styles.actionBtnText}>开始答题</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default InteractPage;
