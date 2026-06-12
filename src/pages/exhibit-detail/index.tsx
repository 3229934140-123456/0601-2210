import { useMemo, useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useRouter, navigateTo, showToast, showModal, makePhoneCall, getEnv, ENV_TYPE } from '@tarojs/taro';
import { getExhibitById } from '@/data/exhibits';
import { getQuizByExhibitId } from '@/data/quizzes';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration } from '@/utils';
import AudioPlayer from '@/components/AudioPlayer';
import styles from './index.module.scss';

const ExhibitDetailPage = () => {
  const router = useRouter();
  const exhibitId = router.params.id || 'ex1';
  const exhibit = useMemo(() => getExhibitById(exhibitId), [exhibitId]);
  const quiz = useMemo(() => getQuizByExhibitId(exhibitId), [exhibitId]);
  
  const { collectedExhibits, toggleCollectExhibit, isExhibitCollected, markExhibitVisited } = useAppStore();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const isCollected = exhibit ? isExhibitCollected(exhibit.id) : false;

  useEffect(() => {
    if (exhibit) {
      markExhibitVisited(exhibit.id);
    }
  }, [exhibit, markExhibitVisited]);

  if (!exhibit) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyHint}>展品不存在或已下架</View>
      </View>
    );
  }

  const handleCollect = () => {
    toggleCollectExhibit(exhibit.id);
    showToast({ title: !isCollected ? '已加入收藏' : '已取消收藏', icon: 'none' });
  };

  const handleStartQuiz = () => {
    if (!quiz) return;
    navigateTo({ url: `/pages/quiz/index?id=${quiz.id}` });
  };

  const handleNavigateToHall = () => {
    navigateTo({ url: `/pages/guide/index?hallId=${exhibit.hallId}` });
  };

  const handleShare = () => {
    const env = getEnv();
    if (env === ENV_TYPE.WEAPP) {
      showToast({ title: '请点击右上角「···」分享', icon: 'none' });
    } else if (env === ENV_TYPE.WEB) {
      if (navigator.share) {
        navigator.share({
          title: exhibit.name,
          text: exhibit.description,
          url: window.location.href,
        }).catch(() => {});
      } else {
        showModal({
          title: '分享展品',
          content: `分享「${exhibit.name}」给好友`,
          confirmText: '复制链接',
          success: (res) => {
            if (res.confirm) {
              navigator.clipboard?.writeText(window.location.href).then(() => {
                showToast({ title: '链接已复制', icon: 'success' });
              }).catch(() => {
                showToast({ title: '复制失败，请手动复制', icon: 'none' });
              });
            }
          },
        });
      }
    } else {
      showToast({ title: '请点击右上角分享', icon: 'none' });
    }
  };

  const handleCall = () => {
    makePhoneCall({ phoneNumber: '400-888-8888' }).catch(() => {});
  };

  return (
    <View className={styles.page}>
      <View className={styles.headerImage}>
        <Image
          className="image"
          src={exhibit.image}
          mode="aspectFill"
          onError={(e) => console.log('[ExhibitDetail] image error:', e)}
        />
        <View className={styles.imageOverlay} />
        <View className={styles.headerActions}>
          <View className={styles.iconButton} onClick={handleShare}>
            <Text>↗</Text>
          </View>
          <View className={styles.iconButton} onClick={handleCall}>
            <Text>📞</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <Text className={styles.exhibitName}>{exhibit.name}</Text>

        <View className={styles.metaRow}>
          <View className={styles.metaTag}>
            <Text>{exhibit.era}</Text>
          </View>
          <View className={styles.metaTag}>
            <Text>{exhibit.category}</Text>
          </View>
          {exhibit.audioLanguages.map((lang) => (
            <View key={lang} className={styles.metaTag}>
              <Text>{lang}讲解</Text>
            </View>
          ))}
        </View>

        <View className={styles.hallInfo}>
          <Text className={styles.icon}>📍</Text>
          <Text className={styles.hallName}>{exhibit.hallName}</Text>
          <View className={styles.navBtn} onClick={handleNavigateToHall}>
            <Text>导航前往</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>展品介绍</Text>
          </View>
          <Text
            className={styles.description}
            style={showFullDesc ? {} : { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {exhibit.description}
          </Text>
          <View className={styles.viewsRow}>
            <View className={styles.statsRow}>
              <Text>👁 {exhibit.views.toLocaleString()} 次浏览</Text>
              <Text>⏱ 建议观赏 {formatDuration(Math.round(exhibit.description.length / 20) + 5)}</Text>
            </View>
            <Text style={{ color: '#8B4513' }}>
              {showFullDesc ? '收起' : '展开全部'}
            </Text>
          </View>
        </View>

        <View className={styles.audioSection}>
          <AudioPlayer
            exhibitName={exhibit.name}
            languages={exhibit.audioLanguages}
          />
        </View>

        {quiz && (
          <View className={styles.quizCard} onClick={handleStartQuiz}>
            <View className={styles.quizIcon}>
              <Text>❓</Text>
            </View>
            <View className={styles.quizInfo}>
              <Text className={styles.quizTitle}>互动问答</Text>
              <Text className={styles.quizDesc}>回答问题获得积分和纪念章奖励</Text>
            </View>
            <View className={styles.startBtn}>
              <Text>开始答题</Text>
            </View>
          </View>
        )}

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>参观小贴士</Text>
          </View>
          <Text className={styles.description}>
            1. 请使用博物馆提供的耳麦收听讲解，音量请适中以免影响他人
          </Text>
          <Text className={styles.description}>
            2. 拍照请勿使用闪光灯，以免对文物造成损害
          </Text>
          <Text className={styles.description}>
            3. 请勿触摸展品，展柜玻璃有一定反光，建议拍摄时调整角度
          </Text>
          <Text className={styles.description}>
            4. 完成互动问答可获得纪念章一枚，集齐更多纪念章解锁成就
          </Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={`${styles.collectBtn} ${isCollected ? styles.active : ''}`}
          onClick={handleCollect}
        >
          <Text className={styles.icon}>{isCollected ? '⭐' : '☆'}</Text>
          <Text className={styles.text}>{isCollected ? '已收藏' : '收藏'}</Text>
        </View>
        <View className={styles.collectBtn}>
          <Text className={styles.icon}>🗺</Text>
          <Text className={styles.text}>地图位置</Text>
        </View>
        <View className={styles.mainBtn} onClick={() => showToast({ title: '讲解已开始', icon: 'none' })}>
          <Text>🎧</Text>
          <Text>开始讲解</Text>
        </View>
      </View>
    </View>
  );
};

export default ExhibitDetailPage;
